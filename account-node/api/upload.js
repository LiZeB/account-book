const express = require('express')
const router = express.Router()
const querystring = require('querystring')

const { ZfbKeys, ZfbData } = require('../model/zfb-data.js')
const { WxKeys, WxData } = require('../model/wx-data.js')

const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const iconv = require('iconv-lite');

// 获取基础信息
function getBaseInfo(body, req) {
  let file = querystring.parse(body, '\r\n', ':');

  let info = {};
  info['ReqHeader-Content-Type'] = req.headers['content-type'].trim();  
  info['Content-Type'] = file['Content-Type'].trim();
  info['Content-Disposition'] = file['Content-Disposition'].trim();
  
  return info;
}
// 判断文件或文件夹是否存在
function isFileExist(path) {
  return new Promise((resolve) => {
    fs.exists(path, (isExist) => {
      resolve(isExist);
    });
  });
}
// 获取文件名称
function getFileName(info) {
  let fileInfo = info['Content-Disposition'].split('; '); // file['Content-Disposition']=' form-data; name="files"; filename="alipay_record_20211020_191631.csv"'

  for (let value in fileInfo) {
    if (fileInfo[value].indexOf("filename=") != -1) {
      return decode(fileInfo[value], 'utf8').slice(10, -1);
    }
  }
}
// 去掉不必要的边界字符
function simplifyBody(body, info) {
  let minIndex = body.indexOf(info['Content-Type']) + info['Content-Type'].length,
      maxIndex = body.indexOf(`--${info['ReqHeader-Content-Type'].split('; ')[1].replace('boundary=', '')}--`);
  return body.slice(minIndex, maxIndex);
}
// 解决中文乱码
function decode(data, encoding) {
  return iconv.decode(data, encoding); // 解决中文乱码
}
// 写入流
function writeStream(data, filePath, encoding) {
  const ws = fs.createWriteStream(filePath); 
  ws.write(decode(data, encoding), 'utf8');
  ws.end();
}
// 读取流
function readStream(filePath) {
  return new Promise((resolve, reject) => {
    let readArr = [];
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: false, ignoreEmpty: true }))
      .on('error', err => reject(err))
      .on('data', (row) => {
        readArr.push(row);
      })
      .on('end', () => {
        resolve(readArr);
      });
  })
  
}
// 获取入库数据
function getSaveData(inputArr, start, end, dataKeys, fileName) {
  let outputArr = [];
  let minIndex = start || 0,
      maxIndex = end || inputArr.length;
  for (let i=minIndex; i<maxIndex; i++) {
    let one = Object.keys(dataKeys).reduce((pre, cur, index) => {
      let prop = cur, descriptor = { value: inputArr[i][index].replace(/¥/, '').trim(), enumerable: true };
      return Object.defineProperty(pre, prop, descriptor);
    }, {})
    Object.defineProperty(one, 'file', { value: fileName, enumerable: true }); // 标识文件来源
    outputArr = outputArr.concat(one);
  }

  return outputArr;
}
// 数据批量入库
function saveData(fileName, type, arr) {
  return new Promise((resolve, reject) => {
    switch(type){
      case 'Zfb':
        ZfbData.find({file: fileName}).then((res) => { // 判断文件内容是否已入库
          if(!res.length){
            ZfbData.insertMany(arr).then((data) => {
              resolve(data)
            }).catch(err => reject(err));
          }
        });
        break;
      case 'Wx':
        WxData.find({file: fileName}).then((res) => {
          if(!res.length){
            WxData.insertMany(arr).then((data) => {
              resolve(data)
            }).catch(err => reject(err));
          }
        });
        break;
    }
  })
}

// 1. 上传支付宝消费记录
router.post("/uploadZfb", (req, res, next) => {
  let body = '';
  req.setEncoding('binary')
    .on('data', (str) => {
      body += str;
    })
    .on('end', async () => {
      const info = getBaseInfo(body, req);

      const dirName = 'ZfbCsv', fileName = getFileName(info);
      const dirPath = path.resolve(__dirname, `../${dirName}`), filePath = path.resolve(__dirname, `../${dirName}/${fileName}`);
      
      const dirExisted = await isFileExist(dirPath);
      if(!dirExisted){
        fs.mkdir(dirPath, (err) => {
          if(err) throw err; 
        });
      }

      const binaryData = simplifyBody(body, info);
      await writeStream(binaryData, filePath, 'gbk');

      await readStream(filePath)
        .then((readArr) => {
          const writeArr = getSaveData(readArr, 2, readArr.length-20, ZfbKeys, fileName);
          saveData(fileName, 'Zfb', writeArr)
            .then(data => {
              res.json({
                type: 0,
                data,
              });
            })
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err));
  })
})

// 2. 上传微信消费记录
router.post("/uploadWx", (req, res, next) => {
  let body = '';
  req.setEncoding('binary')
    .on('data', (str) => {
      body += str;
    })
    .on('end', async () => {
      const info = getBaseInfo(body, req);

      const dirName = 'ZfbCsv', fileName = getFileName(info);
      const dirPath = path.resolve(__dirname, `../${dirName}`), filePath = path.resolve(__dirname, `../${dirName}/${fileName}`);
      
      const dirExisted = await isFileExist(dirPath);
      if(!dirExisted){
        fs.mkdir(dirPath, (err) => {
          if(err) throw err; 
        });
      }

      const binaryData = simplifyBody(body, info);
      await writeStream(binaryData, filePath, 'utf8');

      await readStream(filePath)
        .then((readArr) => {
          const writeArr = getSaveData(readArr, 15, readArr.length, WxKeys, fileName);
          saveData(fileName, 'Wx', writeArr)
            .then(data => {
              res.json({
                type: 0,
                data,
              });
            })
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err));
  })
})

module.exports = router