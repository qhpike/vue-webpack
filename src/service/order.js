/*
 * @Author: akexian
 * @Date: 2023-03-30
 * @Description: 
 */
import request from "@/utils/request";
class OrderService {
  list(data) {
    return request({
      url: `/api/v1/order/manager`,
      method: "get",
      data
    });
  }

  detail(id) {
    return request({
      url: `/api/v1/spu/list/${id}`,
      method: "get",
    });
  }
  update(data) {
    return request({
      url: "/api/v1/spu/list",
      method: "put",
      data,
    });
  }
}
export default OrderService;
