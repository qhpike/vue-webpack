<template>
    <div>
      <SideBar class="side-bar"></SideBar>
      <AppMain></AppMain>
      <Navbar></Navbar>
        <!-- <el-container style="height: 100vh; border: 1px solid #eee">
           

            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
              <el-menu :default-openeds="['1', '3']">
                <el-submenu index="1">
                  <template slot="title"><i class="el-icon-message"></i>导航一</template>
                  <el-menu-item-group>
                    <template slot="title">分组一</template>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                  </el-menu-item-group>
                  <el-submenu index="1-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="1-4-1">选项4-1</el-menu-item>
                  </el-submenu>
                </el-submenu>
              </el-menu>
            </el-aside>
            <el-container>
                <el-header style="text-align: right; font-size: 12px">
                    <el-dropdown >
                      <i class="el-icon-setting" style="margin-right: 15px"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>查看</el-dropdown-item>
                        <el-dropdown-item>新增</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">
                            <span style="display:block;">退出</span>
                          </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <span @click="logout">{{$store.getters.name}}</span>
                  </el-header>

                  <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>

            
        </el-container> -->
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
                console.log('dnegludd')
                if(answer) {
                    this.$store.dispatch('user/logout').then(res=>{
                    this.$router.push('/login')
                })
                }
            }
        }
    }
</script>

<style>
        :root {
    --main-side-width:200px;
    --main-side-back:#808080;
}
</style>

<style lang="scss">

      .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
</style>