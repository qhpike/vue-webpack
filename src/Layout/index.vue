<template>
    <div :class="classObj" class="app-wrapper">
      <SideBar class="sidebar-container"></SideBar>
      <AppMain class="main-container"></AppMain>
      <Navbar class="navbar"></Navbar>
    </div>
</template>

<script>
  import { SideBar,Navbar,AppMain } from './components'
    export default {
        components: {
          SideBar,
          Navbar,
          AppMain

        },
        data() {
            return {
                title:'my is layout'
            }
        },
        computed:{
            sidebar() {
            return this.$store.state.app.sidebar
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile'
            }
        }
        },
        mounted() {
        },
        methods: {
            async logout() {
                let answer
                try {
                    answer = await this.$confirm('是否确定退出登录',
                    {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning",
                                        })
                } catch (error) {
                    console.log(error)
                }
                if(answer) {
                    this.$store.dispatch('user/logout').then(res=>{
                    this.$router.push('/login')
                })
                }
            }
        }
    }
</script>

