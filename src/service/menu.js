import request from '@/utils/request'
import { Btn } from '@/core/decorator/service'

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
    @Btn('api/v1/menu/update')
    update(data) {
        return request({
            url: '/api/v1/menu/list',
            method: 'put',
            data
        })
    }
    @Btn('api/v1/menu/create')
    create(data) {
        return request({
            url: '/api/v1/menu/list',
            method: 'post',
            data
        })
    }
    @Btn('api/v1/menu/delete')
    delete(id) {
        return request({
            url: `/api/v1/menu/list/${id}`,
            method: 'DELETE',
        })
    }
}
export default SysMenuService
