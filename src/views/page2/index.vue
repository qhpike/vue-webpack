<!--
 * @Author: akexian
 * @Date: 2022-06-27
 * @Description: 
-->
<template>
  <div class="page2">
    <Test>page2</Test>
  </div>
</template>

<script>
  export default {
    components:{
      Test:()=> import('@/components/Test.vue')
    }
    
  }
</script>

<style lang="scss" scoped>
.page2 {
  width:300px;
  height:300px;
  border:1px solid red;
}
</style>