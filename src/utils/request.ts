import Axios, { AxiosInstance } from 'axios'
import { ElMessage } from 'element-plus'
import store from '../store/index'

const SERVER_ERROR_TEXT: string = ' 服务器错误，请稍后重试'
const TIMEOUT_SECOND: number = 120
const TOAST_DURATION: number = 5

const axios = Axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: TIMEOUT_SECOND * 1000,
})

axios.interceptors.request.use(
  (config) => {
    // 在发出请求前做点什么
    return config
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  (response) => {
    const res = response.data
    // 当状态值不为200判断为错误
    if (res.code !== 200 && res.code !== 'success') {
      if (res.code === 401) {
        ElMessage({
          type: 'error',
          duration: TOAST_DURATION * 1000,
          message: '登录超时',
        })

        // store.dispatch('resetToken').then(() => {
        //   location.reload()
        // })
      }

      ElMessage({
        type: 'error',
        duration: TOAST_DURATION * 1000,
        message: res.message || SERVER_ERROR_TEXT,
      })

      return Promise.reject(new Error(res.message || SERVER_ERROR_TEXT))
    } else {
      return res
    }
  },
  (error) => {
    ElMessage({
      type: 'error',
      duration: TOAST_DURATION * 1000,
      message: error.message,
    })
    return Promise.reject(error)
  }
)

export default axios
