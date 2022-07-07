<template>
  <div class="chart" :id="chartId"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ECharts, EChartOption } from 'echarts'
import { monthChart } from 'src/api/bill.js'
import { CHAR_MONTH_OPTIONS } from '../enums'
import { onMounted, ref } from 'vue'

const props = defineProps({
  dateStr: String,
})
let chartId = ref<string>('')
chartId.value = Math.ceil(Math.random() * 100000000000000).toString()

onMounted(() => {
  getData()
})

let chart: ECharts | null = null

const getData = async () => {
  let res = await monthChart({ dateStr: props.dateStr })
  let option = CHAR_MONTH_OPTIONS as any
  option.xAxis.data = res.data.xAxis
  option.series[0].data = res.data.data
  option.series[1].markLine.data[0].yAxis = res.data.avgMoney
  option.yAxis.max = function (value: any) {
    if (value.max > Math.ceil(res.data.avgMoney)) {
      return value.max
    } else {
      return Math.ceil(res.data.avgMoney)
    }
  }
  if (chart) chart.dispose()
  let dom = document.getElementById(chartId.value)
  chart = echarts.init(dom as any)
  // 绘制图表
  chart.setOption(CHAR_MONTH_OPTIONS as any)
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
