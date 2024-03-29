/*
 * @Author: akexian
 * @Date: 2022-07-18
 * @Description: 
 */
export function formatRouterTree(list, myid = 0) {
    // 遍历整个列表
    return list.filter(cur => {
    // 获取当前节点的子节点
        const children = list.filter(item => item.parentId === cur.id)
        if (children.length > 0) {
            cur.children = children
        }
        // 只返回顶级节点
        return cur.parentId === myid
    })
}
// 只有路由数据,过滤type为2的菜单权限
export function toRouter(userRouters) {
    const newRouters = userRouters.filter(item => item.type === 1).map((r) => {
        let routes
        if (r.parentId === 0) {
            routes = {
                path: r.router,
                name: r.name,
                redirect: r.redirect,
                meta: { title: r.title, icon: r.icon },
                component: () => import('@/Layout')
            }
        } else {
            routes = {
                path: r.router,
                name: r.name,
                redirect: r.redirect,
                hidden: r.hidden,
                meta: { title: r.title, icon: r.icon },
                component: () => import(`@/views${r.viewPath}/index.vue`)
            }
        }

        if (r.children) {
            routes.children = toRouter(r.children)
        }
        return routes
        
    })
    newRouters.push({ path: '*', redirect: '/404', hidden: true })
    return newRouters
}