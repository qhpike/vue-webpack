/*
 * @Author: akexian
 * @Date: 2022-09-15
 * @Description: 
 */
import request from '@/utils/request'
class SysRoleService {
    list(params) {
        return request({
            url: `/api/v1/role/list`,
            method: 'get',
        })
    }
    detail(id) {
        return request({
            url: `/api/v1/role/list/${id}`,
            method: 'get'
        })
    }
    saveMenu(data, id) {
        return request({
            url: `/api/v1/menu/saveRoleMenu/${id}`,
            method: 'post',
            data
        })
    }
    update(data) {
        return request({
            url: '/api/v1/role/list',
            method: 'put',
            data
        })
    }
    create(data) {
        return request({
            url: '/api/v1/role/list',
            method: 'post',
            data
        })
    }
    delete(id) {
        return request({
            url: `/api/v1/role/list/${id}`,
            method: 'delete',
        })
    }
}
export default SysRoleService

