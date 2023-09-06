<script setup lang="ts">
import type { UploadProps } from 'ant-design-vue'

interface ImageFile { msg: string; code: number; data: { image_path: string; image_id: number } }
const props = withDefaults(defineProps<{
  fileList: UploadProps['fileList']
  avatar?: boolean
}>(), {
  avatar: false,
})

const emits = defineEmits<{
  (e: 'update:fileList', arr: Array<any>): void
}>()

const action = ref(`${import.meta.env.VITE_APP_BASE_API}/v1/public/upload`)
const headers = ref({
  Authorization: getCookie('token'),
})
const FileList = computed< UploadProps['fileList']>({
  get: () => props.fileList,
  set: (val) => {
    val = val?.map((item) => {
      if (item.url) {
        return item
      }
      else {
        return {
          uid: item.uid,
          id: (item.response as ImageFile)?.data?.image_id,
          name: item.name,
          status: item.status,
          url: (item.response as ImageFile)?.data?.image_path,
        }
      }
    })
    emits('update:fileList', val || [])
  },
})
</script>

<template>
  <a-upload
    v-model:file-list="FileList"
    :headers="headers"
    list-type="picture-card"
    name="file"
    :action="action"
    :max-count="1"
    :multiple="true"
  >
    <div v-if="!avatar || FileList?.length === 0">
      <plus-outlined />
    </div>
  </a-upload>
</template>

<style scoped>

</style>
