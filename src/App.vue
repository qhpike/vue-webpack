<!--
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
-->
<template>
  <div class="box">
    {{title}}
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
     console.log(MYURL.BASE_SERVER,'window')
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