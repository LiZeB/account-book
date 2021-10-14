const express = require('express')
const router = express.Router()

const dicData = require('../model/dic-data.js')
// 将字典项写入数据库
const dics = {
  consumeTypes: {  // 开销类型
    '1': '休闲娱乐',
    '2': '日用百货'
  }
}
dicData.deleteMany({}, function (err) {
  console.log(err);
});
Object.keys(dics).forEach((key) => {
  dicData.create({
    dicName: key,
    dicObjStr: JSON.stringify(dics[key])
  })
})

// 1. 查询开销类型
router.get("/consumeTypes", (req, res, next) => {
  dicData.findOne({ dicName: req.query.name }).then((_data) => {
    const data = JSON.parse(_data.dicObjStr)
    res.json({
      type: 0,
      data,
    });
  }).catch(err => {
    console.error("/dic/consumeTypes=", err);
  });
});

module.exports = router