const mongoose = require('mongoose')

// 定义模式
const Schema = mongoose.Schema
const moment = require('moment')

const OriginalDataSchema = new Schema({
  consumeType: { type: Number },  // 开销类型
  consumeName: { type: String },  // 开销名称
  consumeSum: { type: Number },  // 开销金额
  _consumeTime: { type: Date },  // 开销日期
  consumer: { type: String },  // 开销人
  isSpecial: { type: Boolean },  // 是否为特殊项
  remark: { type: String },  // 备注
});

// 虚拟属性
OriginalDataSchema.virtual("consumeTime").get(function () {
  return moment(this._consumeTime).format("YYYY-MM-DD HH:mm:SS");
});

// 编译模型
const OriginalData = mongoose.model('OriginalData', OriginalDataSchema)

module.exports = OriginalData

