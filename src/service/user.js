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
    @Permission('api/v1/user/update')
    update(data) {
        return request({
            url: '/api/v1/user/update',
            method: 'post',
            data,
        })
    }
    @Permission('api/v1/user/add')
    add(data) {
        return request({
            url: '/api/v1/user/add',
            method: 'post',
            data
        })
    }
    @Permission('api/v1/user/delete')
    delete(data) {
        return request({
            url: '/api/v1/user/delete',
            method: 'post',
            data
        })
    }
    // @Permission('api/v1/user/vlidateUser')
    vlidateUser(username) {
        return request({
            url: '/api/v1/user/vlidateUser',
            method: 'post',
            data: {
                username
            }
        })
    }
}
export default SysUserService

