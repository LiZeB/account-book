# account-book

## 表结构设计

1. 支付宝交易类别
    餐饮美食[3]，充值缴费[2]，服饰装扮[6]，公共服务[2]，家居家装[2]，交通出行[11]，酒店旅游[5]，美容美发[6]，母婴亲子[2]，其他[-1]，日用百货[2]，保险[10]，转账红包[-1]，运动户外[1]，医疗健康[10]，信用借还[去掉]，文化休闲[1]，退款[去掉]，数码电器[9]，收入[去掉]，生活服务[2]

2. 微信交易类别
    微信红包（群红包/单发）[-1]、转账[-1]、群收款[去掉]、二维码收付款[-1]、商户消费[2]、充值提现[去掉]、信用卡还款[去掉]、有退款[去掉]

3. 自定义交易类别
    '1': '休闲娱乐',
    '2': '日用百货',
    '3': '餐饮美食',
    '4': '水果零食',
    '5': '旅游',
    '6': '服饰装扮',
    '7': '亲友长辈',
    '8': '房租水电',
    '9': '数码电器',
    '10': '医疗健康',
    '11': '交通出行',
    '-1': '其他',

4. 交易（当前）状态过滤
 
 4.1 支付宝
 等待确认收货[1]，还款成功[1]，交易成功[1]，退款成功[0]，支付成功[1]
 
 4.2 微信
 支付成功[1]，（转账）朋友已收钱[1]，提现已到帐[0]，已存入零钱[0]，（扫二维码付款）已转账[1]，已全额退款[0]

5. 开销人类别
    '1': '张雅娴',
    '2': '李泽滨',
    '-1': '公共账户'[收付款方式==='中国工商银行储蓄卡(3783)']

6. 是否为特殊项
    特殊项: [自定义交易类别中的5, 7, 9, 10]