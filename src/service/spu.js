import request from '@/utils/request'
import { Btn } from '@/core/decorator/service'
import qs from 'qs'
class SpuService {
    list(query) {
        return request({
            url: `/api/v1/spu/list?${qs.stringify({...query})}`,
            method: 'get'
        })
    }
    select() {
        return request({
            url:'/api/v1/spu/select',
            method: 'get'
        })
    }
    detail(id) {
        return request({
            url: `/api/v1/spu/list/${id}`,
            method: 'get',
        })
    }
    update(data) {
        return request({
            url: '/api/v1/spu/list',
            method: 'put',
            data
        })
    }
    create(data) {
        return request({
            url: '/api/v1/spu/list',
            method: 'post',
            data
        })
    }
    delete(id) {
        return request({
            url: `/api/v1/spu/list/${id}`,
            method: 'DELETE',
        })
    }
}
export default SpuService