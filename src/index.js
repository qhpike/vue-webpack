/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
// import 'amfe-flexible'
import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import ElementUI  from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import ServiceRegister from './core/decorator/service'
import './routerHook'
import './icons'
Vue.use(ElementUI, { size: 'mini', zIndex: 3000 })
Vue.use(ServiceRegister)
Vue.config.productionTip = false
new Vue({
  el:'#app',
  router,
  store,
  render:h=>h(App)
})