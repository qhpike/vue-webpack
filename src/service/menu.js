import request from '@/utils/request'
import { Permission } from '@/core/decorator/service'

class SysMenuService {
    @Permission('api/v1/menu/list')
    list() {
        return request({
            url: '/api/v1/menu/list',
            method: 'get'
        })
    }
    // @Permission('api/v1/menu/info')
    info(id) {
        return request({
            url: '/api/v1/menu/info',
            method: 'get',
            params: { id }
        })
    }
    @Permission('api/v1/menu/update')
    update(data) {
        return request({
            url: '/api/v1/menu/update',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/menu/add')
    add(data) {
        return request({
            url: '/api/v1/menu/add',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/menu/delete')
    delete(id) {
        return request({
            url: `/api/v1/menu/delete`,
            method: 'post',
            data: { id }
        })
    }
}
export default SysMenuService
