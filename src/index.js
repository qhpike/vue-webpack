/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
import 'amfe-flexible'
import 'normalize.css/normalize.css'
import './styles/common.scss'
<<<<<<< HEAD
import ElementUI from 'element-ui'
=======
import ElementUI  from 'element-ui'
>>>>>>> 85d5eb68505e0028ed21cb26d2d21ef26dc7b007
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App.vue'
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  el:'#app',
  render:h=>h(App)
})