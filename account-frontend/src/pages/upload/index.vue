<template>
  <div class="upload__wrapper">
    <div class="upload__select">
      <el-radio v-model="uploadType" label="1">微信账单</el-radio>
      <el-radio v-model="uploadType" label="2">支付宝账单</el-radio>
    </div>
    <el-upload
      :on-change="handleChange"
      :file-list="fileList"
      :show-file-list="false"
      :auto-upload="false"
      :action="url"
    >
      <el-button type="primary">上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import { uploadWX, uploadZFB } from "@/api/upload";

export default {
  name: "upload",
  data() {
    return {
      fileList: [],
      uploadType: "1",
      url: "",
    };
  },
  methods: {
    handleChange(file) {
      let formData = new FormData();
      formData.append("files", file.raw);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const cb = this.uploadType === "1" ? uploadWX : uploadZFB;
      cb(formData, config)
        .then((res) => {
          if (res.type == 0) {
            this.$message({
              message: "上传成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {},
};
</script>

<style lang="scss">
.upload__wrapper {
  padding: 35px;
  .upload__select {
    height: 48px;
    line-height: 48px;
  }
  .el-button {
    width: 88px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    padding: 0;
  }
}
</style>