import router from './router'
import {getToken} from './utils/auth'
import store from './store'
import { message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: true }) // NProgress Configuration
const whiteList =['/login']
router.beforeEach((to,from,next)=>{
    const hasToken = getToken()
    const hasRoles = store.getters.roles && store.getters.roles.length
    if(hasToken) {
        console.log(hasToken,'hastoken')
        if(to.path==='/login') {
            next({path:'/'})
        }
        console.log(hasRoles,'ifhasroles')
        if(hasRoles) {
            next()
        } else {
            store.dispatch('user/getInfo').then(accessRoutes=>{
                router.addRoutes(accessRoutes)
                next({ ...to, replace: true })
            })
        }
    } else {
        if(whiteList.includes(to.path)) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})