# account-book
用Nginx + Mongodb + Express技术栈实现的一个web端应用， 主要功能是上传微信和支付宝的账单文件，解析excel格式的账单文件，处理原始的账单数据，保存到数据库。支持对数据增删改查，并以统计图表的方式对数据进行统计分析。

## 1. 数据库备份[非必要]
  cd account-book/account-node/

  mongodump --host localhost:27017 --db account-book -o ../data/moongodb/

## 2. 数据库恢复
  cd account-book/account-node/
  
  mongorestore --host localhost:27017 --db account-book ../data/moongodb/account-book/

## 3. 运行项目
  安装mongodb，nginx，pm2

  cd account-node

  yarn install

  pm2 start

## 4. 应用截图
![账单管理-查询](./data/images/%E8%B4%A6%E5%8D%95%E7%AE%A1%E7%90%86-%E6%9F%A5%E8%AF%A2.png)

![账单管理-添加](./data/images/%E8%B4%A6%E5%8D%95%E7%AE%A1%E7%90%86-%E6%B7%BB%E5%8A%A0.png)

![账单管理-编辑](./data/images/%E8%B4%A6%E5%8D%95%E7%AE%A1%E7%90%86-%E7%BC%96%E8%BE%91.png)

![统计分析](./data/images/%E7%BB%9F%E8%AE%A1%E5%88%86%E6%9E%90.png)

![账单上传](./data/images/%E8%B4%A6%E5%8D%95%E4%B8%8A%E4%BC%A0.png)
