<!--
 描述: 新闻无缝滚动
-->


<template>
  <div class="wrap-container sn-container">
    <div class="sn-content">
      <div class="sn-title">订单动态</div>
      <div class="sn-body">
        <div class="wrap-container">

          <div class="table">
            <table border="0" cellpadding="0" cellspacing="0" class="table-header">
              <tbody>
                <tr>
                  <td width="20%">
                    <span>时间</span>
                  </td>
                  <td width="20%">
                    <span>金额</span>
                  </td>
                  <td width="60%">
                    <span>地址</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <vue-seamless-scroll :data="listData" class="seamless-warp"
              :class-option="optionSetting">
              <table border="0" cellpadding="0" cellspacing="0" class="item">
                <tbody>
                  <tr v-for="(item, index) in listData" :key="index">
                    <td class="title">
                      <span>{{ item.createTime | onlyDate }}</span>
                    </td>
                    <td>
                      <span>{{ item.actualAmount }}</span>
                    </td>
                    <td>
                      <span
                        :class="{colorRed: item.actualAmount > 2, colorOrange: item.actualAmount < 10}">{{ item.address }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </vue-seamless-scroll>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'

import echarts from "echarts";

export default {
  name: "seamless",
  components: {
    vueSeamlessScroll
  },
  props: {
    listData: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {

    }
  },
  computed: {
    optionSetting() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        // autoPlay: false,
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      }
    }
  },
  mounted() {

  },
  methods: {

  },
  beforeDestroy() {

  }
};
</script>

<style lang="scss" scoped>
.sn-container {
  position: relative;
  left: 50%;
  top: 110px;
  %table-style {
    width: 100%;
    height: 35px;
    table-layout: fixed;
    tr {
      td {
        padding: 10px 5px;
        text-align: center;
        background-color: transparent;
        white-space: nowrap;
        overflow: hidden;
        color: #e2e5ff;
        font-size: 14px;
      }
    }
  }
  .table {
    .table-header {
      @extend %table-style;
    }
    .seamless-warp {
      height: 400px;
      overflow: hidden;
      visibility: visible;
      .colorRed {
        color: #ff4669;
      }
      .colorOrange {
        color: #ffc956;
      }
      .item {
        height: auto;
        @extend %table-style;
        tr {
          td {
            &.title {
              text-overflow: ellipsis;
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
</style>
