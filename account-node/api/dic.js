const express = require('express')
const router = express.Router()

const dicData = require('../model/dic-data.js')
// 将字典项写入数据库
const dics = {
  // 开销类型
  consumeTypes: {
    '1': '休闲娱乐',
    '2': '日用百货',
    '3': '餐饮美食',
    '4': '水果零食',
    '5': '旅游出行',
    '6': '服饰装扮',
    '7': '亲友长辈',
    '-1': '其他',
  }
}
Object.keys(dics).forEach((key) => {
  dicData.find({
    dicName: key,
    dicObjStr: JSON.stringify(dics[key])
  }).then(data => {
    if (!data || !data.length) {
      dicData.create({
        dicName: key,
        dicObjStr: JSON.stringify(dics[key])
      });
    }
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