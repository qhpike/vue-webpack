import request from '@/utils/request'
import { Btn } from '@/core/decorator/service'
class SysRoleService {
    list(id) {
        return request({
            url: '/api/v1/role/list',
            method: 'get',
        })
    }
    detail(id) {
        return request({
            url: `/api/v1/role/list/${id}`,
            method: 'get'
        })
    }
    @Btn('api/v1/role/update')
    update(data) {
        return request({
            url: '/api/v1/role/list',
            method: 'put',
            data
        })
    }
    @Btn('api/v1/role/create')
    create(data) {
        return request({
            url: '/api/v1/role/list',
            method: 'post',
            data
        })
    }
    @Btn('api/v1/role/delete')
    delete(id) {
        return request({
            url: `/api/v1/role/list/${id}`,
            method: 'delete',
        })
    }
}
export default SysRoleService

