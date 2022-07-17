
import instance  from "../utils/request";
export function login(data) {
    return instance({
        url:'/api/v1/sys/login',
        method:'post',
        data
    })
}

export function getMenu() {
    return instance({
        url:'/api/v1/sys/info',
        method:'get'
    })
}