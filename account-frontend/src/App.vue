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
        consumeTypes: [
          {
            value: '0',
            label: '生活用品'
          },
          {
            value: '1',
            label: '休闲娱乐'
          }
        ]
      }
    }
  },
  provide() {
    return {
      $DIC: this.dics
    }
  },
  mounted() {
    console.log(process.env.VUE_APP_API_PREFIX)
    this.getConsumeTypes();
  },
  methods: {
    getConsumeTypes() {
      const params = {
        name: 'consumeTypes'
      };
      this.$HTTP("/Dic/queryConsumeTypes", params)
        .then((res) => {
          this.dics['consumeTypes'] = res.data;
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
