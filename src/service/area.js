import request from '@/utils/request'

class SysAreaService {
    list() {
        return request({
            url: '/api/v1/area/list',
            method: 'get'
        })
    }
    detail(id) {
        return request({
            url: `/api/v1/area/list/${id}`,
            method: 'get'
        })
    }
    update(data) {
        return request({
            url: '/api/v1/area/list',
            method: 'put',
            data
        })
    }
    delete(id) {
        return request({
            url: `/api/v1/area/list/${id}`,
            method: 'delete',
        })
    }
    create(data) {
        return request({
            url: '/api/v1/area/list',
            method: 'post',
            data
        })
    }
}

export default SysAreaService
