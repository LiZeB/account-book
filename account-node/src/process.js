const { OriginalDataKeys, customSpecialTypes } = require('../model/original-data.js');

const keyNameMapOfZfb = {
    consumeType: 'dealType',
    consumeName: 'dealPerson',
    consumeSum: 'sum',
    consumeTime: 'dealTime',
    consumer: 'consumer',
    isSpecial: 'dealType',
    remark: 'desc'
};

const keyNameMapOfWx = {
    consumeTime: 'dealTime',
    consumeType: 'dealType',
    consumeName: 'dealPerson',
    consumeSum: 'sum',
    consumer: 'consumer',
    isSpecial: 'dealType',
    remark: 'desc',
}

const ZfbTypeMap = {
    '餐饮美食': '3',
    '充值缴费': '2',
    '服饰装扮': '6',
    '公共服务': '2',
    '家居家装': '2',
    '交通出行': '11',
    '酒店旅游': '5',
    '美容美发': '6',
    '母婴亲子': '2',
    '其他': '-1',
    '日用百货': '2',
    '保险': '10',
    '转账红包': '-1',
    '运动户外': '1',
    '医疗健康': '10',
    '信用借还': '0',
    '文化休闲': '1',
    '退款': '0',
    '数码电器': '9',
    '收入': '0',
    '生活服务': '2',
    '投资理财': '0',
};

const consumerMap = {
    '张雅娴': '1',
    '李泽滨': '2',
    '公共账户': '-1',
}

const ZfbFilterTypes = {
    '等待确认收货': '1',
    '还款成功': '1',
    '交易成功': '1',
    '退款成功': '0',
    '支付成功': '1',
};

const WxTypeMap = {
    '微信红包（群红包）': '-1',
    '微信红包（单发）': '-1',
    '转账': '-1',
    '群收款': '0',
    '扫二维码付款': '-1',
    '商户消费': '2',
    '充值提现': '0',
    '信用卡还款': '0',
    '有退款': '0',
    '零钱提现': '0',
};

const WxFilterTypes = {
    '支付成功': '1',
    '朋友已收钱': '1',
    '提现已到帐': '0',
    '已存入零钱': '0',
    '已转账': '1',
    '已全额退款': '0',
};



class Process {
    constructor(model, sourceModel, type) {
        this._model = model;
        this._sourceModel = sourceModel;
        this._type = type.toLowerCase();;
        this._typeMap = this._type === 'wx' ? WxTypeMap : ZfbTypeMap;
        this._filterTypes = this._type === 'wx' ? WxFilterTypes : ZfbFilterTypes;
        this._keyNameMap = this._type === 'wx' ? keyNameMapOfWx : keyNameMapOfZfb;
        this.init();
    }

    async init() {
        await this._filter();
        this._syncData();
    }

    _filter() {
        const deleteTypes1 = Object.keys(this._typeMap).reduce((pre, cur) => {
            if (this._typeMap[cur] === '0') {
                pre.push({ dealType: cur });
            }
            return pre;
        }, []);
        const deleteTypes2 = Object.keys(this._filterTypes).reduce((pre, cur) => {
            if (this._filterTypes[cur] === '0') {
                pre.push({ dealStatus: cur });
            }
            return pre;
        }, []);
        const deleteTypes = [].concat(deleteTypes1, deleteTypes2);
        return new Promise((resolve, reject) => {
            this._model.deleteMany({
                $or: [
                    ...deleteTypes
                ]
            }).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    _syncData() {
        this._model.find().then(dataArr => {
            const documents = dataArr.map(doc => {
                const dealTypeKey = doc.get('dealType');
                const dealTypeValue = this._typeMap[dealTypeKey];
                const consumerKey = doc.get('consumer');
                const consumerValue = consumerMap[consumerKey];

                const dataObj = Object.keys(OriginalDataKeys).reduce((pre, cur) => {
                    if (cur === 'isSpecial') {
                        if (customSpecialTypes.includes(dealTypeValue)) {
                            pre[cur] = true;
                        } else {
                            pre[cur] = false;
                        }
                    } else if (cur === 'consumer') {
                        if (doc.get('account').indexOf('工商银行储蓄卡(3783)') !== -1) {
                            pre[cur] = consumerMap['公共账户'];
                        } else {
                            pre[cur] = consumerValue;
                        }
                    } else if (cur === 'consumeType') {
                        pre[cur] = dealTypeValue;
                    } else if (cur === 'source') { 
                        pre[cur] = this._type;
                    } else {
                        pre[cur] = doc.get(this._keyNameMap[cur]);
                    }
                    return pre;
                }, {});
                return dataObj;
            });
            this._sourceModel.insertMany(documents).then(() => {
                console.log(`${this._type}账单数据同步成功`);
            });
        });
    }

}

module.exports = Process;
