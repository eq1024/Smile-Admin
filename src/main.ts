import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'

import '@/styles/index.less' // 全局样式
import 'virtual:svg-icons-register'
import './permission'

// 根据需要开启
import '@/mock/index'

console.log('import.meta.url', import.meta.env.BASE_URL)

createApp(App).use(createPinia()).use(router).mount('#app')
