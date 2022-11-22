import request from '@/utils/request'
import { Btn } from '@/core/decorator/service'

class WorkerService {
    imgUpload(data) {
        return request({
            url: `/api/v1/worker/imgUpload`,
            method: 'post',
            data
        })
    }
    @Btn('api/v1/worker/create')
    workerAdd(data) {
        return request({
            url: '/api/v1/worker/workerAdd',
            method: 'post',
            data
        })
    }
    validateCardId(data) {
        return request({
            url: '/api/v1/worker/validateCardId',
            method: 'post',
            data
        })
    }
    validatePhone(data) {
        return request({
            url: '/api/v1/worker/validatePhone',
            method: 'post',
            data
        })
    }
    list(data) {
        return request({
            url: '/api/v1/worker/list',
            method: 'post',
            data
        })
    }
    @Btn('api/v1/worker/delete')
    delete(data) {
        return request({
            url: '/api/v1/worker/delete',
            method: 'post',
            data
        })
    }
    detail(data) {
        return request({
            url: '/api/v1/worker/detail',
            method: 'post',
            data
        })
    }
    @Btn('api/v1/worker/update')
    edit(data) {
        return request({
            url: '/api/v1/worker/edit',
            method: 'post',
            data
        })
    }
}
export default WorkerService

