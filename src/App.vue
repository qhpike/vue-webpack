<!--
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
-->
<template>
  <div class="box">
    {{title}}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title:'vue-start'
      }
    },
    mounted() {
     console.log(URL.BASE_SERVER,'window')
    }
  }
</script>

<style lang="scss" scoped>
.box {
  font-size: 24px;
}
</style>