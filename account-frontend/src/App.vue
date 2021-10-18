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
        consumeTypes: [],
        indicatorTypes: [],
        personNames: []
      },
    };
  },
  provide() {
    return {
      $DIC: this.dics,
      getIndicatorTypes: this.getIndicatorTypes,
      getPersonNames: this.getPersonNames
    };
  },
  mounted() {
    this.getConsumeTypes();
  },
  methods: {
    getConsumeTypes() {
      const params = {
        name: "consumeTypes",
      };
      this.$HTTP("/Dic/queryConsumeTypes", params)
        .then((res) => {
          this.dics["consumeTypes"] = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getIndicatorTypes() {
      const params = {
        name: "indicatorTypes",
      };
      this.$HTTP("/Dic/queryIndicatorTypes", params)
        .then((res) => {
          this.dics["indicatorTypes"] = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getPersonNames() {
      const params = {
        name: "personNames",
      };
      this.$HTTP("/Dic/queryPersonNames", params)
        .then((res) => {
          this.dics["personNames"] = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
/*自定义滚动条*/
/*外容器*/
::-webkit-scrollbar {
  width: 8px;
  display: none;
}
/*滑块*/
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: #cfcbcb;
  border: 1px solid transparent;
  background-clip: content-box;
}
/*滑槽*/
::-webkit-scrollbar-track {
  background-color: #ffffff;
}
/*上下方按钮*/
::-webkit-scrollbar-button {
  background-color: #ffffff;
  height: 0;
}
</style>
