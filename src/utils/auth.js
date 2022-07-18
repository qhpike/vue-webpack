import Cookies from "js-cookie";
const Tokenkey ='cqbegin'

export function getToken() {
    return Cookies.get(Tokenkey)
}

export function setToken(token) {
    Cookies.set(Tokenkey,token)
}

export function removeToken() {
    return Cookies.remove(Tokenkey)
}