import {setToken,getToken,removeToken } from '@/utils/auth.js'
import { formatRouterTree,toRouter } from '@/utils/routerHook.js'
import { login,getMenu } from '@/services/user'
import { constantRoutes } from '@/router'
const state = {
    token:getToken(),
    name: '',
    avatar: '',
    roles: [],
    perms: [],
    routes:[]
}

const mutations = {
    SET_TOKEN: (state,token)=>{
        state.token = token
    },
    SET_RULES: (state,rules) => {
        state.rules = rules
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AREAID: (state, areaid) => {
        state.areaid = areaid
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        console.log(roles,'=>rolse')
        state.roles = roles
    },
    SET_PERMS: (state, perms) => {
        state.perms = perms
    },
    SET_ROUTES: (state,routes) => {
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    login({ commit },userInfo) {
        return new Promise((resolve,reject)=>{
            login(userInfo).then(res=>{
                const {code,token} = res
                if(code===200) {
                    commit('SET_TOKEN',token)
                    setToken(token)
                }
                resolve(res)
            }).catch(error=>{
                reject(error)
            })
        })

    },
        // get user info
        getInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getMenu().then(response => {
                    const { data } = response
                    if (!data) {
                        reject('Verification failed, please Login again.')
                    }
    
                    const { name, avatar, areaid } = data
                    // 取回的权限数组转为树型
                    const _perms = JSON.parse(JSON.stringify(data.roles))
                    const perms = _perms.filter(item => item.type === 2).map(menu => {
                        return menu.perms
                    })
                    const permsString = perms.toString()
                    const roles = formatRouterTree(data.roles)
                    const acccessRoutes = toRouter(roles)
                    // roles must be a non-empty array
                    if (!roles || roles.length <= 0) {
                        reject('菜单权限不能为空!')
                    }
    
                    commit('SET_ROLES', roles)
                    commit('SET_PERMS', permsString)
                    commit('SET_NAME', name)
                    commit('SET_AREAID', areaid)
                    commit('SET_AVATAR', avatar)
                    commit('SET_ROUTES',acccessRoutes)
                    resolve(acccessRoutes)
                }).catch(error => {
                    reject(error)
                })
            })
        },
}


export default {
    namespaced:true,
    state,
    mutations,
    actions
}