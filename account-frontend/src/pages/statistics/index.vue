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
          <el-form-item label="时间范围">
            <el-date-picker
              type="daterange"
              v-model="timeRangeProxy"
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
          <el-form-item>
            <el-button type="primary" @click="handleQuery"
              >查询</el-button
            >
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="pieChart" slot="pie-echart"></div>
      <div id="barChart" slot="bar-echart">
        <div v-for="item1 in Object.keys(list)" :key="item1">
          <div class="month">{{ item1 }}</div>
          <div v-for="(item2, index) in Object.keys(list[item1])" :key="index">
            <div class="name">{{ $DIC.personNames[item2] }}</div>
            <div class="value">
              <span
                >正常开销:&nbsp;
                {{ list[item1][item2].notSpecialSum.toFixed(2) }}</span
              >
              <span
                >特殊开销:&nbsp;
                {{ list[item1][item2].specialSum.toFixed(2) }}</span
              >
              <span
                >总开销:&nbsp;
                {{
                  (
                    list[item1][item2].specialSum +
                    list[item1][item2].notSpecialSum
                  ).toFixed(2)
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </StatisticsLayout>
  </div>
</template>

<script>
/* eslint-disable */
import StatisticsLayout from "./statistics-layout.vue";
import moment from "moment";
import {
  getStatisticsByCustomType,
  getStatisticsByGroup,
} from "@/api/statistic";

const echarts = require("echarts");

export default {
  name: "Statistics",
  components: { StatisticsLayout },
  inject: ["$DIC"],
  data() {
    return {
      form: {
        personNames: [],
        statisticsTime: [
          moment().subtract(2, "months").format("YYYY-MM-DD"),
          moment().subtract(1, "months").format("YYYY-MM-DD"),
        ],
      },
      rules: {},
      pieStatisticData: {},
      statisticData: {},
    };
  },
  computed: {
    timeRangeProxy: {
      set(newVal) {
        this.form.statisticsTime = [
          moment(newVal[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(newVal[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ];
      },
      get() {
        return this.form.statisticsTime;
      },
    },
    list() {
      const result = {};
      Object.keys(this.statisticData).map((item) => {
        const dataList = this.statisticData[item];
        console.log(dataList);
        const statistic = dataList.reduce((pre, cur) => {
          if (!Object.prototype.hasOwnProperty.call(pre, cur.consumer)) {
            pre[cur.consumer] = {};
          }
          if (
            !Object.prototype.hasOwnProperty.call(
              pre[cur.consumer],
              "notSpecialSum"
            )
          ) {
            pre[cur.consumer].notSpecialSum = 0;
          }
          if (
            !Object.prototype.hasOwnProperty.call(
              pre[cur.consumer],
              "specialSum"
            )
          ) {
            pre[cur.consumer].specialSum = 0;
          }

          if (cur.isSpecial) {
            pre[cur.consumer].specialSum += cur.consumeSum;
          } else {
            pre[cur.consumer].notSpecialSum += cur.consumeSum;
          }
          return pre;
        }, {});
        result[item] = statistic;
      });
      console.log(result);
      return result;
    },
  },
  mounted() {
    this.handleQuery();
  },
  methods: {
    handleQuery() {
      this.getPieStatisticData();
      this.getStatisticData();
    },
    getPieStatisticData() {
      const data = {
        personNames: this.form.personNames,
        statisticsTime: this.timeRangeProxy,
      };
      getStatisticsByCustomType(data).then((res) => {
        const dataMap = new Map();
        res.data.map((item) => {
          dataMap.set(item._id, item.sum);
        });
        this.pieStatisticData = Object.keys(this.$DIC.consumeTypes).reduce(
          (pre, cur) => {
            if (dataMap.has(cur)) {
              pre[this.$DIC.consumeTypes[cur]] = dataMap.get(cur);
            } else {
              pre[this.$DIC.consumeTypes[cur]] = 0;
            }
            return pre;
          },
          {}
        );
        this.initPieChart();
      });
    },
    initPieChart() {
      const pieChart = echarts.init(document.getElementById("pieChart"));
      let data = Object.keys(this.pieStatisticData).reduce((pre, cur) => {
        return pre.concat({
          name: cur,
          value: this.pieStatisticData[cur],
        });
      }, []);
      let options = {
        title: {
          text: "开销分布",
          left: "center",
          top: "5%",
        },
        legend: {
          orient: "vertical",
          top: "center",
          left: "5%",
        },
        series: [
          {
            type: "pie",
            radius: ["15%", "65%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              alignTo: "edge", // 文字对齐
              formatter: "{b}\n{c}",
              minMargin: 5,
              lineHeight: 15,
            },
            labelLayout: function (params) {
              // 延长引导线
              const isLeft = params.labelRect.x < pieChart.getWidth() / 2;
              const points = params.labelLinePoints;

              points[2][0] = isLeft
                ? params.labelRect.x
                : params.labelRect.x + params.labelRect.width;
              return {
                labelLinePoints: points,
              };
            },
            data: data,
          },
        ],
      };
      pieChart.setOption(options);
    },
    getStatisticData() {
      const data = {
        personNames: this.form.personNames,
        statisticsTime: this.timeRangeProxy,
      };
      getStatisticsByGroup(data).then((res) => {
        this.statisticData = res.data.reduce((pre, cur) => {
          const months = moment
            .duration(
              moment(data.statisticsTime[1]) - moment(data.statisticsTime[0])
            )
            .months();
          for (let i = 0; i < months; i++) {
            const timeRange = moment(data.statisticsTime[0]);
            const start = timeRange.add(i, "months").format("YYYY-MM");
            const end = timeRange.add(i + 1, "months").format("YYYY-MM");
            const key = `${start}---${end}`;
            if (!Object.prototype.hasOwnProperty.call(pre, key)) {
              pre[key] = [];
            }
            const time = cur.consumeTime.slice(0, 7);
            if (time >= start && time <= end) {
              pre[key].push(cur);
            }
          }
          return pre;
        }, {});
      });
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
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
.statistics__wrapper {
  width: 100%;
  height: 100%;
  #pieChart {
    width: 100%;
    height: 100%;
  }
  #barChart {
    width: 100%;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
    overflow-y: scroll;
    > div {
      border-bottom: 1px solid #e5e5e5;
      padding: 10px 0;
      box-sizing: border-box;
      .name {
        margin: 10px 0;
      }
      .value {
        > span {
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>