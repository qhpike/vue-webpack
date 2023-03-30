import request from '@/utils/request'
class SpuService {
    list(data) {
        return request({
            url: `/api/v1/spu/list`,
            method: 'get',
            data
        })
    }
    select() {
        return request({
            url: '/api/v1/spu/select',
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