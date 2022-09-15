import request from '@/utils/request'
import { Permission } from '@/core/decorator/service'

class WorkerService {
    // @Permission('api/v1/worker/imgUpload')
    imgUpload(data) {
        return request({
            url: `/api/v1/worker/imgUpload`,
            method: 'post',
            data
        })
    }
    @Permission('api/v1/worker/workerAdd')
    workerAdd(data) {
        return request({
            url: '/api/v1/worker/workerAdd',
            method: 'post',
            data
        })
    }
    // @Permission('api/v1/worker/validateCardId')
    validateCardId(data) {
        return request({
            url: '/api/v1/worker/validateCardId',
            method: 'post',
            data
        })
    }
    // @Permission('api/v1/worker/validatePhone')
    validatePhone(data) {
        return request({
            url: '/api/v1/worker/validatePhone',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/worker/list')
    list(data) {
        return request({
            url: '/api/v1/worker/list',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/worker/delete')
    delete(data) {
        return request({
            url: '/api/v1/worker/delete',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/worker/detail')
    detail(data) {
        return request({
            url: '/api/v1/worker/detail',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/worker/edit')
    edit(data) {
        return request({
            url: '/api/v1/worker/edit',
            method: 'post',
            data
        })
    }
}
export default WorkerService

