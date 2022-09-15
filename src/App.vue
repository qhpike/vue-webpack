<!--
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
-->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title:'vue-start',
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
.box {
  height: 100vh;
  width: 100vw;
  font-size: 24px;
}
.img {
  width:200px;
}
</style>