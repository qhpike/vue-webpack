import {setToken,getToken,removeToken } from '@/utils/auth.js'
import { formatRouterTree,toRouter } from '@/utils/routerHook.js'
import { login,getMenu,logout } from '@/services/user'
import { constantRoutes,resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token:getToken(),
        name: '',
        avatar: '',
        roles: [],
        perms: [],
        routes:[],
        areaId: 0,
        isRoot:0,
    }
}
const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state,token)=>{
        state.token = token
    },
    SET_RULES: (state,rules) => {
        state.rules = rules
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AREAID: (state, areaId) => {
        state.areaId = areaId
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ISROOT: (state, isRoot) => {
        state.isRoot = isRoot
    },
    SET_ROLES: (state, roles) => {
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
                const {code,data} = res
                if(code===200) {
                    commit('SET_TOKEN',data)
                    setToken(data)
                }
                resolve(res)
            }).catch(error=>{
                reject(error)
            })
        })

    },
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                commit('SET_TOKEN', '')
                commit('SET_PERMS', [])
                resolve()
        })
    },
    resetToken({ commit, state }) {
        return new Promise((resolve, reject) => {
            removeToken() // must remove  token  first
            resetRouter()
            commit('RESET_STATE')
            commit('SET_TOKEN', '')
            commit('SET_PERMS', [])
            resolve()
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
    
                    const { name, avatar, areaId, isRoot } = data
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
                    commit('SET_AREAID', areaId)
                    commit('SET_AVATAR', avatar)
                    commit('SET_ISROOT', isRoot)
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