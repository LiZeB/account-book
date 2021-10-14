const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DicDataSchema = new Schema({
  dicName: { type: String },  // 字典项的名称
  dicObjStr: { type: String },  // 字典项的对象字符串
});

const DicData = mongoose.model('DicData', DicDataSchema)

module.exports = DicData