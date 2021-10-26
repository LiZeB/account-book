const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ZfbKeys = {
  inOrOut: '收/支', // 支出，收入，其他 [退款，转账到银行卡，还花呗，手机充值，账户结息，消费...]
  dealPerson: '交易对方',
  dealAccount: '对方账号',
  desc: '商品说明',
  account: '收/付款方式', // 花呗，现金抵价券，余额 ， 绑定银行卡（公共账号3783）
  sum: '金额',
  dealStatus: '交易状态', // 等待确认收货，还款成功，交易成功，退款成功，支付成功
  dealType: '交易分类', // 餐饮美食，充值缴费，服饰装扮，公共服务，家居家装，交通出行，酒店旅游，美容美发，母婴亲子，其他，日用百货，保险，转账红包，运动户外，医疗健康，信用借还，文化休闲，退款，数码电器，收入，生活服务
  dealTime: '交易时间', // 2021/9/5 0:29:02
}
const ZfbDataSchema = new Schema({
  inOrOut: { type: String }, 
  dealPerson: { type: String },
  dealAccount: { type: String },
  desc: { type: String },
  account: { type: String }, 
  sum: { type: Number },
  dealStatus: { type: String }, 
  dealType: { type: String }, 
  dealTime: { type: String }, 
  file: { type: String}
});

const ZfbData = mongoose.model('ZfbData', ZfbDataSchema)

module.exports = {
  ZfbKeys: ZfbKeys,
  ZfbData: ZfbData
}