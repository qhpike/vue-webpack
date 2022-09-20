<template>
  <div style="padding:30px;">
    <!-- <router-view /> -->
    <p>日志管理</p>
  </div>
</template>
<script>
export default {
    data() {
        return {
            list: ['hello', 'pike', 'love']
        }
    },
    methods: {
        change() {
            this.$delete(this.list, this.list.length - 1)
        }
    }
}
</script>
