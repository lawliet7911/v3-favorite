<template>
  <div class="chart" :id="chartId"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ECharts } from 'echarts'
import { monthChart } from 'src/api/bill'
import { CHAR_MONTH_OPTIONS } from '../enums'
import { onMounted, ref } from 'vue'

const props = defineProps({
  dateStr: String
})
let chartId = ref<string>('')

onMounted(() => {
  chartId.value = Math.ceil(Math.random() * (10 ^ 10)).toString()
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
  let dom: HTMLElement | null = document.getElementById(chartId.value)
  if (!dom) return
  chart = echarts.init(dom)
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
