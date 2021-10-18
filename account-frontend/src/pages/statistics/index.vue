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
            <el-select multiple v-model="form.personNames">
              <el-option
                v-for="(label, value) in $DIC.personNames"
                :key="value"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="统计开销类型" prop="consumeTypes">
            <el-select v-model="form.consumeType" multiple placeholder="请选择">
              <el-option
                v-for="(label, value) in $DIC.consumeTypes"
                :key="value"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="统计指标类型" prop="indicatorType">
            <el-select v-model="form.statisticsItem">
              <el-option
                v-for="(label, value) in $DIC.indicatorTypes"
                :key="value"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getStatisticData">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="lineChart" slot="line-echart">
        
      </div>
      <div id="barChart" slot="bar-echart">

      </div>
      <div id="pieChart" slot="pie-echart">
        
      </div>
    </StatisticsLayout>
  </div>
</template>

<script>
import StatisticsLayout from "./statistics-layout.vue";
import moment from "moment";

const echarts = require('echarts');

export default {
  name: "Statistics",
  components: { StatisticsLayout },
  inject: [ "$DIC", "getIndicatorTypes", "getPersonNames" ],
  data() {
    return {
      form: {
        statisticsTime: [
          moment().startOf("month").format("YYYY-MM-DD"),
          moment().endOf("month").format("YYYY-MM-DD"),
        ],
        personNames: [],
        consumeTypes: [],
        indicatorType: [],
      },
      rules: {},
      statisticData: {},
    };
  },
  mounted() {
    this.getIndicatorTypes();
    this.getPersonNames();

    this.getStatisticData();
  },
  methods: {
    getStatisticData() {
      this.statisticData = {
        '休闲娱乐': 1048,
        '日用百货': 948,
        '餐饮美食': 848,
        '水果零食': 748,
        '旅游出行': 648,
        '服饰装扮': 548,
        '亲友长辈': 448,
        '其他': 348,
      };
      this.initChart();
    },
    initChart() {
      this.initLineChart();
      this.initBarChart();
      this.initPieChart();
    },
    initLineChart() {

    },
    initBarChart() {

    },
    initPieChart() {
      let pieChart = echarts.init(document.getElementById("pieChart"));

      let data = Object.keys(this.statisticData).reduce((pre, cur)=>{
        return pre.concat({
          name: cur,
          value: this.statisticData[cur]
        });
      }, []);

      let options = {
        title: {
          text: '开销分布',
          left: 'center',
          top: '5%'
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          left: '5%'
        },
        series: [
          {
            type: 'pie',
            radius: ['15%', '65%'],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              alignTo: 'edge', // 文字对齐
              formatter: '{b}\n{c}',
              minMargin: 5,
              lineHeight: 15,
            },
            labelLayout: function (params) { // 延长引导线
              const isLeft = params.labelRect.x < pieChart.getWidth() / 2;
              const points = params.labelLinePoints;

              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
              return {
                labelLinePoints: points
              };
            },
            data: data
          }
        ],
      };

      pieChart.setOption(options);
    },
    handleReset() {
      this.form = {
        statisticsTime: [
          moment().startOf("month").format("YYYY-MM-DD"),
          moment().endOf("month").format("YYYY-MM-DD"),
        ],
        personNames: [],
        consumeTypes: [],
        indicatorType: [],
      };
      this.getStatisticData();
    }
  },
};
</script>

<style lang="scss" scoped>
.statistics__wrapper {
  width: 100%;
  height: 100%;
  #pieChart{
    width: 100%;
    height: 100%;
  }
}
</style>