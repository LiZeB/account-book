<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <el-menu-item
        v-for="(item, index) in menuList"
        :key="index"
        :index="item.path"
    >
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.title}}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
    name: "NavBar",
    props: {
        menuList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {

        };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
}
</script>