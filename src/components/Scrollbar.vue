<script setup lang="ts">
import 'overlayscrollbars/css/OverlayScrollbars.css'
import OverlayScrollbars from 'overlayscrollbars'
import type { Options } from 'overlayscrollbars'

const props = withDefaults(defineProps<{
  width?: string | number
  height?: string | number
  tag?: string
  direction?: 'horizontal' | 'vertical'
  initOptions?: Options
  speed?: number
  minHeight?: string | number
}>(), {
  width: '100%',
  height: '100%',
  tag: 'div',
  direction: 'vertical',
  initOptions: undefined,
  speed: 1,
  minHeight: 'unset',
})

const scrollbar = shallowRef<OverlayScrollbars | null>(null)
const scrollbarDom = shallowRef<HTMLElement>(document.createElement(props.tag))

onMounted(() => {
  scrollbar.value = OverlayScrollbars(scrollbarDom.value as HTMLElement, Object.assign(getDirectionOptions(), props.initOptions || {}))
})

onBeforeUnmount(() => {
  scrollbar.value?.destroy()
})

defineExpose({
  scrollbar,
})

function getDirectionOptions(): Options {
  let options: Options = {}
  switch (props.direction) {
    case 'vertical':
      options = {
        scrollbars: { autoHide: 'move', autoHideDelay: 500 },
        overflowBehavior: { x: 'hidden', y: 'scroll' },
      }
      break
    case 'horizontal':
      options = {
        scrollbars: { autoHide: 'leave', autoHideDelay: 500 },
        overflowBehavior: { x: 'scroll', y: 'hidden' },
      }
      break
  }
  return options
}
</script>

<template>
  <component
    :is="props.tag" ref="scrollbarDom" class="scrollbar" :class="[`scrollbar-${props.direction}`]"
    :style="{ width: props.width, height: props.height, minHeight: props.minHeight }"
  >
    <slot />
  </component>
</template>

<style lang="less">
.scrollbar {
  .os-scrollbar-handle {
    background: rgba(0, 0, 0, 0.192) !important;
    transition:  ease-in-out 0s,background-color 0.3s !important;
    &:hover,
    &:active {
      background: #1d39c46b !important;
      transition: ease-in-out 0s,background-color 0.3s !important;
    }
  }
}
</style>
