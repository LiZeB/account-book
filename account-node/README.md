# account-node

## 1. 数据库备份
  cd account-book/account-node/

  mongodump --host localhost:27017 --db account-book -o ../data/moongodb/

## 2. 数据库恢复
  cd account-book/account-node/
  
  mongorestore --host localhost:27017 --db account-book ../data/moongodb/account-book/