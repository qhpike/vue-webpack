import request from '@/utils/request'
import { Btn } from '@/core/decorator/service'
class SysRoleService {
    list(id) {
        return request({
            url: '/api/v1/role/list',
            method: 'post',
            data: { id }
        })
    }
    @Btn('api/v1/role/update')
    update(data) {
        return request({
            url: '/api/v1/role/update',
            method: 'post',
            data
        })
    }
    @Btn('api/v1/role/create')
    add(data) {
        return request({
            url: '/api/v1/role/add',
            method: 'post',
            data
        })
    }
    @Btn('api/v1/role/delete')
    delete(data) {
        return request({
            url: '/api/v1/role/delete',
            method: 'post',
            data
        })
    }
}
export default SysRoleService

