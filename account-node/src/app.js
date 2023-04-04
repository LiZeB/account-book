const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const history = require('connect-history-api-fallback');

/************ 1.Mongoose连接数据库 *********/
mongoose.Promise = global.Promise
const env = process.env.NODE_ENV || 'development'
let db, dbUrl = "";   // NOTE: dbUrl是数据库地址，如果数据库和业务组件不一致时需要填写
if (env === 'development') {
  dbUrl = "mongodb://localhost:27017/";
}
const dbName = "account-book";
const client = new MongoClient(dbUrl);
client.connect(function (err) {
  if (err) throw err
  console.log("成功连接到MongoDB服务器！")
  db = client.db(dbName);
  client.close();
});
mongoose.connect(dbUrl+dbName);
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "数据库连接错误！"));

/************* 2.创建express实例、分发路由、设置静态文件代理 ******/
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded());
const baseRoutes = require('../api/base');
app.use('/base', baseRoutes);
const dicRoutes = require("../api/dic")
app.use('/dic', dicRoutes);
const uploadRoutes = require("../api/upload")
app.use('/upload', uploadRoutes);
const statisticRoutes = require("../api/statistic");
app.use('/statistic', statisticRoutes);
app.use(history()); // 解决由于history模式下前端路由存在导致后台无法匹配到某个text/html,返回404的问题。不匹配时，强行指向 index.html
app.use(express.static(path.join(__dirname, '../dist')));

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