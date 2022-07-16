import Vue from 'vue'
import  VueRouter  from 'vue-router'


Vue.use(VueRouter)

const routes = [
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
        children: [{
            path: '/test',
            component: () => import('@/views/page2'),
        }]
    },
    
    {path:'/404',component: () => import('@/views/404')},
    {path:'*',component: () => import('@/views/404')}
]
const route = new VueRouter({
    mode:'hash',
    routes
})
export default route