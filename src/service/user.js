import request from '@/utils/request'
import { Permission } from '@/core/decorator/service'
import qs from 'qs'

class SysUserService {
    @Permission('api/v1/user/list')
    list(params) {
        return request({
            url: `/api/v1/user/list?${qs.stringify(params)}`,
            method: 'get',
        })
    }
    @Permission('api/v1/user/list')
    update(data) {
        return request({
            url: '/api/v1/user/list',
            method: 'put',
            data,
        })
    }
    @Permission('api/v1/user/list')
    add(data) {
        return request({
            url: '/api/v1/user/list',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/user/list')
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
    // @Permission('api/v1/user/vlidateUser')
    vlidateUser(username) {
        return request({
            url: '/api/v1/user/validate',
            method: 'post',
            data: {
                username
            }
        })
    }
}
export default SysUserService

