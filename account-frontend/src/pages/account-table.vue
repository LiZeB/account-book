<template>
  <div class="account-table__wrapper">
    <div class="account-table__header">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-button type="danger">刪除</el-button>
    </div>
    <div class="account-table__container">
      <el-table :data="accountData" border>
        <el-table-column
          v-for="item in tableColumns"
          :key="item.value"
          :label="item.label"
          :prop="item.value"
          v-bind="item"
        >
          <template slot-scope="{ row }">{{
            row[item.value] | columnFilter(item.value) | deVal
          }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template>
            <el-link type="primary">编辑</el-link>
            <el-link type="danger">删除</el-link>
          </template>
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

    <el-dialog title="添加" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="form"
        label-position="left"
      >
        <el-form-item label="开销类型" prop="consumeType">
          <el-select v-model="form.consumeType" placeholder="请选择">
            <el-option v-for="item in $DIC.consumeTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开销名称" prop="consumeName">
          <el-input v-model="form.consumeName"></el-input>
        </el-form-item>
        <el-form-item label="开销金额" prop="consumeSum">
          <el-input v-model="form.consumeSum"></el-input>
        </el-form-item>
        <el-form-item label="开销日期" prop="consumeTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.consumeTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="开销人" prop="consumer">
          <el-input v-model="form.consumer"></el-input>
        </el-form-item>
        <el-form-item label="是否为特殊项">
          <el-radio v-model="form.isSpecial" label="1">是</el-radio>
          <el-radio v-model="form.isSpecial" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { queryOriginalData } from "@/api/account-table.js";
const _ = require("lodash");
const tableColumns = [
  { type: "selection" },
  { label: "序号", type: "index", width: "80" },
  { label: "开销类型", value: "consumeType" },
  { label: "开销名称", value: "consumeName" },
  { label: "开销金额", value: "consumeSum" },
  { label: "开销日期", value: "consumeTime" },
  { label: "开销人", value: "consumer" },
  { label: "是否为特殊项", value: "isSpecial" },
  { label: "备注", value: "remark" },
];
export default {
  name: "AccountTable",
  filters: {
    columnFilter: (value, prop) => {
      if (prop === "isSpecial" && _.isBoolean(value)) {
        return value ? "是" : "否";
      }
      return value;
    },
  },
  inject: ['$DIC'],
  data() {
    return {
      tableColumns: Object.freeze(tableColumns),
      accountData: [],
      pager: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      dialogVisible: false,
      form: {
        consumeType: '',
        consumeName: '',
        consumeSum: '',
        consumeTime: '',
        consumer: '',
        isSpecial: '0',
        remark: ''
      },
      rules: {},
    };
  },
  mounted() {
    this.getAccountData();
  },
  methods: {
    handleAdd() {
      this.dialogVisible = true;
    },
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
        pageSize: this.pager.pageSize,
      };
      this.$HTTP('/AccountTable/queryOriginalData', params)
      // queryOriginalData(params)
        .then((res) => {
          this.accountData = res.data.data;
          this.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
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
      width: 100%;
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