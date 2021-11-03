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
    '5': '旅游',
    '6': '服饰装扮',
    '7': '亲友长辈',
    '8': '房租水电',
    '9': '数码电器',
    '10': '医疗健康',
    '11': '交通出行',
    '-1': '其他',
  },
  // 统计指标类型
  indicatorTypes: {
    '1': '总开销',
    '2': '正常开销',
    '3': '特殊开销',
  },
  // TODO: 人员暂时写死
  personNames: {
    '1': '张雅娴',
    '2': '李泽滨',
    '-1': '公共账户'
  }
}

dicData.find().exists('_id', true).then((_data) => {
  const dicNames = Object.keys(dics)
  if (
    !_data.length ||
    _data.length !== dicNames.length ||
    _data.reduce((pre, cur) => { return pre + cur.dicName }, '') !== dicNames.reduce((pre, cur) => { return pre + cur.dicName }, '')
  ) {
    dicData.deleteMany({}).exec()
    dicNames.forEach((key) => {
      dicData.create({
        dicName: key,
        dicObjStr: JSON.stringify(dics[key])
      })
    })
  } else {
    _data.forEach((data) => {
      dicData.findByIdAndUpdate(data._id, {
        $set: {
          dicName: data.dicName,
          dicObjStr: JSON.stringify(dics[data.dicName])
        }
      }).exec()
    })
  }
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
})
// 2. 查询统计指标类型
router.get("/indicatorTypes", (req, res, next) => {
  dicData.findOne({ dicName: req.query.name }).then((_data) => {
    const data = JSON.parse(_data.dicObjStr)
    res.json({
      type: 0,
      data,
    });
  }).catch(err => {
    console.error("/dic/indicatorTypes=", err);
  });
})
// 3. 查询人员
router.get("/personNames", (req, res, next) => {
  dicData.findOne({ dicName: req.query.name }).then((_data) => {
    const data = JSON.parse(_data.dicObjStr)
    res.json({
      type: 0,
      data,
    });
  }).catch(err => {
    console.error("/dic/personNames=", err);
  });
})

module.exports = router