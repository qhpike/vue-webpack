<template>
    <div>
        <img src="@/assets/image/bg.png" alt="" class="wave">
    <div class="container">
        <div class="img">
            <img src="@/assets/image/art.svg" alt="">
        </div>
        <div class="login-box">
            <form action="">
                <img src="@/assets/image/avatar2.svg" alt="" class="avatar">
                <h2>登录</h2>
                <div class="input-group" :class="{'focus':input1}">
                    <div class="icon">
                        <i class="fa fa-user"></i>
                    </div>
                    <div>
                        <h5>账号</h5>
                        <input type="text" v-model="username" @focus="input1=true" @blur="input1=username ? true:false"  class="input" >
                    </div>
                </div>
                <div class="input-group" :class="{'focus':input2}">
                    <div class="icon">
                        <i class="fa fa-lock"></i>
                    </div>
                    <div>
                        <h5>密码</h5>
                        <input type="password" v-model="password" @focus="input2=true" @blur="input2= password ? true:false" class="input" >
                    </div>
                </div>
               
                <!-- <a href="#">忘记密码</a> -->
                <input type="submit" class="btn" @click="login" value="Login">
            </form>
        </div>
    </div>
    <!-- <a href="https://www.cqbegin.com" target="_blank" class="copyright">&copy; Ramostear</a> -->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                username:'',
                password:'',
                redirect:undefined,
                input1:false,
                input2:false,
            }
        },
        watch: {
            $route: {
                handler(route) {
                    this.redirect = route.query && route.query.redirect
                },
                immediate:true,
            }
        },
        mounted() {
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
            },
            userBlur() {
                console.log('userblur')
                this.input1 =true
            },
            userBlur2() {
                console.log('userblur')
                this.input2 = true
            }
        },
        mounted() {
        }
    }
</script>
<style lang="scss" scoped>
    .wave{
    position: fixed;
    height: 100%;
    left: 0;
    bottom: 0;
    z-index: -1;
}
.container{
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 288PX 1fr;
    padding: 0 32PX;
}
.img{
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.img img{
    /* margin-top: -100PX; */
    width: 500PX;
    
}

.login-box{
    grid-column: 3 / 4;
    display: flex;
    align-items: center;
    text-align: center;
}
form{
    width: 360PX;
}
.avatar{
    width: 100PX;
}
form h2{
    font-size: 46PX;
    text-transform: uppercase;
    margin: 15PX 0;
    color: #999;
}

.input-group{
    position: relative;
    display: grid;
    grid-template-columns: 7% 93%;
    margin: 25PX 0;
    padding: 5PX 0;
    border-bottom: 2PX solid #d9d9d9;
}

.input-group:nth-child(1){
    margin-bottom: 4PX;
}
.input-group:before,.input-group:after{
    content: '';
    position: absolute;
    bottom: -2PX;
    width: 0;
    height: 2PX;
    background-color: #38d39f;
    transition: .5s;
}
.input-group:after{
    right: 50%;
}
.input-group:before{
    left: 50%;
}
.icon{
    display: flex;
    justify-content: center;
    align-items: center;
}
.icon i{
    color: #d9d9d9;
    transition: .5s;
}

.input-group > div{
    position: relative;
    height: 45PX;
}

.input-group >div > h5{
    position: absolute;
    left: 10PX;
    top: -10%;
    transform: translateY(-50%);
    color: #d9d9d9;
    font-size: 18PX;
    transition: .3s;
}
.input-group.focus .icon i{
    color: #38d39f;
}
.input-group.focus div h5{
    top: -25PX;
    font-size: 15PX;
}
.input-group.focus:after,.input-group.focus:before{
    width: 50%;
}
.input{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: none;
    outline: none;
    background: none;
    padding: 8PX 11PX;
    font-size: 18PX;
    color: #555;
    font-family: 'Roboto', sans-serif;
}
a{
    display: block;
    text-align: right;
    text-decoration: none;
    color: #999;
    font-size: 14PX;
    transition: .3s;
}
a:hover{
    color: #38d39f;
}
.btn{
    display: block;
    width: 100%;
    height: 50PX;
    border-radius: 25PX;
    margin: 16PX 0;
    font-size: 18PX;
    outline: none;
    border: none;
    background-image: linear-gradient(to right,#32be8f,#38d39f,#32be8f);
    cursor: pointer;
    color: #fff;
    text-transform: uppercase;
    font-family: 'Roboto', sans-serif;
    background-size: 200%;
    transition: .5s;
}
.btn:hover{
    background-position: right;
}
.copyright{
    position: absolute;
    width: 100%;
    height: 50PX;
    bottom: 2PX;
    color: #38d39f;
    text-align: center;
    font-size: 18PX;
    font-family: 'Roboto', sans-serif;
}

/*媒体查询*/
@media screen and (max-width: 1080PX) {
    .container{
        grid-gap: 144PX;
    }
}
@media screen and (max-width: 1024PX) {
    form{
        width: 290PX;
    }
    form h2{
        font-size: 38PX;
        margin: 8PX 0;
    }
    .img img{
        width: 360PX;
    }
}
@media screen and (max-width: 768PX) {
    .wave{
        display: none;
    }
    .img{
        display: none;
    }
    .container{
        display: flex;
        justify-content: center;
        grid-template-columns: 1fr;
    }
    .login-box{
        justify-content: center;
    }
}

</style>