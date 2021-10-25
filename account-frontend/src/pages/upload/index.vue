<template>
  <div class="upload__wrapper">
    <div class="upload__select">
      <el-radio v-model="uploadType" label="1">微信账单</el-radio>
      <el-radio v-model="uploadType" label="2">支付宝账单</el-radio>
    </div>
    <el-upload
      :action="url"
      :on-change="handleChange"
      :file-list="fileList"
      :show-file-list="false"
      :auto-upload="false"
    >
      <el-button type="primary">上传</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "upload",
  data() {
    return {
      fileList: [],
      url: "/upload/uploadZfb",
      uploadType: '1'
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
      let url = this.uploadType === '1' ? "/Upload/uploadWx" : "/Upload/uploadZfb"
      this.$HTTP(url, { config: config, params: formData })
        .then((res) => {
          console.log(res);
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
  padding: 16px;
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