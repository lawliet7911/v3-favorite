import Axios, { AxiosInstance } from 'axios'
import { ElMessage } from 'element-plus'
import store from '../store/index'

const SERVER_ERROR_TEXT:string = ' 服务器错误，请稍后重试'
const TIMEOUT_SECOND:number = 30;

const axios = Axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: TIMEOUT_SECOND * 1000
})

axios.interceptors.request.use(
  config => {
    // 在发出请求前做点什么

    return config;
  },
  error => {
    // 处理请求错误
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    const res = response.data;

    // 当状态值不为200判断为错误
    if (res.code !== 200) {
      if (res.status === 401) {
        ElMessage({
          type: 'error',
          duration: TIMEOUT_SECOND * 1000,
          message: '登录超时'
        });

        store.dispatch('user/resetToken').then(() => {
          location.reload();
        });
      }

      ElMessage({
        type: 'error',
        duration: TIMEOUT_SECOND * 1000,
        message: res.message || SERVER_ERROR_TEXT
      });

      return Promise.reject(new Error(res.message || SERVER_ERROR_TEXT));
    } else {
      return res;
    }
  },
  error => {
    console.log('err' + error); // for debug

    ElMessage({
      type: 'error',
      duration: TIMEOUT_SECOND * 1000,
      message: error.message
    });

    return Promise.reject(error);
  }
);

export default axios;