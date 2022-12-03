import request from '@/utils/request'
import { Btn } from '@/core/decorator/service'
import qs from 'qs'
class ProductMenuService {
    list(query) {
        return request({
            url: `/api/v1/category/list?${qs.stringify({...query})}`,
            method: 'get'
        })
    }
    detail(id) {
        return request({
            url: `/api/v1/category/list/${id}`,
            method: 'get',
        })
    }
    update(data) {
        return request({
            url: '/api/v1/category/list',
            method: 'put',
            data
        })
    }
    @Btn('api/v1/category/create')
    create(data) {
        return request({
            url: '/api/v1/category/list',
            method: 'post',
            data
        })
    }
    @Btn('api/v1/category/delete')
    delete(id) {
        return request({
            url: `/api/v1/category/list/${id}`,
            method: 'DELETE',
        })
    }
}
export default ProductMenuService