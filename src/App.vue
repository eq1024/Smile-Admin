<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import token from '@/styles/AntDesignVueTheme.json'

dayjs.locale('zh-cn')
const componentSize = ref<'small' | 'middle' | 'large'>('middle')
</script>

<template>
  <AConfigProvider :theme="token" :locale="zhCN" :component-size="componentSize">
    <RouterView />
  </AConfigProvider>
</template>
