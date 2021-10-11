const mongoose = require('mongoose')
const dbUrl = "mongodb://localhost:27017/todo_development"
mongoose.connect(dbUrl)
mongoose.Promise = global.Promise
const OriginalData = require('../model/original-data.js')

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