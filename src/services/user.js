/*
 * @Author: akexian
 * @Date: 2022-07-18
 * @Description: 
 */

import instance  from "../utils/request";
export function login(data) {
    return instance({
        url:'/api/v1/auth/login',
        method:'post',
        data
    })
}

export function logout() {
    return instance({
        url: '/api/v1/sys/logout',
        method: 'post'
    })
}

export function getMenu() {
    return instance({
        url:'/api/v1/system/info',
        method:'get'
    })
}

