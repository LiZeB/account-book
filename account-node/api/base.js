const express = require('express')
const router = express.Router()

const OriginalData = require('../model/original-data.js')

const BASE_INFO = [
  "consumeType",
  "consumeName",
  "consumeSum",
  "consumeTime",
  "consumer",
  "isSpecial",
  "remark"
];

// 1. 新增一条原始数据 
router.post('/create', (req, res, next) => {
  const result = BASE_INFO.reduce((pre, cur) => {
    pre[cur] = req.body[cur];

    if(cur === 'consumeTime' && pre[cur]) {
      pre[cur] = pre[cur].trim().slice(0, 10);
    }
    return pre;
  }, {});
  OriginalData.create({
    ...result
  }).then(() => {
    res.json({
      ...result
    });
  }).catch(err => {
    console.log("err===", err);
  });
});

// 2. 查询所有原始数据，TODO: 后续需要写成分页接口
router.get("/list", (req, res, next) => {
  OriginalData.find().then(result => {
    const data = result.map(item => {
      const val = BASE_INFO.reduce((pre, cur) => {
        pre[cur] = item[cur];
        return pre;
      }, {});
      return val;
    });
    res.send({
      type: 0,
      data,
      total: data ? data.length : 0
    });
  }).catch(err => {
    console.log("err===", err);
  });
});

module.exports = router