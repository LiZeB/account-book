const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient

mongoose.Promise = global.Promise
const dbUrl = "mongodb://localhost:27017/";

const OriginalData = require('../model/original-data.js')

const client = new MongoClient(dbUrl);
client.connect(function (err) {
  if (err) throw err
  console.log("成功连接到MongoDB服务器！")
  const db = client.db('test');
  const collection = db.collection('OriginalData');
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
  });
  client.close();
});

// mongoose.connect(dbUrl)
// const connection = mongoose.connection
// connection.on("error", console.error.bind(console, "数据库连接错误！"))

const express = require('express');
const app = express();
app.use(express.json());  // express.json 解析 JSON 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）
app.use(express.urlencoded());


const BASE_INFO = [
  "consumeType", 
  "consumeName", 
  "consumeSum", 
  "_consumeTime",
  "consumer",
  "isSpecial",
  "remark"
];

app.post('/create', (req, res, next) => {
  const {
    ...BASE_INFO
  } = req.body;
  OriginalData.create({
    ...BASE_INFO
  }).then(() => {
    res.json({
      ...BASE_INFO
    });
  });
});

app.get("/list", (req, res, next) => {
  OriginalData.find().then(result => {
    const data = result.map(item => {
      const newItem = item;
      return newItem;
    });
    res.send({
      type: 0,
      data,
      total: data ? data.length : 0
    });
  });
});

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