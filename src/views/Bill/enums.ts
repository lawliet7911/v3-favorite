import * as echarts from "echarts";
const CHAR_MONTH_OPTIONS = {
  title: {
    text: "月度支出表",
  },
  backgroundColor: "#fff",
  tooltip: {
    trigger: "axis",
  },
  legend: {
    color: ["#F9A589"],
    data: ["支出", "预算平均值"],
    left: "center",
    bottom: "6%",
  },
  grid: {
    top: "middle",
    left: "3%",
    right: "4%",
    bottom: "3%",
    height: "70%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 45,
    },
    axisLine: {
      lineStyle: {
        color: "#999",
      },
    },
  },
  yAxis: {
    type: "value",

    splitLine: {
      lineStyle: {
        type: "dashed",
        color: "#DDD",
      },
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: "#333",
      },
    },
    nameTextStyle: {
      color: "#999",
    },
    splitArea: {
      show: false,
    },
  },
  series: [
    {
      name: "支出",
      type: "line",
      data: [],
      lineStyle: {
        normal: {
          width: 3,
          color: {
            type: "linear",

            colorStops: [
              {
                offset: 0,
                color: "#F6D06F", // 0% 处的颜色
              },
              {
                offset: 0.4,
                color: "#F9A589", // 100% 处的颜色
              },
              {
                offset: 1,
                color: "#F9A589", // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          },
          shadowColor: "rgba(249,165,137, 0.5)",
          shadowBlur: 10,
          shadowOffsetY: 7,
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "rgba(249,165,137,0.5)",
              },
              {
                offset: 0.5,
                color: "rgba(249,165,137,.3)",
              },
              {
                offset: 1,
                color: "rgba(249,165,137,0)",
              },
            ],
            false
          ),
        },
      },
      itemStyle: {
        normal: {
          color: "#F6D06F",
          borderWidth: 10,
          borderColor: "#F6D06F",
        },
      },
      smooth: true,
    },
    {
      name: "预算平均值",
      type: "line",
      symbol: "circle",
      symbolSize: 8,
      itemStyle: {
        normal: {
          type: "dashed",
          color: "rgba(245, 61, 95, 1)",
          lineStyle: {
            color: "rgba(245, 61, 95, 1)",
            width: 3,
          },
        },
      },
      markLine: {
        symbol: "none",
        silent: true,
        label: {
          position: "start",
        },
        data: [
          {
            yAxis: 0,
            label: {
              show: true,
              position: "",
            },
          },
        ],
      },
    },
  ],
};

export { CHAR_MONTH_OPTIONS };
