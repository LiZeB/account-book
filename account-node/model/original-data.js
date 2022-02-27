const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OriginalDataKeys = {
  consumeType: '开销类型',
  consumeName: '开销名称',
  consumeSum: '开销金额',
  consumeTime: '开销日期',
  consumer: '开销人',
  isSpecial: '是否为特殊项',
  source: '来源',
  remark: '备注',
};

const customSpecialTypes = ['5', '7', '9', '10', '-1'];

const OriginalDataSchema = new Schema({
  consumeType: { type: String },  // 开销类型
  consumeName: { type: String },  // 开销名称
  consumeSum: { type: Number },  // 开销金额
  consumeTime: { type: String },  // 开销日期
  consumer: { type: String },  // 开销人
  isSpecial: { type: Boolean },  // 是否为特殊项
  source: { type: String }, // 来源
  remark: { type: String },  // 备注
});

const OriginalData = mongoose.model('OriginalData', OriginalDataSchema)

module.exports = {
  OriginalDataKeys,
  OriginalData,
  customSpecialTypes,
}

