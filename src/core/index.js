import Vue from "vue";
import myComponent from './componens/index'
import ServiceRegister from './decorator/service'
import permission from './directive/permission/index'
import filter from './filter/index'
Vue.use(myComponent)
Vue.use(ServiceRegister)
Vue.use(permission)
Vue.use(filter)