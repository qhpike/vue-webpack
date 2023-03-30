import request from '@/utils/request'
class BannerService {
    list() {
        return request({
            url: `/api/v1/banner/list`,
            method: 'get'
        })
    }

    detail(id) {
        return request({
            url: `/api/v1/banner/list/${id}`,
            method: 'get',
        })
    }
    update(id, data) {
        return request({
            url: `/api/v1/banner/list/${id}`,
            method: 'put',
            data
        })
    }
    create(data) {
        return request({
            url: '/api/v1/banner/list',
            method: 'post',
            data
        })
    }
    delete(id) {
        return request({
            url: `/api/v1/banner/list/${id}`,
            method: 'DELETE',
        })
    }
}
export default BannerService