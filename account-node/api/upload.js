const express = require('express')
const router = express.Router()
const querystring = require('querystring')

const { ZfbKeys, ZfbData } = require('../model/zfb-data.js')
const { WxKeys, WxData } = require('../model/wx-data.js')

const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const iconv = require('iconv-lite');

// 判断文件或文件夹是否存在
function isFileExist(path) {
  return fs.exists(path, (isExist) => {
    return isExist;
  });
}

// 1. 上传支付宝消费记录
router.post("/uploadZfb", (req, res, next) => {
  let body = '';
  req.setEncoding('binary')
    .on('data', (str) => {
      body += str;
    })
    .on('end', () => {
      let file = querystring.parse(body, '\r\n', ':');
      let fileInfo = file['Content-Disposition'].split('; ');

      // 获取文件名称和后缀
      let fileName = '', ext = '';
      for (let value in fileInfo) {
        if (fileInfo[value].indexOf("filename=") != -1) {
          let str = iconv.decode(fileInfo[value], 'utf8').slice(10, -1);
          let cutIndex = str.indexOf('.');
  
          fileName = str.slice(0, cutIndex);
          if (fileName.indexOf('\\') != -1) {
            fileName = fileName.slice(fileName.lastIndexOf('\\') + 1);
          }
          
          ext = str.slice(cutIndex + 1);

          break;
        }
      }

      // 去掉不必要的边界字符
      let boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
      let upperIndex = body.indexOf(file['Content-Type'].slice(1)) + file['Content-Type'].slice(1).length;
          lowerIndex = body.indexOf(`--${boundary}--`);
      let binaryData = body.slice(upperIndex, lowerIndex).replace(/^\s\s*/, '').replace(/\s\s*$/, '');

      let saveFile = `${fileName}.${ext}`;
      if( isFileExist(path.resolve(__dirname, `../csv/${saveFile}`)) ){
        return;
      }
      if( !isFileExist(path.resolve(__dirname, '../csv/')) ){
        fs.mkdir(path.resolve(__dirname, '../csv/'), (err) => {
          if(err) throw err; 
        });
      }

      const ws = fs.createWriteStream(path.resolve(__dirname, '../csv', saveFile)); 
      ws.write(iconv.decode(binaryData, 'gbk'), 'utf8') // 解决中文乱码 
      ws.end();

      let readArr = [], writeArr = [];
      ws.on('finish', () => {
        fs.createReadStream(path.resolve(__dirname, '../csv', `${fileName}.${ext}`))
          .pipe(csv.parse({ headers: false, ignoreEmpty: true }))
          .on('error', error => console.error(error))
          .on('data', (row) => {
            readArr.push(row);
          })
          .on('end', () => {
            for (let i = 2; i < readArr.length-20; i++) {
              let one = Object.keys(ZfbKeys).reduce((pre, cur, index) => {
                let prop = cur, descriptor = { value: readArr[i][index].trim(), enumerable: true };
                return Object.defineProperty(pre, prop, descriptor);
              }, {})
              writeArr = writeArr.concat(one);
            }

            ZfbData.insertMany(writeArr).then((data) => {
              res.json({
                type: 0,
                data,
              });
            }).catch(err => {
              console.error("/uploadZfb=", err);
            });
          })
    })
  })
})

// 2. 上传微信消费记录
router.post("/uploadWx", (req, res, next) => {
  let body = '';
  req.setEncoding('binary')
    .on('data', (str) => {
      body += str;
    })
    .on('end', () => {
      let file = querystring.parse(body, '\r\n', ':');
      let fileInfo = file['Content-Disposition'].split('; ');

      // 获取文件名称和后缀
      let fileName = '', ext = '';
      for (let value in fileInfo) {
        if (fileInfo[value].indexOf("filename=") != -1) {
          let str = iconv.decode(fileInfo[value], 'utf8').slice(10, -1);
          let cutIndex = str.indexOf('.');
  
          fileName = str.slice(0, cutIndex);
          if (fileName.indexOf('\\') != -1) {
            fileName = fileName.slice(fileName.lastIndexOf('\\') + 1);
          }
          
          ext = str.slice(cutIndex + 1);

          break;
        }
      }

      // 去掉不必要的边界字符
      let boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
      let upperIndex = body.indexOf(file['Content-Type'].slice(1)) + file['Content-Type'].slice(1).length;
          lowerIndex = body.indexOf(`--${boundary}--`);
      let binaryData = body.slice(upperIndex, lowerIndex).replace(/^\s\s*/, '').replace(/\s\s*$/, '');

      let saveFile = `${fileName}.${ext}`;
      if( isFileExist(path.resolve(__dirname, `../csv/${saveFile}`)) ){
        return;
      }
      if( !isFileExist(path.resolve(__dirname, '../csv/')) ){
        fs.mkdir(path.resolve(__dirname, '../csv/'), (err) => {
          if(err) throw err; 
        });
      }

      const ws = fs.createWriteStream(path.resolve(__dirname, '../csv', saveFile)); 
      ws.write(iconv.decode(binaryData, 'utf8'), 'utf8') // 解决中文乱码 
      ws.end();

      let readArr = [], writeArr = [];
      ws.on('finish', () => {
        fs.createReadStream(path.resolve(__dirname, '../csv', `${fileName}.${ext}`))
          .pipe(csv.parse({ headers: false, ignoreEmpty: true }))
          .on('error', error => console.error(error))
          .on('data', (row) => {
            readArr.push(row);
          })
          .on('end', () => {
            for (let i = 15; i < readArr.length; i++) {
              let one = Object.keys(WxKeys).reduce((pre, cur, index) => {
                let prop = cur, descriptor = { value: readArr[i][index].replace(/¥/, '').trim(), enumerable: true };
                return Object.defineProperty(pre, prop, descriptor);
              }, {})
              writeArr = writeArr.concat(one);
            }

            WxData.insertMany(writeArr).then((data) => {
              res.json({
                type: 0,
                data,
              });
            }).catch(err => {
              console.error("/uploadWx=", err);
            });
          })
    })
  })
})

module.exports = router