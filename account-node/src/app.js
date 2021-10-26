const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

mongoose.Promise = global.Promise
const env = process.env.NODE_ENV || 'development'
let db, dbUrl = "";   // TODO: dbUrl是数据库地址，打包时需填写真实地址
if (env === 'development') {
  dbUrl = "mongodb://localhost:27017/";
}

const dbName = "account-book";
// MongoClient操作一个数据库或多个数据库
const client = new MongoClient(dbUrl);
client.connect(function (err) {
  if (err) throw err
  console.log("成功连接到MongoDB服务器！")
  db = client.db(dbName);
  client.close();
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
const dicRoutes = require("../api/dic")
app.use('/dic', dicRoutes);
const uploadRoutes = require("../api/upload")
app.use('/upload', uploadRoutes);

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