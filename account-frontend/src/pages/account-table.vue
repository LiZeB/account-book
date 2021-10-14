<template>
  <div class="account-table__wrapper">
    <div class="account-table__header">
      <el-button type="primary">批量添加</el-button>
      <el-button type="warning">批量刪除</el-button>
    </div>
    <div class="account-table__container">
      <el-table :data="accountData">
        <el-table-column
          v-for="item in tableColumns"
          :key="item.value"
          :label="item.label"
          :prop="item.value"
        >
          <template slot-scope="{ row }">{{row[item.value] | columnFilter(item.value) | deVal}}</template>
        </el-table-column>
      </el-table>
      <div class="account-table__footer">
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="pageNoChange"
          :current-page="pager.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pager.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script>
// import { queryOriginalData } from "@/api/account-table.js";

export default {
  name: "AccountTable",
  filters: {
    columnFilter: (value, prop) => {
      if (prop === "isSpecial" && !value) {
        return value ? "是" : "否";
      }
      return value;
    }
  },
  data() {
    return {
      tableColumns: [
        { label: "开销类型", value: "consumeType" },
        { label: "开销名称", value: "consumeName" },
        { label: "开销金额", value: "consumeSum" },
        { label: "开销日期", value: "consumeTime" },
        { label: "开销人", value: "consumer" },
        { label: "是否为特殊项", value: "isSpecial" },
        { label: "备注", value: "remark" }
      ],
      accountData: [],
      pager: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
    };
  },
  mounted() {
    this.getAccountData();
  },
  methods: {
    pageSizeChange(pageSize) {
      this.pager.pageSize = pageSize;
      this.getAccountData();
    },
    pageNoChange(pageNo) {
      this.pager.pageNo = pageNo;
      this.getAccountData();
    },
    getAccountData() {
      const params = {
        pageNum: this.pager.pageNo,
        pageSize: this.pager.pageSize
      };
      // this.$http('/AccountTable/queryOriginalData', params)
      queryOriginalData(params)
        .then(res => {
          this.accountData = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.account-table__wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px 32px;
  .account-table__header {
    height: 64px;
    line-height: 64px;
    .el-button {
      width: 88px;
      min-width: 88px;
      height: 32px;
      line-height: 32px;
      padding: 0;
    }
  }
  .account-table__container {
    height: calc(100% - 112px);
    .el-table {
      height: 100%;
    }
  }
  .account-table__footer {
    position: absolute;
    height: 56px;
    line-height: 56px;
    bottom: 0;
    left: 32px;
    right: 32px;
    .el-pagination {
      display: flex;
      align-items: center;
      ::v-deep .el-pager li {
        vertical-align: middle;
      }
    }
  }
}
</style>