<template>
  <div class="statistics-layout__wrapper">
    <div class="filter-form">
      <slot name="filter-form"></slot>
    </div>
    <div class="line-echart">
      <slot name="line-echart"></slot>
    </div>
    <div class="bar-echart">
      <slot name="bar-echart"></slot>
    </div>
    <div class="pie-echart">
      <slot name="pie-echart"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Statistics-Layout",
  data() {
    return {

    };
  },
}
</script>

<style lang="scss" scoped>
.statistics-layout__wrapper {
  width: 100%;
  height: 100%;
  padding: 8px 10px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 63px calc(calc(100% - 63px) / 2) calc(calc(100% - 63px) / 2);
  .filter-form {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  .line-echart {
    grid-row-start: 2;
    grid-row-end: 4;
  }
}
</style>