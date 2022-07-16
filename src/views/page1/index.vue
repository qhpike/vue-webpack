<!--
 * @Author: akexian
 * @Date: 2022-06-27
 * @Description: 
-->
<template>
  <div class="page1">
   
    <Test> page1</Test>
    <router-link :to="{ path: '/page', params: { userId: 123 }}">User</router-link>
  </div>
</template>

<script>
  export default {
    components:{
      Test:()=> import('@/components/Test.vue')
    },
    async mounted() {
    },
    methods: {
      goPage() {
        this.$router.push({path:'/page',query:{size:'small'}})
      }
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