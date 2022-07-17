<template>
    <div class="login-page">
       <div class="login-box">
        <el-form class="login-form"  label-position="left" label-width="120px">
            <el-form-item label="用户名:" >
                <el-input v-model="username" ></el-input>
            </el-form-item>
            <el-form-item label="密码:" >
                <el-input v-model="password" type="password"></el-input>
            </el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form>
       </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                username:'',
                password:'',
            }
        },
        methods: {
            resetForm() {
                this.username = '';
                this.password = '';
            },
            async login() {
                this.$store.dispatch('user/login',{
                    username:this.username,
                    password:this.password
                }).then(res=>{
                    if(res.code===200) {
                        this.$message.success('登录成功')
                        this.$router.push({ path: this.redirect || '/' })
                    } else {
                        this.$message.error(res.message)
                    }
                    
                }).catch(error=>{
                    console.log(error,'error')
                })
            }
        },
        mounted() {
        }
    }
</script>
<style lang="scss" scoped>
    .login-page {
        height: 100vh;
        width: 100%;
        border: 1px slid greenyellow;
        background: #283443;
        overflow: hidden;
        display: flex;
        
    }
    .login-box {
        width: 520px;
        background: #faf8f8;
        margin: auto;
        border-radius: 5px;
    }
    .login-form {
        /* display: flex; */
        /* justify-content: center; */
        /* align-items: center; */
        padding: 80px 40px;
        text-align: center;
    }
    
</style>