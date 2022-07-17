<!--
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
-->
<template>
  <div class="box">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    components: {
      Layout: () => import('./views/Layout/index.vue')
    },
    data() {
      return {
        title:'vue-start',
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>
.box {
  height: 100vh;
  width: 100vw;
  font-size: 24px;
}
.img {
  width:200px;
}
</style>