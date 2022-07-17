<!--
 * @Author: akexian
 * @Date: 2022-06-27
 * @Description: 
-->
<template>
  <div class="page2">
    <div>{{msg}}</div>
    <el-form class="form">
      <el-form-item >
        <el-input v-model="msg"></el-input>
      </el-form-item>
      <el-button @click="reverse" type="primary" class="btn">鏡湖月</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    name:'mypage',
    components:{
      Test:()=> import('@/components/Test.vue')
    },
    data() {
      return {
        msg:'我欲因之夢吳越，一夜飛度鏡湖月!'
      }
    },
    mounted() {
    },
    methods: {
      reverse() {
        this.msg = this.msg.split('').reverse().join('')
      }
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