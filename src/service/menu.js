/*
 * @Author: akexian
 * @Date: 2022-09-15
 * @Description: 
 */
import request from '@/utils/request'

class SysMenuService {
    list() {
        return request({
            url: '/api/v1/menu/list',
            method: 'get'
        })
    }
    findOne(id) {
        return request({
            url: `/api/v1/menu/findOne/${id}`,
            method: 'get'
        })
    }

    info(id) {
        return request({
            url: `/api/v1/menu/list/${id}`,
            method: 'get',
        })
    }
    update(data) {
        return request({
            url: '/api/v1/menu/list',
            method: 'put',
            data
        })
    }
    create(data) {
        return request({
            url: '/api/v1/menu/list',
            method: 'post',
            data
        })
    }
    delete(id) {
        return request({
            url: `/api/v1/menu/list/${id}`,
            method: 'DELETE',
        })
    }
}
export default SysMenuService
