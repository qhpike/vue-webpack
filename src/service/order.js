import request from "@/utils/request";
import qs from "qs";
class OrderService {
  list(query) {
    return request({
      url: `/api/v1/order/manager?${qs.stringify({ ...query })}`,
      method: "get",
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
