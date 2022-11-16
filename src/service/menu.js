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
            url: `/api/v1/menu/list/${id}`,
            method: 'get',
        })
    }
    @Permission('api/v1/menu/list')
    update(data) {
        return request({
            url: '/api/v1/menu/list',
            method: 'put',
            data
        })
    }
    @Permission('api/v1/menu/add')
    add(data) {
        return request({
            url: '/api/v1/menu/list',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/menu/list')
    delete(id) {
        return request({
            url: `/api/v1/menu/list/${id}`,
            method: 'DELETE',
        })
    }
}
export default SysMenuService
