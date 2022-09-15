import { deepClone } from './index'

export function flatPerms(obj2) {
    const obj = deepClone(obj2)
    let list = []
    Object.keys(obj).forEach(item => {
        const { permission } = obj[item]
        if (permission) {
            list = list.concat(Object.values(permission))
        } else {
            const tmp = flatPerms(obj[item])
            if (tmp && tmp.length > 0) {
                list = list.concat(tmp)
            }
        }
    })
    return list
}

/**
   * 处理权限
   */
export function filterPerms(index, arr, op) {
    const key = arr[index]
    const i = op.findIndex(e => {
        return e.label === key
    })
    if (i >= 0) {
        // 存在则继续遍历
        filterPerms(index + 1, arr, op[i].children)
    } else {
        const isLast = index === arr.length - 1 // 是否为最后一个
        const value = {
            value: key,
            label: key,
            children: isLast ? null : []
        }
        op.push(value)
        if (!isLast) {
            filterPerms(index + 1, arr, op[op.length - 1].children || [])
        }
    }
}

// function formatRouterTree(data) {
//   const parents = data.filter(p => p.pid === 0)
//   const children = data.filter(c => c.pid !== 0)

//   dataToTree(parents, children)
//   function dataToTree(parents, children) {
//     parents.map((p) => {
//       children.map((c, i) => {
//         if (c.pid == p.id) {
//           const _c = JSON.parse(JSON.stringify(children))
//           _c.splice(i, 1)
//           // console.log(JSON.parse(JSON.stringify(c)));
//           if (p.children) {
//             p.children.push(c)
//           } else {
//             p.children = [c]
//           }
//           dataToTree([c], _c)
//         }
//       })
//     })
//   }
//   console.log(parents)
//   return parents
// }

export function formatRouterTree(list, myid = 0) {
    // 遍历整个列表
    return list.filter(cur => {
    // 获取当前节点的子节点
        const children = list.filter(item => item.parent_id === cur.id)
        if (children.length > 0) {
            cur.children = children
        }
        // 只返回顶级节点
        return cur.parent_id === myid
    })
}
// 只有路由数据,过滤type为2的菜单权限
export function toRouter(userRouters) {
    console.log(userRouters,'让你的')
    const newRouters = userRouters.filter(item => item.type === 1).map((r) => {
        let routes
        if (r.parent_id === 0) {
            routes = {
                path: r.router,
                name: r.name,
                redirect: r.redirect,
                meta: { title: r.title, icon: r.icon },
                component: () => import('@/views/Layout')
                // component: (resolve) => require([`@/views${r.cpath}/index.vue`], resolve)
            }
        } else {
            routes = {
                path: r.router,
                name: r.name,
                redirect: r.redirect,
                hidden: r.hidden,
                meta: { title: r.title, icon: r.icon },
                component: () => import(`@/views${r.view_path}/index.vue`)
                // 错误原因是老外修改了webpack打包逻辑,此处改为require
                // component: (resolve) => require([`@/views${r.view_path}/index.vue`], resolve)
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

export function toarea(userarea) {
    const newarea = userarea.map((r) => {
        const routes = {
            id: r.id,
            name: r.name,
            create_time: r.create_time,
            update_time: r.update_time
        }
        if (r.children) {
            routes.children = toarea(r.children)
        }
        return routes
    })

    return newarea
}
