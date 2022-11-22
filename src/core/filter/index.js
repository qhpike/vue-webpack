import { onlyDate } from './filter'


export default {
    install(Vue) {
        Vue.filter('onlyDate',onlyDate)
    }
}