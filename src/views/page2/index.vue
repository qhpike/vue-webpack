<!--
 * @Author: akexian
 * @Date: 2022-06-27
 * @Description: 
-->
<template>
  <div class="page2">
    <el-form>
      <el-form-item>
        <el-input></el-input>
      </el-form-item>
    </el-form>
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