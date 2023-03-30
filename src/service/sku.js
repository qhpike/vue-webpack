/*
 * @Author: akexian
 * @Date: 2022-12-15
 * @Description: 
 */
import request from '@/utils/request'
class SkuService {
    list(data) {
        return request({
            url: `/api/v1/sku/list`,
            method: 'get',
            data
        })
    }
    select(id) {
        return request({
            url: `/api/v1/sku/select/${id}`,
            method: 'get'
        })
    }
    export(data) {
        return request({
            url: `/api/v1/sku/list/export`,
            method: 'get',
            data
        })
    }
    detail(id) {
        return request({
            url: `/api/v1/sku/list/${id}`,
            method: 'get',
        })
    }
    update(id, data) {
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