const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

mongoose.Promise = global.Promise
const env = process.env.NODE_ENV || 'development'
let db, dbUrl = "";   // TODO: dbUrl是数据库地址，打包时需填写真实地址
if (env === 'development') {
  dbUrl = "mongodb://localhost:27017/";
}

const dbName = "account-book", collectionName = "zfbDatas";
// MongoClient操作一个数据库或多个数据库
const client = new MongoClient(dbUrl);
client.connect(function (err) {
  if (err) throw err
  console.log("成功连接到MongoDB服务器！")
  db = client.db(dbName);
  if(!db.collection(collectionName)){
    db.createCollection(collectionName);
  }
});

// Mongoose连接数据库
mongoose.connect(dbUrl+dbName);
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "数据库连接错误！"));

const express = require('express');
const app = express();
app.use(express.json()); // express.json 解析 JSON 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）
app.use(express.urlencoded());

const baseRoutes = require('../api/base');
app.use('/base', baseRoutes);
const apiRoutes = require("../api/dic")
app.use('/dic', apiRoutes);

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
app.listen(3000, () => {
  console.log("服务启动成功！");
});

// 读、写流
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const iconv = require('iconv-lite');

const ws = fs.createWriteStream(path.resolve(__dirname, '../csv','11.csv'))
fs.createReadStream(path.resolve(__dirname, '../csv','2.csv'))
  .on('error', error => console.error(error))
  .on('data', (chunk) => {
    ws.write(iconv.decode(chunk, 'gbk')) // 解决中文乱码
  })
  .on('end', ()=> ws.end())
  
let zfbArr = [], saveArr = [];
const fieldKeys = {
  'inOrOut' : '收/支', // 支出，收入，其他 [退款，转账到银行卡，还花呗，手机充值，账户结息，消费...]
  'dealPerson' : '交易对方',
  'dealAccount' : '对方账号',
  'desc' : '商品说明',
  'account' : '收/付款方式', // 花呗，现金抵价券，余额 ， 绑定银行卡（公共账号3783）
  'sum' : '金额',
  'dealStatus' : '交易状态', // 等待确认收货，还款成功，交易成功，退款成功，支付成功
  'dealType' : '交易分类', // 餐饮美食，充值缴费，服饰装扮，公共服务，家居家装，交通出行，酒店旅游，美容美发，母婴亲子，其他，日用百货，保险，转账红包，运动户外，医疗健康，信用借还，文化休闲，退款，数码电器，收入，生活服务
  'dealNumber' : '交易订单号',
  'dealPersonNumber' : '商家订单号',
  'dealTime' : '交易时间', // 2021/9/5 0:29:02
}
const fieldLabels = Object.keys(fieldKeys).reduce((pre, cur)=>{
  return pre.concat([fieldKeys[cur]]);
}, []);
ws.on('finish', ()=> {
  fs.createReadStream(path.resolve(__dirname, '../csv','11.csv'))
    .pipe(csv.parse({ headers: false, ignoreEmpty: true }))
    .on('error', error => console.error(error))
    .on('data', (row) => {
      zfbArr.push(row);
    })
    .on('end', () => {
      for(let i=2; i<zfbArr.length-20; i++) {
        let one = Object.keys(fieldKeys).reduce((pre, cur, index)=>{
          let prop = fieldKeys[cur], descriptor = { value: zfbArr[i][index].trim(), enumerable: true };
          return Object.defineProperty(pre, prop, descriptor);
        }, {})
        saveArr = saveArr.concat(one);
      }
      
      if(!db.collection(collectionName).find().count()){
        db.collection(collectionName).insertMany(saveArr, function(err) {
          if (err) throw err;
          client.close();
        })
      } else {
        client.close();
      }
    })
})
