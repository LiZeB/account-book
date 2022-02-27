<template>
  <div id="app">
    <NavBar :menu-list="menuList" class="navbar"></NavBar>
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import { queryTypes } from "@/api/account-table.js";
import NavBar from "@/components/navbar";

export default {
  name: "App",
  components: { NavBar },
  data() {
    return {
      dics: {
        consumeTypes: [],
        indicatorTypes: [],
        personNames: [],
      },
      menuList: [
        { title: "账单管理", path: "/account-table" },
        { title: "统计分析", path: "/statistics" },
        { title: "账单上传", path: "/upload" }
      ]
    };
  },
  provide() {
    return {
      $DIC: this.dics,
    };
  },
  mounted() {
    this.getQueryDic("consumeTypes");
    this.getQueryDic("personNames");
    this.getQueryDic("indicatorTypes");
  },
  methods: {
    getQueryDic(keyName) {
      const params = { name: keyName };
      queryTypes(params)
        .then((res) => {
          this.dics[keyName] = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  display: flex;
  .navbar {
    width: 300px;
    height: 100%;
  }
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
