<script setup lang="ts">
const route = useRoute()
// const router = useRouter
const Detail = ref < { data: ProductDetailR | null } > ({ data: null })
onBeforeMount(() => {
  GetProductDetail(Number(route.params.product_id)).then((res) => {
    Detail.value.data = res.data
  })
})
const activeKey = ref('1')
const monaco = ref()
const key2name = ref({
  product_name: '产品名称',
  description: '产品描述',
  id: '产品ID',
  created_at: '创建时间',
  dev_type: '产品类型',
  device_count: '关联设备数',
  image: '产品图片',
  network_way: '网关',
  state: '状态',
  // metadata: '元数据',
  updated_at: '更新时间',
  config: '配置',
})
const key2span = ref({
  created_at: 1,
  description: 2,
  dev_type: 1,
  device_count: 1,
  id: 1,
  image: 1,
  // metadata: 1,
  product_name: 1,
  network_way: 1,
  state: 1,
  updated_at: 2,
  config: 3,
})
function formate() {
  monaco.value.editorRef.getAction('editor.action.formatDocument').run()
}
function save() {
  UpdateProMetadata({ product_id: Number(route.params.product_id), metadata: JSON.stringify(JSON.parse(Detail.value.data.metadata)).toString() }).then(() => {
    usemsg({ type: 'success', content: '保存成功!' })
  })
}
</script>

<script lang="ts">
export default {
  name: 'product_detail',
}
</script>

<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="产品详情">
      <div v-if="Detail.data" style="background-color: white;padding: 20px;height: 100%;">
        <a-descriptions bordered>
          <a-descriptions-item v-for="(data, index) in key2name " :key="index" :label="key2name[index]" :span="key2span[index]">
            <div v-if="index === 'image'">
              <div v-if="Detail.data.image[0]?.image_path" style="width: 40px;height: 40px;" :style="`background:url(${Detail.data.image[0]?.image_path});background-repeat: no-repeat; background-size: contain;`" />
              <div v-else>
                -
              </div>
            </div>

            <div v-else-if="index === 'created_at'">
              {{ formatDate(new Date(Detail?.data.created_at * 1000)) }}
            </div>
            <div v-else-if="index === 'updated_at'">
              {{ formatDate(new Date(Detail?.data.updated_at * 1000)) }}
            </div>
            <div v-else-if="index === 'dev_type'">
              {{
                Detail.data.dev_type === 1 ? '网关设备' : Detail.data.dev_type === 2 ? '网关子设备' : '直连设备'
              }}
            </div>
            <div v-else-if="index === 'state'">
              {{ Detail?.data.state === 1 ? '启用' : '禁用' }}
            </div>
            <div v-else>
              {{ Detail.data[index] ? Detail.data[index] : '-' }}
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-tab-pane>
    <a-tab-pane key="2" tab="物模型">
      <div style="height: calc(100vh - 180px);">
        <Monaco ref="monaco" v-model:value="Detail.data.metadata">
          <div style="margin: 10px;">
            <a-button style="margin-right: 10px;" @click="formate">
              格式化
            </a-button>
            <a-button type="primary" @click="save">
              保存
            </a-button>
          </div>
        </Monaco>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped>

</style>
