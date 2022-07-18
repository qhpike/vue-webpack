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
    
    {path:'/404',component: () => import('@/views/404')},
    // {path:'*',component: () => import('@/views/404')}
]
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