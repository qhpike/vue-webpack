import Vue from 'vue'
import  VueRouter  from 'vue-router'


Vue.use(VueRouter)

export const constantRoutes = [
    {
        path:'/login',
        component: () => import('@/views/login'),
        hidden: true
    },
    {
        path: '/',
        component: () => import('@/Layout'),
        // redirect: '/dashboard',
        meta:{title:'Dashboard',icon:'dashboard'},
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: 'Dashboard', icon: 'dashboard' }
        },
    ]
    },
   
    
    {path:'/404',component: () => import('@/views/404')},
    // {path:'*',component: () => import('@/views/404')}
]
// 添加页面时，在此处录入路径及对应组件
export const asyncRoutesMap = {
    'views/system/auth/menu/index': () => import('@/views/system/auth/menu'),
    '/system/auth/users': () => import('@/views/system/auth/users'),
    
}
const createRouter = () => new VueRouter({
    mode:'hash',
    routes:constantRoutes
})

const router =  createRouter()

export function resetRouter () {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // the relevant part
  }
export default router