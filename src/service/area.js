import request from '@/utils/request'
import { Permission } from '@/core/decorator/service'

class SysAreaService {
    @Permission('api/v1/area/list')
    list() {
        return request({
            url: '/api/v1/system/list',
            method: 'get'
        })
    }
    @Permission('api/v1/area/update')
    update(data) {
        return request({
            url: '/api/v1/area/update',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/area/delete')
    delete(id) {
        return request({
            url: '/api/v1/area/delete/',
            method: 'post',
            data: { id }
        })
    }
    @Permission('api/v1/area/add')
    add(data) {
        return request({
            url: '/api/v1/area/add',
            method: 'post',
            data
        })
    }
}

export default SysAreaService
