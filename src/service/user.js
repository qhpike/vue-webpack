/*
 * @Author: akexian
 * @Date: 2022-09-15
 * @Description:
 */
import request from "@/utils/request";

class SysUserService {
  list(data) {
    return request({
      url: `/api/v1/user/list`,
      method: "get",
      data,
    });
  }
  update(data) {
    return request({
      url: "/api/v1/user/list",
      method: "put",
      data,
    });
  }
  add(data) {
    return request({
      url: "/api/v1/user/list",
      method: "post",
      data,
    });
  }
  delete(id) {
    return request({
      url: `/api/v1/user/list/${id}`,
      method: "delete",
    });
  }
  detail(id) {
    return request({
      url: `/api/v1/user/list/${id}`,
      method: "get",
    });
  }
  vlidateUser(username) {
    return request({
      url: "/api/v1/user/validate",
      method: "post",
      data: {
        username,
      },
    });
  }
  multiple(data) {
    return request({
      url: "/api/v1/user/multiple",
      method: "post",
      data,
    });
  }
  merge(data) {
    return request({
      url: "/api/v1/user/merge",
      method: "post",
      data,
    });
  }
}
export default SysUserService;
