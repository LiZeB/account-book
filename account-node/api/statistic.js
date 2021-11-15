const express = require('express')
const router = express.Router()

const { OriginalData } = require('../model/original-data.js');
router.get('/aggreateByCustomType', (req, res, next) => {
    const aggregate = OriginalData.aggregate([
        {
            $group: {
                _id: "$consumeType",
                consumeType: "consumeType",
                sum: { $sum: "$consumeSum" },
            },
        }
    ]);
    aggregate.exec(function (err, data) {
        res.json({
            type: 0,
            data,
        });
    });
});


module.exports = router

