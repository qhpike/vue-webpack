<template>
    <div class="app-main">appmain-page
        <el-button @click="toggleSideBar">切换</el-button>
    </div>
</template>


<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            toggleSideBar() {
                const el = document.documentElement
                const style = getComputedStyle(el)
                const width = style.getPropertyValue('--main-side-width')
                console.log(style.getPropertyValue('--main-side-width'),'style..')
                document.body.style.setProperty('--main-side-width',width/2)
            }
        }
    }
</script>
<style scoped>
.app-main {
    position: fixed;
    top: 50px;
    left: var(--main-side-width);
    background: greenyellow;
    border: 1px solid salmon;
    height: 100vh;
    width: 100vw;
    padding: 20px;
    box-sizing: border-box;
}
</style>