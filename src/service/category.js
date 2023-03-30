import request from '@/utils/request'
class ProductMenuService {
    list(data) {
        return request({
            url: `/api/v1/category/list`,
            method: 'get',
            data
        })
    }
    listAll() {
        return request({
            url: `/api/v1/category/listAll`,
            method: 'get'
        })
    }
    select() {
        return request({
            url: '/api/v1/category/select',
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
    create(data) {
        return request({
            url: '/api/v1/category/list',
            method: 'post',
            data
        })
    }
    delete(id) {
        return request({
            url: `/api/v1/category/list/${id}`,
            method: 'DELETE',
        })
    }
}
export default ProductMenuService