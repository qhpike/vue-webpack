/*
 * @Author: akexian
 * @Date: 2022-07-18
 * @Description: 
 */
import axios from 'axios'
import store from '../store'
import { getToken } from './auth'
import { Message  } from 'element-ui'
import qs from 'qs'

const instance = axios.create({
    baseURL:MYURL.CUSTOMER_SERVER,
    timeout:5000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // config.data = qs.stringify(config.data)
    // config.headers['content-type'] ='application/x-www-form-urlencoded'
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
  }
  console.log(config,'config')
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    const res = response.data;    


    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if(res.code!==200) {
      console.log(res.code,'异常CODE')
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      
      if (res.code === 401) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
    } else {
      return res
    }
   
  
    
  }, function (error) {
    console.log(error)
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error);
  });

  export default instance