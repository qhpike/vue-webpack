<!--
 * @Author: akexian
 * @Date: 2022-06-27
 * @Description: 
-->
<template>
  <div class="page1">
   
    <Test> page1</Test>
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
.page1 {
  width:300px;
  height:300px;
  border:1px solid red;
}
</style>