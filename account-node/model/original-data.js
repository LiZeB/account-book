const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OriginalDataSchema = new Schema({
  consumeType: { type: Number },  // 开销类型
  consumeName: { type: String },  // 开销名称
  consumeSum: { type: Number },  // 开销金额
  consumeTime: { type: String },  // 开销日期
  consumer: { type: String },  // 开销人
  isSpecial: { type: Boolean },  // 是否为特殊项
  remark: { type: String },  // 备注
});

const OriginalData = mongoose.model('OriginalData', OriginalDataSchema)

module.exports = OriginalData

