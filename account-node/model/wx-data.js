const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WxKeys = {
  dealTime: '交易时间', // 2021/9/1  7:06:31
  dealType: '交易类型', // 微信红包（群红包/单发）、转账、群收款、二维码收付款、商户消费、充值提现、信用卡还款、有退款
  dealPerson: '交易对方',
  desc: '商品',
  inOrOut: '收/支', // 支出，收入，/ [中性交易：提现]
  sum: '金额',
  account: '支付方式', // 零钱，绑定银行卡
  dealStatus: '当前状态', // 支付成功，（转账）朋友已收钱，提现已到帐，已存入零钱，（扫二维码付款）已转账，已全额退款
}
const WxDataSchema = new Schema({ 
  dealTime: { type: String }, 
  dealType: { type: String },
  dealPerson: { type: String },
  desc: { type: String },
  inOrOut: { type: String }, 
  sum: { type: Number },
  account: { type: String }, 
  dealStatus: { type: String }, 
});

const WxData = mongoose.model('WxData', WxDataSchema)

module.exports = {
  WxKeys: WxKeys,
  WxData: WxData
}