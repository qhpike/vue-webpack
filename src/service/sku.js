import request from '@/utils/request'
import { Btn } from '@/core/decorator/service'
import qs from 'qs'
class SkuService {
    list(query) {
        return request({
            url: `/api/v1/sku/list?${qs.stringify({...query})}`,
            method: 'get'
        })
    }
    detail(id) {
        return request({
            url: `/api/v1/sku/list/${id}`,
            method: 'get',
        })
    }
    update(id,data) {
        return request({
            url: `/api/v1/sku/list/${id}`,
            method: 'put',
            data
        })
    }
    create(data) {
        return request({
            url: '/api/v1/sku/list',
            method: 'post',
            data
        })
    }
    delete(id) {
        return request({
            url: `/api/v1/sku/list/${id}`,
            method: 'DELETE',
        })
    }
}
export default SkuService