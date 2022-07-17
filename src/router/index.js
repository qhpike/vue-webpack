import Vue from 'vue'
import  VueRouter  from 'vue-router'


Vue.use(VueRouter)

export const constantRoutes = [
    {
        path:'/login',
        component: () => import('@/views/login')  
    },
    {
        path:'/page',
        component: () => import('@/views/page1')
    },
    {
        path: '/',
        component: () => import('@/views/Layout'),
    },
    
    // {path:'/404',component: () => import('@/views/404')},
    {path:'*',component: () => import('@/views/404')}
]
const router = new VueRouter({
    mode:'hash',
    routes:constantRoutes
})
export default router