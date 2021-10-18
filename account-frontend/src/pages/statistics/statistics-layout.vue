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
    return {};
  },
};
</script>

<style lang="scss" scoped>
.statistics-layout__wrapper {
  width: 100%;
  height: 100%;
  padding: 8px 10px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: calc(50% - 8px);
  grid-template-rows: 56px repeat( 2, calc(calc(100% - 72px) / 2) );
  grid-column-gap: 16px;
  grid-row-gap: 8px;
  background: #e5e5e5;
  .filter-form {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-column-gap: 16px;
  }
  .line-echart {
    grid-row-start: 2;
    grid-row-end: 4;
  }
  div:not(:first-child) {
    background: #ffffff;
    border-radius: 4px;
  }
}
</style>