import { parseTime } from '@/utils'

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
