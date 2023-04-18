/*
 * @Author: akexian
 * @Date: 2023-04-18
 * @Description: 
 */
import request from "@/utils/request";

class WxUserService {
  list(data) {
    return request({
      url: `/api/v1/wechat/list`,
      method: 'GET',
      data,
    })
  }
}

export default WxUserService