<!--
 * @Author: akexian
 * @Date: 2022-06-27
 * @Description: 词云
-->
<template>
  <div class="word-container">
    <div class="chart" id="chart_right1"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

import "echarts-wordcloud/dist/echarts-wordcloud";
import "echarts-wordcloud/dist/echarts-wordcloud.min";
import { blobToDataURI } from '@/utils/index'
const data = [{
  name: '新零售',
  value: 810,
  textStyle: {
    color: '#86D4FF'
  }
}, {
  name: '云计算',
  value: 520,
  textStyle: {
    color: '#FF8F6C'
  }
}, {
  name: "人工智能",
  value: 928,
  textStyle: {
    color: '#2CF263'
  }
}, {
  name: "大数据",
  value: 906,
  textStyle: {
    color: '#9FA8F7'
  }
}, {
  name: "互联网",
  value: 825,
  textStyle: {
    color: '#1274FF'
  }
}, {
  name: "数据可视化",
  value: 486,
  textStyle: {
    color: '#FFC629'
  }
}, {
  name: "数据只能",
  value: 53,
  textStyle: {
    color: '#FFAB2E'
  }
}, {
  name: "机器学习",
  value: 927,
  textStyle: {
    color: '#86D4FF'
  }
}, {
  name: "零售行业",
  value: 1308,
  textStyle: {
    color: '#F78289'
  }
}, {
  name: "供应链",
  value: 693,
  textStyle: {
    color: '#FF6C96'
  }
}, {
  name: "智慧门店",
  value: 611,
  textStyle: {
    color: '#45BFD4'
  }
}, {
  name: "数据服务",
  value: 312,
  textStyle: {
    color: '#4E31FF'
  }
}, {
  name: "关联分析",
  value: 941,
  textStyle: {
    color: '#31FBFB'
  }
}, {
  name: "应用层",
  value: 358,
  textStyle: {
    color: '#86D4FF'
  }
}, {
  name: "网络层",
  value: 246,
  textStyle: {
    color: '#BF8AFD'
  }
}, {
  name: "数据层",
  value: 207,
  textStyle: {
    color: '#FFF500'
  }
}, {
  name: "基础层",
  value: 194,
  textStyle: {
    color: '#DE58FF'
  }
}, {
  name: "可视化",
  value: 211,
  textStyle: {
    color: '#72ED7C'
  }
}, {
  name: "数据挖掘",
  value: 1309,
  textStyle: {
    color: '#0BEEB8'
  }
}, {
  name: '云计算',
  value: 52,
  textStyle: {
    color: '#931CFF'
  }
}, {
  name: "人工智能",
  value: 92,
  textStyle: {
    color: '#3D25F2'
  }
}, {
  name: "大数据",
  value: 90,
  textStyle: {
    color: '#F995C8'
  }
}, {
  name: "互联网",
  value: 82,
  textStyle: {
    color: '#FBE9B4'
  }
}
]
const blackcolor = ['#000000', '#2a2a2a', '#545454', '#7e7e7e']
const redcolor = ['rgb(249,8,8)', 'rgba(249,8,8, 0.7)', 'rgba(249,8,8, 0.5)', 'rgba(249,8,8, 0.3)']

//备份
const iterate = (arr, i, j, l) => {
  if (l === 0) {
    for (let k = i; k <= j; k++) {
      if (k === 0) {
        arr[k].textStyle = { color: blackcolor[l], fontSize: 60 }
      } else if (k < 3) {
        if (k % 2 === 0) {
          arr[k].textStyle = { color: redcolor[l], fontSize: 40 }
        } else {
          arr[k].textStyle = { color: blackcolor[l], fontSize: 55 }
        }
      } else {
        if (k % 2 === 0) {
          arr[k].textStyle = { color: redcolor[l], fontSize: 40 - k }
        } else {
          arr[k].textStyle = { color: blackcolor[l], fontSize: 40 - k }
        }
      }
    }
  } else {
    for (let k = i; k <= j; k++) {
      if (k % 2 === 0) {
        arr[k].textStyle = { color: redcolor[l] }
      } else {
        arr[k].textStyle = { color: blackcolor[l] }
      }
    }
  }
}
/**
 * 调整颜色和权重
 */
const dealworddata = (data) => {
  let len = data.length
  if (len <= 8) {
    let i = 0, j = 0, k = 0
    while (k < len) {
      if (k % 2 === 0) {
        data[k].textStyle = { color: redcolor[i] }
        i++
      } else {
        data[k].textStyle = { color: blackcolor[j] }
        j++
      }
      k++
    }
  } else {
    let mid = len >> 1
    let leftmid = len >> 1
    let rightmid = (len - 1 + mid) >> 1
    iterate(data, 0, leftmid, 0)
    iterate(data, leftmid, mid, 1)
    iterate(data, mid, rightmid, 2)
    iterate(data, rightmid, len - 1, 3)
  }
}


export default {
  name: "wordCloud",
  data() {
    return {
      timer: null,
      maskImageFrom: 'http://localhost:3000/upload/banner/1676884994515-439642677-banner2.jpeg',
      maskImage: {
        src: '',
      },
    }
  },
  mounted() {
    // this.getBase64()

    // dealworddata(data) //红黑色
    this.getEchartRight1(data); //每项数据自自定义颜色

    this.timer = setInterval(() => {
      this.getEchartRight1(data);
    }, 5000)
  },
  methods: {
    getEchartRight1(data) {
      let myChart = echarts.init(document.getElementById('chart_right1'));
      let option = {
        // tooltip: {
        //   show: false
        // },
        series: [{
          type: 'wordCloud',
          gridSize: 1,
          sizeRange: [12, 50],
          rotationRange: [-90, 90],
          rotationStep: 45,
          shape: 'diamond',
          width: '90%',
          textPadding: 0,
          autoSize: {
            enable: true,
            minSize: 6
          },
          layoutAnimation: true,
          textStyle: {
            normal: {
              textBorderColor: 'rgba(255,255,255,0.3)',
              textBorderWidth: 1,
              color: (item) => {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')';
              }
            },
            emphasis: {
              fontSize: 20,
              // shadowBlur: 10,
              // shadowColor: 'rgba(255,255,255, .1)'
            }
          },
          data: data
        }]
      }

      myChart.setOption(option, true);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    getBase64() {
      fetch(this.maskImageFrom).then(res => res.blob())
        .then(data => {
          blobToDataURI(data, (result) => {
            this.maskImage.src = result;
            console.log(this.maskImage, 'maskImage');
          })
        })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
.word-container {
  .chart {
    // height: 3rem;
    // width: 300px;
    height: 300px;
  }
}
</style>
