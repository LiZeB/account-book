<template>
  <div class="account-table__wrapper">
    <div class="account-table__header">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-button type="warning" @click="handleMultiDelete">刪除</el-button>
    </div>
    <div class="account-table__container">
      <el-table
        :data="accountData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column
          v-for="item in tableColumns"
          :key="item.value"
          :label="item.label"
          :prop="item.value"
          v-bind="item"
        >
          <template slot-scope="{ row }">
            {{
            row[item.value] | columnFilter(item.value) | deVal
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="handleEdit(row)">编辑</el-link>&nbsp;&nbsp;
            <el-link type="primary" @click="handleDelete(row.id)">删除</el-link>
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

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      top="2.6vh"
      class="dialog"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="form"
        label-position="top"
      >
        <el-form-item label="开销类型" prop="consumeType">
          <el-select v-model="form.consumeType" placeholder="请选择" style="width:100%">
            <el-option label="休闲娱乐" :value="1"></el-option>
            <el-option label="日用百货" :value="2"></el-option>
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
            style="width:100%"
            v-model="form.consumeTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="开销人" prop="consumer">
          <el-input v-model="form.consumer"></el-input>
        </el-form-item>
        <el-form-item label="是否为特殊项" prop="isSpecial">
          <el-radio v-model="form.isSpecial" :label="true">是</el-radio>
          <el-radio v-model="form.isSpecial" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryOriginalData,
  saveOriginalData,
  deleteOriginalData,
  editOriginalData,
} from "@/api/account-table.js";
const _ = require("lodash");
const tableColumns = [
  { label: "开销类型", value: "consumeType" },
  { label: "开销名称", value: "consumeName" },
  { label: "开销金额", value: "consumeSum" },
  { label: "开销日期", value: "consumeTime" },
  { label: "开销人", value: "consumer" },
  { label: "是否为特殊项", value: "isSpecial" },
  { label: "备注", value: "remark" }
];
export default {
  name: "AccountTable",
  filters: {
    columnFilter: (value, prop) => {
      if (prop === "isSpecial" && _.isBoolean(value)) {
        return value ? "是" : "否";
      }
      if (prop === "consumeType" && value) {
        return value == "1" ? "休闲娱乐" : "日用百货";
      }
      return value;
    }
  },
  data() {
    return {
      tableColumns: Object.freeze(tableColumns),
      accountData: [],
      pager: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false,
      form: {
        consumeType: 0,
        consumeName: "",
        consumeSum: "",
        consumeTime: "",
        consumer: "",
        isSpecial: false,
        remark: ""
      },
      rules: {},
      dialogTitle: "添加",
      selections: []
    };
  },
  mounted() {
    this.getAccountData();
  },
  methods: {
    handleSelectionChange(selection) {
      console.log(selection);
      this.selections = selection;
    },
    handleMultiDelete() {
      if (!this.selections.length) {
        this.$message({
          type: "warning",
          message: "请先选择要删除的数据，再进行删除操作!"
        });
        return;
      }
      const ids = this.selections.map(item => item.id).join(",");
      this.handleDelete(ids);
    },
    handleDelete(ids) {
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteOriginalData({ ids })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getAccountData();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleEdit(data) {
      this.form = data;
      this.dialogVisible = true;
      this.dialogTitle = "编辑";
    },
    handleSave() {
      const data = {
        ...this.form
      };
      const func = this.form.id ? editOriginalData : saveOriginalData;
      func(data).then(() => {
        this.getAccountData();
        this.$message({
          message: "保存成功",
          type: "success"
        });
        this.dialogVisible = false;
        this.form = {};
      });
    },
    handleCancel() {
      this.form = {
        consumeType: 0,
        consumeName: "",
        consumeSum: "",
        consumeTime: "",
        consumer: "",
        isSpecial: false,
        remark: ""
      };
      this.dialogVisible = false;
    },
    handleAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "添加";
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
        pageSize: this.pager.pageSize
      };
      queryOriginalData(params)
        .then(res => {
          this.accountData = res.data.data;
          this.total = res.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss">
.dialog {
  .form {
    .el-form-item {
      margin-bottom: 5px;
    }
  }
}
</style>

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