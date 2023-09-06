import { message } from 'ant-design-vue'
import axios from 'axios'
import router from '@/router/index'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  withCredentials: false, // cookie开启
  timeout: 60000,
})
const timer = { timer: null as any }
request.interceptors.request.use(
  (config) => {
    const token = getCookie('token')
    if (config.headers && token)
      config.headers.Authorization = token
    config.headers['Ent-Id'] = getCookie('ent-id') === 'all' ? 0 : getCookie('ent-id')
    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    console.log(`请求详情: 
    请求地址:${response.config.url}
    请求结果:
    `, response.data)
    const { code, msg } = response.data
    if (code !== 200) {
      if (code === 401) {
        message.error('登录过期,请重新登录!')
        timer.timer = null
        timer.timer = setTimeout(() => {
          router.replace('/login')
          timer.timer = null
        }, 1500)
        return Promise.reject(new Error('token过期!'))
      }
      message.error(`错误码${code}：${msg || '未知错误'}`, 5)
      return Promise.reject(new Error(msg || '未知错误'))
    }
    else {
      return response.data
    }
  },
  (error) => {
    console.error(error)
    message.error(error.message, 5)
    return Promise.reject(error)
  },
)

export default request
