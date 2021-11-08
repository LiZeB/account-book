const express = require("express");
const router = express.Router();
const querystring = require("querystring");
const Process = require("../src/process");
const { OriginalData } = require('../model/original-data.js')
const { ZfbKeys, ZfbData } = require("../model/zfb-data.js");
const { WxKeys, WxData } = require("../model/wx-data.js");

const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const iconv = require("iconv-lite");

const WXINFO = {
  infoKeys: WxKeys,
  startIndex: 15,
};

const ZFBINFO = {
  infoKeys: ZfbKeys,
  startIndex: 2,
  endIndex: -20,
};

class ParseData {
  constructor(body, req, type, encoding = "utf8") {
    this._encoding = encoding;
    this._info = this._getBaseInfo(body, req);
    this._fileName = this._getFileName();
    /**
     * NOTE: 原始账单文件保存在外层的data/original-data/文件夹下
     */
    this._filePath = path.resolve(
      __dirname,
      `../../data/original-data/${this._fileName}`
    );
    this._type = type.toLowerCase();
    this._parsedData = [];
    this._parsedData = this.writeStream(body).then(() => {
      return this.readStream().then((readArr) => {
        return this._parseData(readArr);
      });
    });
  }

  writeStream(body) {
    return new Promise((resolve, reject) => {
      const minIndex =
        body.indexOf(this._info["Content-Type"]) +
        this._info["Content-Type"].length;
      const maxIndex = body.indexOf(
        `--${this._info["ReqHeader-Content-Type"]
          .split("; ")[1]
          .replace("boundary=", "")}--`
      );
      const binaryData = body.slice(minIndex, maxIndex);
      const ws = fs.createWriteStream(this._filePath);
      ws.write(iconv.decode(binaryData, this._encoding), "utf8");
      ws.end();
      ws.on('finish', () => { resolve(); });
    });
  }

  readStream() {
    return new Promise((resolve, reject) => {
      let readArr = [];
      fs.createReadStream(this._filePath)
        .pipe(
          csv.parse({
            headers: false,
            ignoreEmpty: true,
          })
        )
        .on("error", (err) => reject(err))
        .on("data", (row) => {
          readArr.push(row);
        })
        .on("end", () => {
          resolve(readArr);
        });
    });
  }

  _getFileName() {
    /**
     * 操作示例
     * file['Content-Disposition']=' form-data; name="files"; filename="alipay_record_20211020_191631.csv"'
     */
    const fileInfo = this._info["Content-Disposition"].split("; ");
    const fileNameIndex = fileInfo.findIndex((item) => {
      return item.indexOf("filename=") !== -1;
    });
    return iconv.decode(fileInfo[fileNameIndex].slice(10, -1), this._encoding); // 防止中文乱码
  }

  _getBaseInfo(body, req) {
    const file = querystring.parse(body, "\r\n", ":");
    const result = {};
    result["ReqHeader-Content-Type"] = req.headers["content-type"].trim();
    result["Content-Type"] = file["Content-Type"].trim();
    result["Content-Disposition"] = file["Content-Disposition"].trim();
    return result;
  }

  _parseData(inputArr) {
    let start = 0,
      end = inputArr.length,
      dataKeys;
    if (this._type === "zfb") {
      start = ZFBINFO.startIndex;
      end += ZFBINFO.endIndex;
      dataKeys = ZFBINFO.infoKeys;
    }
    if (this._type === "wx") {
      start = WXINFO.startIndex;
      dataKeys = WXINFO.infoKeys;
    }

    let outputArr = [];
    for (let i = start; i < end; i++) {
      let one = Object.keys(dataKeys).reduce((pre, cur, index) => {
        if(cur === 'dealTime' && this._type === "zfb") {
          index = 10;  // 交易时间的索引
        }
        let prop = cur,
          descriptor = {
            value: inputArr[i][index].replace(/¥/, "").trim(),
            enumerable: true,
          };
        return Object.defineProperty(pre, prop, descriptor);
      }, {});
      Object.defineProperty(one, "file", {
        value: this._fileName,
        enumerable: true,
      });
      const consumer = this._fileName.split("_")[0];
      Object.defineProperty(one, "consumer", {
        value: consumer,
        enumerable: true,
      });
      outputArr = outputArr.concat(one);
    }
    return outputArr;
  }

  async getParsedData() {
    const fileName = this._fileName;
    const dataArray = await this._parsedData;
    return {
      fileName,
      dataArray,
    };
  }
}

/**
 * NOTE
 * 1. 从客户端上直接下载下来的账单格式是不一致的，支付宝账单格式是 gbk, 微信账单格式是 utf8;
 * 2. 通过写流在 account-book/data/original-data/ 下备份的账单文件格式都是 utf8;  
 * 3. 根据原始账单和备份账单的差别，ParseData 类的 encoding 参数是不一样的
 */
// 1. 上传支付宝消费记录
router.post("/uploadZfb", (req, res, next) => {
  let body = "";
  req
    .setEncoding("binary")
    .on("data", (str) => {
      body += str;
    })
    .on("end", async () => {
      const zfbParseData = new ParseData(body, req, "zfb", "utf8");
      const info = await zfbParseData.getParsedData();

      if (info.dataArray.length) {
        ZfbData.find({
          file: info.fileName,
        }).then((queryData) => {
          if (!queryData.length) {
            ZfbData.insertMany(info.dataArray)
              .then(() => {
                console.log(`支付宝账单[${info.fileName}]数据上传成功！`);
                res.send({
                  type: 0,
                });
              }).then(() => {
                new Process(ZfbData, OriginalData, 'zfb');
              });
          }
        });
      }
    });
});

// 2. 上传微信消费记录
router.post("/uploadWx", (req, res, next) => {
  let body = "";
  req
    .setEncoding("binary")
    .on("data", (str) => {
      body += str;
    })
    .on("end", async () => {
      const wxParseData = new ParseData(body, req, "wx", "utf8");
      const info = await wxParseData.getParsedData();

      if (info.dataArray.length) {
        WxData.find({
          file: info.fileName,
        }).then((queryData) => {
          if (!queryData.length) {
            WxData.insertMany(info.dataArray)
              .then(() => {
                console.log(`微信账单[${info.fileName}]上传成功！`);
                res.send({
                  type: 0,
                });
              }).then(() => {
                /**
                 * TODO: 对微信原始账单数据进行治理，便于统一数据结构
                 */
              });
          }
        });
      }
    });
});

module.exports = router;
