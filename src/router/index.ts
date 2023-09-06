import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const {
  UngroupOutlined, FundOutlined, FireOutlined, DeploymentUnitOutlined,
  DotChartOutlined, BarChartOutlined, LineChartOutlined,
} = useIcon(['UngroupOutlined', 'FundOutlined', 'FireOutlined', 'DeploymentUnitOutlined',
  'DotChartOutlined', 'BarChartOutlined', 'LineChartOutlined',
])

export const dashboardRoute: RouteRecordRaw = {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  meta: { breadcrumb: false },
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard.vue'),
      meta: { title: '仪表盘', icon: FundOutlined, searchKeywords: ['dashboard', 'ybp', 'yibiaopan'] },
    },
  ],
}

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true, title: '页面跳转', hiddenTab: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect.vue'),
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    meta: { hidden: true, title: '404' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true },
  },
]

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
    meta: { hidden: true, title: '登录' },
  },
  {
    path: '/product',
    name: 'Product',
    component: Layout,
    redirect: { name: 'product' },
    meta: { breadcrumb: false },
    children: [
      {
        path: 'index',
        name: 'product',
        component: () => import('@/views/product/index.vue'),
        meta: { title: '产品列表', icon: UngroupOutlined, keepAlive: true, searchKeywords: ['product', 'chanpingliebiao', 'cplb'] },
      },
      {
        path: 'detail/:product_id',
        name: 'product_detail',
        component: () => import('@/views/product/detail.vue'),
        meta: { title: '详情列表', icon: UngroupOutlined, keepAlive: true, searchKeywords: [], hidden: true },
      },
    ],
  },
  {
    path: '/gateway',
    name: 'Gateway',
    component: Layout,
    redirect: { name: 'gateway' },
    meta: { breadcrumb: false },
    children: [
      {
        path: 'index',
        name: 'gateway',
        component: () => import('@/views/gateway/gateway.vue'),
        meta: { title: '网关设备', keepAlive: true, icon: DeploymentUnitOutlined, searchKeywords: ['gateway', 'wangguanshebei', 'wgsb'] },
      },
      {
        path: 'detail/:gateway_id',
        name: 'gateway_detail',
        component: () => import('@/views/gateway/gatewayDetail.vue'),
        meta: { title: '网关详情', keepAlive: true, icon: LineChartOutlined, hidden: true, searchKeywords: [] },
      },
    ],
  },
  {
    path: '/route',
    name: 'Route',
    component: Layout,
    redirect: { name: 'dynamicRoute' },
    meta: { title: '路由管理', icon: FireOutlined, breadcrumb: false },
    children: [
      {
        path: 'dynamicRoute',
        name: 'dynamicRoute',
        component: () => import('@/views/route/dynamicRoute.vue'),
        meta: { title: '动态路由', icon: FireOutlined, keepAlive: true, searchKeywords: ['dongtailuyou', 'dtlu'] },
      },
      {
        path: 'dynamicMenu',
        name: 'dynamicMenu',
        component: () => import('@/views/route/dynamicMenu.vue'),
        meta: { title: '动态菜单', icon: FireOutlined, keepAlive: true, searchKeywords: ['dongtaicaidan', 'dtcd'] },
      },
    ],
  },
  {
    path: '/chart',
    name: 'Chart',
    component: Layout,
    redirect: { name: 'line' },
    meta: { title: '图表', icon: DotChartOutlined },
    children: [
      {
        path: 'line',
        name: 'line',
        component: () => import('@/views/charts/line.vue'),
        meta: { title: '折线图', icon: LineChartOutlined, searchKeywords: ['line', 'zhexiantu', 'zxt'] },
      },
      {
        path: 'keyboard',
        name: 'keyboard',
        component: () => import('@/views/charts/keyboard.vue'),
        meta: { title: '键盘', icon: BarChartOutlined, searchKeywords: ['keyboard', 'jianpan', 'jp'] },
      },
    ],
  },
]

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [dashboardRoute, ...routes, ...constantRoutes],
})

router.beforeEach(async (to, from) => {
  // console.log('路由:', to, from)
})
export default router
