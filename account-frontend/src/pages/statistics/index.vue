<template>
  <div class="statistics__wrapper">
    <StatisticsLayout>
      <div class="filter-form" slot="filter-form">
        <el-form
          :model="form"
          :rules="rules"
          ref="filterForm"
          label-width="100px"
          class="form"
          label-position="right"
          :inline="true"
        >
          <el-form-item label="时间范围" prop="statisticsTime">
            <el-date-picker
              type="daterange"
              v-model="form.statisticsTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="姓名" prop="personNames">
            <el-select v-model="form.personNames">
              <el-option
                v-for="(label, value) in personOptions"
                :key="value"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="统计数据" prop="statisticsItem">
            <el-select v-model="form.statisticsItem">
              <el-option
                v-for="(label, value) in statisticsOptions"
                :key="value"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getStatisticData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="line-echart" slot="line-echart">

      </div>
      <div class="bar-echart" slot="bar-echart">

      </div>
      <div class="pie-echart" slot="pie-echart">
        
      </div>
    </StatisticsLayout>
  </div>
</template>

<script>
import StatisticsLayout from "./statistics-layout.vue";

export default {
  name: "Statistics",
  components: { StatisticsLayout },
  data() {
    return {
      form: {
        statisticsTime: [],
        personNames: [],
        statisticsItem: [],
      },
      rules: {},
      personOptions: [],
      statisticsOptions: [],
    };
  },
  methods: {
    getStatisticData() {},
  },
};
</script>

<style lang="scss" scoped>
.statistics__wrapper {
  width: 100%;
  height: 100%;
}
</style>