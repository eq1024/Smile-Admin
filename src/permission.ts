import NProgress from 'nprogress'
import router from './router'
import 'nprogress/nprogress.css'
import { appTitle } from './appConfig'

NProgress.configure({ showSpinner: false })

const whitelist: string[] = ['/login', '/404']
let scrollTimeout: NodeJS.Timeout | null = null
let contentWindowDom: HTMLElement | null = null

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 设置页面标题
  document.title = `${to.meta.title}${appTitle}`
  // 路径命中白名单，放行通过
  if (whitelist.includes(to.path)) {
    next()
  }
  else {
    // 判断是否有token
    const token = getCookie('token')
    if (!token)
      next('/login')
    else
      next()
  }
})

router.afterEach((to, from) => {
  NProgress.done()
  scrollTimeout && clearTimeout(scrollTimeout)
  if (from.path === '/')
    return
  scrollTimeout = setTimeout(() => {
    if (contentWindowDom) {
      contentWindowDom.scrollTo({ top: 0, left: 0 })
      return
    }
    contentWindowDom = document.querySelector('#content-window')
    if (contentWindowDom)
      contentWindowDom.scrollTo({ top: 0, left: 0 })
  }, 350)
})
