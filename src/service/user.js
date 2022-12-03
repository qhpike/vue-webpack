import request from '@/utils/request'
import { Btn } from '@/core/decorator/service'
import qs from 'qs'

class SysUserService {
    list(params) {
        return request({
            url: `/api/v1/user/list?${qs.stringify(params)}`,
            method: 'get',
        })
    }
    @Btn('api/v1/user/update')
    update(data) {
        return request({
            url: '/api/v1/user/list',
            method: 'put',
            data,
        })
    }
    @Btn('api/v1/user/create')
    add(data) {
        return request({
            url: '/api/v1/user/list',
            method: 'post',
            data
        })
    }
    @Btn('api/v1/user/delete')
    delete(id) {
        return request({
            url: `/api/v1/user/list/${id}`,
            method: 'delete',
        })
    }
    detail(id) {
        return request({
            url: `/api/v1/user/list/${id}`,
            method: 'get',
        })
    }
    vlidateUser(username) {
        return request({
            url: '/api/v1/user/validate',
            method: 'post',
            data: {
                username
            }
        })
    }
    multiple(data) {
        return request({
            url: '/api/v1/user/multiple',
            method: 'post',
            data,
        })
    }
}
export default SysUserService

