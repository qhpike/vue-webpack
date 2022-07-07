<!--
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
-->
<template>
  <div class="box">
    {{title}}
    <img src="./assets/image/test.jpg" class="img" alt="">
    <img src="./assets/image/test.jpg" class="img" alt="">
    <Page1></Page1>
    <Page2></Page2>
  </div>
</template>

<script>

  export default {
    components: {
      Page1: () => import('./views/page1/index.vue'),
      Page2: () => import('@/views/page2/index.vue')
    },
    data() {
      return {
        title:'vue-start',
      }
    },
    mounted() {
     console.log(MYURL,'window')
    }
  }
</script>

<style lang="scss" scoped>
.box {
  font-size: 24px;
}
.img {
  width:200px;
}
</style>