<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      dics: {
        consumeTypes: []
      }
    }
  },
  provide() {
    return {
      $DIC: this.dics
    }
  },
  mounted() {
    this.getConsumeTypes();
  },
  methods: {
    getConsumeTypes() {
      const params = {
        name: 'consumeTypes'
      };
      this.$HTTP("/Dic/queryConsumeTypes", params)
        .then((res) => {
          this.dics['consumeTypes'] = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
