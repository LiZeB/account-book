<template>
  <div class="account-table__wrapper">
    <div class="account-table__filter">
      <el-form
        :model="form"
        :rules="rules"
        ref="filterForm"
        label-width="100px"
        class="form"
        label-position="right"
        :inline="true"
      >
        <el-form-item label="开销类型" prop="consumeType">
          <el-select v-model="form.consumeType" clearable placeholder="请选择">
            <el-option
              v-for="(label, value) in $DIC.consumeTypes"
              :key="value"
              :label="label"
              :value="String(value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开销日期" prop="consumeTime">
          <el-date-picker
            type="daterange"
            placeholder="选择日期"
            v-model="form.consumeTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="开销人" prop="consumer">
          <el-select v-model="form.consumer" clearable placeholder="请选择">
            <el-option
              v-for="(label, value) in $DIC.personNames"
              :key="value"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="account-table__operate">
      <el-button type="success" @click="handleExport">导入</el-button>
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-button type="danger" @click="handleMultiDelete">刪除</el-button>
    </div>
    <div class="account-table__container">
      <el-table
        :data="accountData"
        border
        height="100%"
        max-height="100%"
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
            {{ row[item.value] | columnFilter(item.value, vm) | deVal }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="handleEdit(row)">编辑</el-link
            >&nbsp;&nbsp;
            <el-link type="danger" @click="handleDelete(row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="account-table__footer">
        <el-pagination
          @size-change="pageSizeChange"
          @current-change="pageNoChange"
          :current-page="pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      top="5vh"
      class="dialog"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="dialogForm"
        label-width="120px"
        class="form"
        label-position="left"
      >
        <el-form-item label="开销类型" prop="consumeType">
          <el-select v-model="addForm.consumeType" placeholder="请选择">
            <el-option
              v-for="(label, value) in $DIC.consumeTypes"
              :key="value"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开销名称" prop="consumeName">
          <el-input v-model="addForm.consumeName"></el-input>
        </el-form-item>
        <el-form-item label="开销金额（元）" prop="consumeSum">
          <el-input v-model="addForm.consumeSum"></el-input>
        </el-form-item>
        <el-form-item label="开销日期" prop="consumeTime">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="addForm.consumeTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="开销人" prop="consumer">
          <el-input v-model="addForm.consumer"></el-input>
        </el-form-item>
        <el-form-item label="是否为特殊项" prop="isSpecial">
          <el-radio v-model="addForm.isSpecial" :label="true">是</el-radio>
          <el-radio v-model="addForm.isSpecial" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="addForm.remark"
          ></el-input>
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
import moment from "moment";
const _ = require("lodash");

const tableColumns = [
  { label: "开销类型", value: "consumeType", width: "120" },
  { label: "开销名称", value: "consumeName", width: "200" },
  { label: "开销金额（元）", value: "consumeSum", width: "120" },
  { label: "开销日期", value: "consumeTime", width: "180" },
  { label: "开销人", value: "consumer", width: "120" },
  { label: "是否为特殊项", value: "isSpecial", width: "120" },
  { label: "备注", value: "remark" },
];

export default {
  name: "AccountTable",
  inject: ["$DIC"],
  filters: {
    columnFilter: (value, prop, vm) => {
      if (prop === "isSpecial" && _.isBoolean(value)) {
        return value ? "是" : "否";
      } else if (prop === "consumeType" && value) {
        return vm.$DIC["consumeTypes"][value];
      } else if (prop === "consumer" && value) {
        return vm.$DIC["personNames"][value];
      }
      return value;
    },
  },
  data() {
    return {
      vm: this,
      tableColumns: Object.freeze(tableColumns),
      accountData: [],
      pageNo: 1,
      pageSize: 20,
      total: 0,
      dialogVisible: false,
      form: {
        consumeType: "",
        consumeTime: [
          moment(`${moment().format("YYYY-MM")}-10`)
            .subtract(1, "months")
            .format("YYYY-MM-DD"),
          moment(`${moment().format("YYYY-MM")}-10`).format("YYYY-MM-DD"),
        ],
        consumer: "",
      },
      addForm: {
        consumeType: "",
        consumeName: "",
        consumeSum: "",
        consumeTime: "",
        consumer: "",
        isSpecial: false,
        remark: "",
      },
      rules: {},
      addRules: {},
      dialogTitle: "添加",
      selections: [],
    };
  },
  mounted() {
    this.getAccountData();
  },
  methods: {
    handleQuery() {
      this.pageSize = 20;
      this.pageNum = 1;
      this.getAccountData();
    },
    handleReset() {
      this.form = {
        consumeType: "",
        consumeTime: [
          moment(`${moment().format("YYYY-MM")}-10`)
            .subtract(1, "months")
            .format("YYYY-MM-DD"),
          moment(`${moment().format("YYYY-MM")}-10`).format("YYYY-MM-DD"),
        ],
        consumer: "",
      };
      this.pageNum = 1;
      this.pageSize = 20;
      this.getAccountData();
    },
    handleSelectionChange(selection) {
      this.selections = selection;
    },
    handleMultiDelete() {
      if (!this.selections.length) {
        this.$message({
          type: "warning",
          message: "请先选择要删除的数据，再进行删除操作!",
        });
        return;
      }
      const ids = this.selections.map((item) => item.id).join(",");
      this.handleDelete(ids);
    },
    handleDelete(ids) {
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteOriginalData({ ids })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getAccountData();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleEdit(data) {
      this.addForm = { ...data };
      this.dialogVisible = true;
      this.dialogTitle = "编辑";
    },
    handleSave() {
      const data = {
        ...this.addForm,
      };
      const func = this.addForm.id ? editOriginalData : saveOriginalData;
      func(data).then(() => {
        this.getAccountData();
        this.$message({
          message: "保存成功",
          type: "success",
        });
        this.dialogVisible = false;
        this.addForm = {};
      });
    },
    handleCancel() {
      this.resetForm();
      this.dialogVisible = false;
    },
    resetForm() {
      this.addForm = {
        consumeType: "",
        consumeName: "",
        consumeSum: "",
        consumeTime: "",
        consumer: "",
        isSpecial: false,
        remark: "",
      };
    },
    handleAdd() {
      this.resetForm();
      this.dialogVisible = true;
      this.dialogTitle = "添加";
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getAccountData();
    },
    pageNoChange(pageNo) {
      this.pageNo = pageNo;
      this.getAccountData();
    },
    getAccountData() {
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        ...this.form,
      };
      queryOriginalData(params)
        .then((res) => {
          this.accountData = res.data.data;
          this.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleExport() {},
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
  .account-table__operate {
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
  .account-table__filter {
    .form {
      .el-form-item {
        &:last-child {
          margin-left: 32px;
        }
      }
    }
  }
  .account-table__container {
    height: calc(100% - 168px);
    .el-table {
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
  .el-dialog {
    .form {
      .el-select,
      .el-date-editor {
        width: 100%;
      }
    }
  }
}
</style>