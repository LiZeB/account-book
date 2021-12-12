const express = require('express')
const router = express.Router()
const util = require('../src/util');
const { OriginalData } = require('../model/original-data.js');
const moment = require("moment");

router.post('/aggreateByCustomType', (req, res, next) => {
    let data = req.body;
    data = util.deletNullQuery(data);
    const queryCondition = {}
    queryCondition.consumeTime = {
        $gte: data.statisticsTime[0],
        $lte: data.statisticsTime[1]
    };
    if (data.hasOwnProperty("personNames")) {
        const personNameCondition = data.personNames.map(item => {
            return {
                consumer: item
            };
        });
        queryCondition["$or"] = personNameCondition;
    }
    const aggregate = OriginalData.aggregate([
        {
            $match: {
                ...queryCondition
            }
        },
        {
            $group: {
                _id: "$consumeType",
                sum: { $sum: "$consumeSum" },
            },
        },
    ]);
    aggregate.exec(function (err, data) {
        res.json({
            type: 0,
            data,
        });
    });
});

router.post('/getStatistics', (req, res, next) => {
    let data = req.body;
    data = util.deletNullQuery(data);
    const queryCondition = {}
    queryCondition.consumeTime = {
        $gte: data.statisticsTime[0],
        $lte: data.statisticsTime[1]
    };
    if (data.hasOwnProperty("personNames")) {
        const personNameCondition = data.personNames.map(item => {
            return {
                consumer: item
            };
        });
        queryCondition["$or"] = personNameCondition;
    }
    const aggregate = OriginalData.aggregate([
        {
            $match: {
                ...queryCondition
            }
        },
        {
            $project: {
                consumer: "$consumer",
                isSpecial: "$isSpecial",
                consumeSum: "$consumeSum",
                consumeTime: "$consumeTime",
            }
        },
    ]);
    aggregate.exec(function (err, data) {
        res.json({
            type: 0,
            data,
        });
    });
})


module.exports = router

