/*
 * @Author: akexian
 * @Date: 2022-12-07
 * @Description: 
 */
import { parseTime } from '@/utils'
import moment from 'moment'
export function userTime(time, option) {
    return parseTime(new Date(time), option)
}
export function sex(value) {
    if (value === 1) {
        return '男'
    } else {
        return '女'
    }
}

export function onlyDate(value) {
    return moment(value).format('yyyy-MM-DD')
}
export function DateTime(value) {
    if (value) {
        return moment(value).format('yyyy-MM-DD HH:mm:ss')
    } else {
        return ''
    }
}
