const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient

// 使用全局Promise库
mongoose.Promise = global.Promise

// 默认数据库
const dbName = "test"
const serverUrl = "mongodb://localhost:27017/"
const dbUrl = serverUrl + dbName;

// OriginalData
const OriginalData = require('../model/original-data.js')

// 连接服务器
const client = new MongoClient(serverUrl)
client.connect(function (err) {
  if (err) throw err
  console.log("成功连接到MongoDB服务器！")
  const db = client.db(dbName);
  const collection = db.collection('OriginalData');
  // 插入记录
  // db.originalData.insert({"consumeType":0,"consumeName":"","consumeSum":0,"_consumeTime":"2021 - 10 - 11T11: 00: 23.000 + 00: 00","consumer":"","isSpecial":false,"remark":""})
  collection.insertOne({
    "consumeType": 0, 
    "consumeName": "", 
    "consumeSum": 0, 
    "_consumeTime": "2021 - 10 - 11T11: 00: 23.000 + 00: 00", 
    "consumer": "", 
    "isSpecial": false, 
    "remark": ""
  }, function (err) {
    if (err) throw err
  })
  client.close();
})

// mongoose.connect(dbUrl)
// const connection = mongoose.connection
// connection.on("error", console.error.bind(console, "数据库连接错误！"))

const express = require('express');
const app = express();
app.use(express.json()); //express.json 解析 JSON 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）
app.use(express.urlencoded());

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