<!--
 * @Author: akexian
 * @Date: 2022-09-19
 * @Description: 
-->
<template>
    <div class="app-main">
        <transition name="fade-transform" mode="out-in">

        <router-view></router-view>

        </transition>
    </div>
</template>


<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
        }
    }
</script>
<style lang="scss" scoped>
.app-main {
    height: calc(100% - 50px);
     
    width: 100%;
}
    
</style>