/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
import 'amfe-flexible'
import 'normalize.css/normalize.css'
import './styles/common.scss'

import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = true
new Vue({
  el:'#app',
  render:h=>h(App)
})
