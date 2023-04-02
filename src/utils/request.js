/*
 * @Author: akexian
 * @Date: 2022-07-18
 * @Description:
 */
import axios from "axios";
import store from "../store";
import { getToken } from "./auth";
import { Message, MessageBox } from "element-ui";
import qs from "qs";

const instance = axios.create({
  baseURL: MYURL.BASE_SERVER,
  timeout: 5000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    if (config.method === "get" && config.data) {
      config.headers["content-type"] = "application/x-www-form-urlencoded";
      config.url = `${config.url}?${qs.stringify(config.data, {
        arrayFormat: "repeat",
        encode: true,
      })}`;
    }
    if (store.getters.token) {
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    const res = response.data;

    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (res.code !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      if (res.code === 401) {
        // to re-login
      }
    } else {
      return res;
    }
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么

    if (error.response.status === 401) {
      MessageBox.confirm("鉴权失败，请重新登录", "确定退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        store.dispatch("user/resetToken").then(() => {
          location.reload();
        });
      });
    } else {
      Message({
        message: error.message,
        type: "error",
        duration: 5 * 1000,
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
