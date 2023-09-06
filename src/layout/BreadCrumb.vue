<script setup lang="ts">
import type { RouteLocationMatched } from 'vue-router'
import { resolve } from 'pathe'
import { dashboardRoute } from '@/router'

const props = withDefaults(defineProps<{
  withIcons?: boolean
}>(), {
  withIcons: false,
})
const router = useRouter()
const route = useRoute()
const allRoutes = router.getRoutes()
const routeMatched = shallowRef<RouteLocationMatched[]>([])
onBeforeMount(() => refreshBreadCrumb())
watch(() => route.path, refreshBreadCrumb)

defineExpose({
  refreshBreadCrumb,
})

function refreshBreadCrumb() {
  routeMatched.value = []
  nextTick(() => {
    const options = []
    routeMatched.value = route.matched.filter(item => item.meta.breadcrumb !== false)
    for (const matched of routeMatched.value) {
      if (matched.meta.belongs) {
        const belongRoute = allRoutes.find(item => item.path === matched.meta.belongs)
        belongRoute && options.push(belongRoute)
      }
      options.push(matched)
    }
    routeMatched.value = options
    if (routeMatched.value.length === 0) {
      routeMatched.value.unshift({ ...dashboardRoute.children?.[0], path: resolve('/', dashboardRoute.children?.[0].path as string) } as RouteLocationMatched)
      return
    }
    if (routeMatched.value[0].path !== '/dashboard')
      routeMatched.value.unshift({ ...dashboardRoute.children?.[0], path: resolve('/', dashboardRoute.children?.[0].path as string) } as RouteLocationMatched)
  })
}
</script>

<template>
  <Transition name="fade-scale" mode="out-in" appear>
    <ABreadcrumb v-if="routeMatched.length > 0">
      <ABreadcrumbItem v-for="(routeItem, index) in routeMatched" :key="routeItem.path">
        <template v-if="props.withIcons && routeItem.meta.icon">
          <SvgIcon v-if="typeof routeItem.meta.icon === 'string'" :icon-name="routeItem.meta.icon as string" />
          <component :is="routeItem.meta.icon" v-else />
        </template>
        <RouterLink v-slot="{ navigate, href }" custom :to="routeItem.path">
          <a v-if="index < routeMatched.length - 1" :href="href" @click="navigate">&nbsp;{{ routeItem.meta.title }}</a>
          <span v-else>&nbsp;{{ routeItem.meta.title }}</span>
        </RouterLink>
      </ABreadcrumbItem>
    </ABreadcrumb>
  </Transition>
</template>
