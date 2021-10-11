const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

const OriginalDataSchema = new Schema({
  payType: { type: Integer },   // 开销类型
  payName: { type: String },    // 开销名称
  isSpecial: { type: Boolean },  // 是否为特殊项，false：否，true：是
  payValue: { type: Double },    // 开销金额
  user: { type: String },       // 开销人
  _consumeTime: { type: TimeStamp },  // 开销日期
  remark: { type: String },    // 备注
});

OriginalDataSchema.virtual("consumeTime").get(function () {
  return moment(this._consumeTime).format("YYYY-MM-DD HH:mm:SS");
});

const OriginalData = mongoose.model('OriginalData', OriginalDataSchema)

module.exports = OriginalData