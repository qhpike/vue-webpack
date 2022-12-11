import ElModal from '@/components/ElModal'
export default {
    install(Vue) {
        Vue.component('el-modal',()=> import('@/components/ElModal'))
        Vue.component('date-range',()=> import('@/components/DateRange'))
    }
}