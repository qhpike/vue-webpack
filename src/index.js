/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
import 'amfe-flexible'
import 'normalize.css/normalize.css'
import './styles/common.scss'
import ElementUI  from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App.vue'
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  el:'#app',
  render:h=>h(App)
})
