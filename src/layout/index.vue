<script setup lang="ts">
import type { Layout } from 'typings/layout'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import HeadBar from './HeadBar.vue'
import TabsBar from './TabsBar.vue'

// import Logo from '@/assets/exinputBundle.picfaceCom.png'
import { fixedHeader, transitions } from '@/appConfig'

export type CloseTabInject = (tab: RouteLocationNormalizedLoaded, noRedirect?: boolean, forceClose?: boolean) => Promise<void> | undefined
export type GetTabsInject = () => Readonly<RouteLocationNormalizedLoaded>[] | undefined
export type SetCurrentTabNameInject = (name: string) => void | undefined
export type RefreshBreadCrumbInject = () => void

const SideBar = defineAsyncComponent(() => import('./SideBar.vue')) as ReturnType<typeof defineComponent>
const tabsBarRef = shallowRef<InstanceType<typeof TabsBar> | null>(null)
const headBarRef = shallowRef<InstanceType<typeof HeadBar> | null>(null)
const useSharedIsMobile = createSharedComposable(isMobile)
const _isMobile = useSharedIsMobile(setSidebarCollapsed)

const sidebarRelated = reactive<Layout.SidebarRelated>({
  collapsed: true,
  shadowCollapsed: true,
  width: '13rem',
  collapsedWidth: '3rem',
  collapsedText: 'Smile',
})
const loading = reactive<Layout.Loading>({
  logout: false,
})
const keepAlivePages = ref<Layout.keepAlivePages>(new Set())

onBeforeMount(() => {
  setSidebarCollapsed()
})

function setSidebarCollapsed() {
  sidebarRelated.collapsed = _isMobile.value
  sidebarRelated.shadowCollapsed = sidebarRelated.collapsed
}
// 为子组件提供布局的相关状态信息
provide('sidebarRelated', sidebarRelated)
provide('keepAlivePages', keepAlivePages.value)
provide('loading', loading)
provide<CloseTabInject>('closeTab', (tab: RouteLocationNormalizedLoaded, noRedirect?: boolean, forceClose?: boolean) => tabsBarRef.value?.closeTab(tab, noRedirect, forceClose))
provide<GetTabsInject>('getTabs', () => tabsBarRef.value?.getReadOnlyTabs())
provide<SetCurrentTabNameInject>('setCurrentTabName', (name: string) => tabsBarRef.value?.setCurrentTabName(name))
provide<RefreshBreadCrumbInject>('refreshBreadCrumb', () => headBarRef.value?.refreshBreadCrumb())
</script>

<template>
  <ALayout>
    <ALayoutSider
      v-if="!_isMobile" v-model:collapsed="sidebarRelated.collapsed" collapsible :trigger="null"
      :width="sidebarRelated.width" :collapsed-width="sidebarRelated.collapsedWidth" breakpoint="md"
    >
      <div style="position: relative; z-index: 999; display: flex; flex-direction: column; width: 100%; height: 100%;">
        <RouterLink to="/" style="height: 50px;text-align: center;">
          <div
            v-if="(sidebarRelated.shadowCollapsed || sidebarRelated.collapsed) && sidebarRelated.collapsedText"
            class="flex-center logo-collapsed"
          >
            {{ sidebarRelated.collapsedText }}
          </div>
          <div v-else>
            <!-- <img :src="Logo" alt="Logo" class="logo"> -->
            <span style="text-align: center;line-height: 48px;">Smile Admin</span>
          </div>
        </RouterLink>
        <SideBar style="box-shadow: 2px 0 8px 0 rgba(29,35,41,.05);" />
      </div>
      <div
        v-if="!_isMobile" class="sidebar-shadow"
        :style="{ transform: `translate3d(${sidebarRelated.shadowCollapsed ? '-10rem' : '0'}, 0, 0)` }"
      />
    </ALayoutSider>
    <ALayout>
      <ALayoutHeader v-if="fixedHeader" class="zz">
        <HeadBar ref="headBarRef" style="z-index: 99;background-color: white;height: 50px;box-shadow: rgba(29, 35, 41, 0.10) 5px 0px 8px 2px;padding-right: 16px; " />
        <TabsBar ref="tabsBarRef" :with-icons="false" :with-dot="true" />
      </ALayoutHeader>
      <ALayoutContent id="content-window">
        <div v-if="!fixedHeader" style="padding: 0 1rem;">
          <HeadBar ref="headBarRef" />
          <TabsBar ref="tabsBarRef" :with-icons="false" :with-dot="true" />
        </div>
        <RouterView v-slot="{ Component, route }">
          <div class="content-view">
            <Transition :name="transitions.fadeScale" mode="out-in" appear>
              <KeepAlive :include="Array.from(keepAlivePages)" :max="10">
                <component :is="Component" :key="route.name" />
              </KeepAlive>
            </Transition>
          </div>
        </RouterView>
      </ALayoutContent>
    </ALayout>
  </ALayout>
  <Teleport to="body">
    <Transition name="slide-right" mode="out-in" appear>
      <Shadow v-if="_isMobile && !sidebarRelated.collapsed" @shadowClick="sidebarRelated.collapsed = true">
        <div class="block sidebar-mobile">
          <RouterLink to="/">
            <!-- <img :src="Logo" alt="Logo" class="logo"> -->
          </RouterLink>
          <SideBar />
        </div>
      </Shadow>
    </Transition>
  </Teleport>
</template>

<style scoped>
.zz{
  padding: 0 !important;
  background-color: white;
}
.sidebar-mobile {
  width: 15rem;
  height: 96vh;
  position: absolute;
  top: 2vh;
  left: 2vw;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.content-view {
  padding: 1rem;
  width: 100%;
  height: 100%;
}

.sidebar-shadow {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 13rem;
  height: 100%;
  background-color: var(--sidebar-background-color);
  transition: transform ease 0.2s;
}

.logo {
  /* width: 50%; */
  /* margin-left: 25%; */
  /* margin: 0 auto; */
  /* height: 3rem; */
  object-fit: contain;
  image-rendering: optimizeQuality;
  animation: fadeIn 1s ease;
}

.logo-collapsed {
  color: var(--sidebar-font-color);
  font-size: .8rem;
  width: 100%;
  height: 3rem;
  text-align: center;
  overflow: hidden;
  animation: fadeIn 1s ease;
}
</style>
