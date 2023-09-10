import axios from 'axios'

const service = axios.create({
  timeout: 5000
})

// 请求拦截
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  (err) => {
    console.log('请求拦截出错，错误信息：', err)
  }
)

// 响应拦截
service.interceptors.response.use(
  (response) => {
    const res = response.data
    return res
  },
  (err) => {
    console.log('响应拦截出错，错误信息：', err)
  }
)

export default service
