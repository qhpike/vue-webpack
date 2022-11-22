import request from '@/utils/request'
import { Btn } from '@/core/decorator/service'

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
    @Btn('api/v1/area/update')
    update(data) {
        return request({
            url: '/api/v1/area/list',
            method: 'put',
            data
        })
    }
    @Btn('api/v1/area/delete')
    delete(id) {
        return request({
            url: `/api/v1/area/list/${id}`,
            method: 'delete',
        })
    }
    @Btn('api/v1/area/create')
    create(data) {
        return request({
            url: '/api/v1/area/list',
            method: 'post',
            data
        })
    }
}

export default SysAreaService
