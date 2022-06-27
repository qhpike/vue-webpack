<!--
 * @Author: akexian
 * @Date: 2022-06-27
 * @Description: 
-->
<template>
  <div>
    <img src="@/assets/image/test.jpg" alt="">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    title:'test'
  }
</script>

<style lang="scss" scoped>
  img {
    display:inline-block;
    width:200px;
    float:left;
  }
</style>