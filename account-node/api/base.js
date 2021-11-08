const express = require('express')
const router = express.Router()

const { OriginalData } = require('../model/original-data.js');
const util = require('../src/util');

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
    if (cur === 'consumeTime' && pre[cur]) {
      pre[cur] = pre[cur].trim().slice(0, 10);
    }
    return pre;
  }, {});
  OriginalData.create({
    ...result
  }).then(() => {
    res.send({
      type: 0,
    });
  }).catch(err => {
    console.log("err===", err);
  });
});

// 2. 编辑一条原始数据
router.post('/edit', (req, res, next) => {
  const params = BASE_INFO.reduce((pre, cur) => {
    pre[cur] = req.body[cur];
    if (cur === 'consumeTime' && pre[cur]) {
      pre[cur] = pre[cur].trim().slice(0, 10);
    }
    return pre;
  }, {});

  OriginalData.findOneAndUpdate({
    _id: req.body.id
  }, {
    $set: {
      ...params
    }
  }).then(() => {
    res.send({
      type: 0,
    });
  }).catch(err => {
    console.error("/base/edit=", err);
  });
});

// 3. 删除一条或多条原始数据
router.get('/delete', (req, res, next) => {
  const ids = req.query.ids.trim().split(',').map(item => {
    return {
      _id: item
    };
  });
  OriginalData.deleteMany({
    $or: [
      ...ids
    ]
  }, () => {
    res.send({
      type: 0,
    });
  });
});

// 4. 查询所有原始数据
router.post("/list", (req, res, next) => {
  let query = req.body;
  const pageNum = query.pageNum;
  const pageSize = query.pageSize;
  const consumeTime = query.consumeTime
  delete query.pageNum;
  delete query.pageSize;
  query = util.deletNullQuery(query);

  if (query.hasOwnProperty("consumeTime")) {
    query.consumeTime = {
      $gte: consumeTime[0],
      $lte: consumeTime[1]
    };
  }

  const p1 = OriginalData.find({
    ...query,
  }).skip((pageNum - 1) * pageSize).limit(pageSize);
  const p2 = OriginalData.countDocuments({...query});
  Promise.all([p1, p2]).then((_data) => {
    const result = _data[0];
    const count = _data[1];
    const data = result.map(item => {
      const val = BASE_INFO.concat('id').reduce((pre, cur) => {
        pre[cur] = item[cur];
        return pre;
      }, {});
      return val;
    });
    res.send({
      type: 0,
      data,
      total: count,
    });
  }).catch(err => {
    console.error("/base/list=", err);
  });
});

module.exports = router