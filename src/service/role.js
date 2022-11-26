import request from '@/utils/request'
import { Btn } from '@/core/decorator/service'
import qs from 'qs'
class SysRoleService {
    list(params) {
        return request({
            url: `/api/v1/role/list?${qs.stringify({...params})}`,
            method: 'get',
        })
    }
    detail(id) {
        return request({
            url: `/api/v1/role/list/${id}`,
            method: 'get'
        })
    }
    @Btn('api/v1/role/menu')
    saveMenu(data,id) {
        return request({
            url: `/api/v1/menu/saveRoleMenu/${id}`,
            method: 'post',
            data
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

