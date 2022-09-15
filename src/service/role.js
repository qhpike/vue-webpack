import request from '@/utils/request'
import { Permission } from '@/core/decorator/service'
class SysRoleService {
    @Permission('api/v1/role/list')
    list(id) {
        return request({
            url: '/api/v1/role/list',
            method: 'post',
            data: { id }
        })
    }
    @Permission('api/v1/role/update')
    update(data) {
        return request({
            url: '/api/v1/role/update',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/role/add')
    add(data) {
        return request({
            url: '/api/v1/role/add',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/role/delete')
    delete(data) {
        return request({
            url: '/api/v1/role/delete',
            method: 'post',
            data
        })
    }
}
export default SysRoleService

