<script lang="ts" setup>
import type { RouteComponent, RouteRecordRaw } from 'vue-router'
import { routes } from '@/router'
import sidebar from '@/stores/sidebar'

const count = ref(0)
const router = useRouter()

function loadView(path: string): () => Promise<RouteComponent> {
  return () => import(`../${path}.vue`)
}

async function addDynamicMenu(keepAlive = false) {
  count.value++
  const path = `/route/dynamicMenu/newMenu${count.value}`
  const parentRoute = routes.find(route => route.name === 'Route')
  if (!parentRoute)
    return
  const dynamicRoute = parentRoute?.children?.find(item => item.path === path)
  if (dynamicRoute) {
    router.push({ name: dynamicRoute.name })
    return
  }
  const comp = defineComponent({
    name: `newMenu${count.value}`,
    props: ['id'],
    render() {
      return h('div', `这里是新增的菜单${`newMenu${this.$props.id}`}页面`)
    },
  })
  const newRoute: RouteRecordRaw = {
    path,
    name: `newMenu${count.value}`,
    // component: comp,
    component: loadView('z'),
    meta: { title: `${`新增菜单${count.value}`}`, icon: useIcon('MenuOutlined'), keepAlive },
    props: { id: count.value },
  }
  parentRoute?.children?.push(newRoute)
  sidebar.refreshSidebar()
  router.addRoute(parentRoute)
  await router.push(path)
}
</script>

<template>
  <div>
    <p>已创建动态菜单数：{{ count }}</p>
    <ASpace>
      <AButton @click="() => addDynamicMenu()">
        新增动态菜单
      </AButton>
      <AButton @click="() => addDynamicMenu(true)">
        新增动态菜单（缓存）
      </AButton>
    </ASpace>
  </div>
</template>
