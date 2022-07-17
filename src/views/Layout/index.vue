<template>
    <div>
        {{title}}
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                title:'my is layout'
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>

</style>