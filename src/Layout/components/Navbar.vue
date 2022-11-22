<template>
    <div class="navbar">
      <Hamburger :is-active="sidebar.opened" @toggleClick="toggleSideBar" class="hamburger-container"></Hamburger>


    <!-- <breadcrumb class="breadcrumb-container" />   -->
            <div style="margin-left: auto;margin-top:20px;padding-right:20px;">{{name}}</div>
            <div class="right-menu">
              
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                <video v-if="avatar.split('.')[1] === 'mp4'" :src="baseUrl + avatar" autoplay  class="user-avatar"></video>
                <img v-else :src="baseUrl + avatar" class="user-avatar">
                <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <router-link to="/">
                    <el-dropdown-item>
                    主页
                    </el-dropdown-item>
                </router-link>
                <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
                    <el-dropdown-item>外链</el-dropdown-item>
                </a>
                <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
                    <el-dropdown-item>文档</el-dropdown-item>
                </a>
                <el-dropdown-item divided @click.native="logout">
                    <span style="display:block;">退出</span>
                </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            </div>
 </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        components: {
            Hamburger:()=> import('@/components/Hamburger'),
            breadcrumb: () => import( '@/components/breadcrumb')
        },
        data() {
          return {
            baseUrl: MYURL.CUSTOMER_SERVER,
          }
        },
        computed:{
            ...mapGetters([
            'sidebar',
            'avatar',
            'name',
            ])
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            }
        }
    }
</script>
<style scoped lang="scss">
    .hamburger-container {
    line-height: 46px;
    height: 100%;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

 

  .right-menu {
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>