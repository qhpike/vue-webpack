import router from './router'
import {getToken,removeToken} from './utils/auth'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: true }) // NProgress Configuration
const whiteList =['/login','/404']
router.beforeEach((to,from,next)=>{
    NProgress.start()
    const hasToken = getToken()
    const hasRoles = store.getters.roles && store.getters.roles.length
    if(hasToken) {
        if(to.path==='/login') {
            next({path:'/'})
            NProgress.done()
            Message.warning('请勿重复登录')
        }
        if(hasRoles) {
            next()
        } else {
            store.dispatch('user/getInfo').then(accessRoutes=>{
                accessRoutes.push( {path:'*',component: () => import('@/views/404')})
                router.addRoutes(accessRoutes)
                next({ ...to, replace: true })
            }).catch(error=>{
                Message.error(error || 'Has Error')
                removeToken()
                next(`/login?redirect=${to.path}`)
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
router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})