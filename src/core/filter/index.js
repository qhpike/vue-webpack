/*
 * @Author: akexian
 * @Date: 2022-09-15
 * @Description: 
 */
import { onlyDate, DateTime } from './filter'


export default {
    install(Vue) {
        Vue.filter('onlyDate', onlyDate)
        Vue.filter('DateTime', DateTime)
    }
}