<script setup lang="ts">
import { useEnt } from '@/stores/entID'

const route = useRoute()
const Ent = useEnt()
const Detail = ref < { data: GetGatewayDetailR | null } > ({ data: null })
// 控制占位大小和显示顺序
const key2name = ref({
  gateway_name: '网关名称',
  unique_number: '唯一标识',
  id: '产品ID',
  state: '状态',
  dev_state: '在线状态',
  created_at: '创建时间',
  updated_at: '更新时间',
  dev_count: '设备数',
  dev_state_time: '最后在线时间',
  ip: 'IP',
  secret_id: '密钥ID',
  version: '版本号',
  secret_key: '密钥Key',
  description: '产品描述',
  extra: '其他',
  debug_info: '调试信息',
})
const key2span = ref({
  created_at: 1,
  state: 1,
  id: 1,
  description: 3,
  updated_at: 1,
  dev_count: 1,
  dev_state: 1,
  dev_state_time: 1,
  extra: 3,
  gateway_name: 1,
  ip: 1,
  secret_id: 1,
  secret_key: 2,
  unique_number: 1,
  version: 1,
  debug_info: 3,
})
const visible = ref(false)
const selectEnt = ref(null)
const activeKey = ref('1')
const tableRef = ref()
const showAdd = ref(false)
const debugIsLoading = ref(false)
const searchParams = ref({
  gateway_id: Number(route.params.gateway_id),
})
const SearchP = ref({
  gateway_id: Number(route.params.gateway_id),
  dev_name: '',
})

const { dataSource, columns, tableLoading, pagination, updateTable } = useTable<{ gateway_id: number }>({
  table: tableRef,
  columns: [
    // { title: '设备ID', dataIndex: 'dev_id', key: 'dev_id', width: 50, align: 'center' },
    { title: '设备名称', dataIndex: 'dev_name', key: 'dev_name' },
    { title: '产品名称', dataIndex: 'product_name', key: 'product_name' },
    { title: '当前状态', dataIndex: 'state', key: 'state', width: 80, align: 'center' },
    { title: '在线状态', dataIndex: 'dev_state', key: 'dev_state', width: 80, align: 'center' },
    { title: '设备唯一码', dataIndex: 'unique_number', key: 'unique_number', align: 'center' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '操作', dataIndex: 'operation', key: 'operation', width: 100, align: 'center' },
  ],
  pagination: { pageSize: 10 },
  updateTableFunc: GetGatewayDetailDeviceLinkedList,
  searchParams,
})

const Addtable = useTable<{ gateway_id: number }>({
  table: tableRef,
  columns: [
    { title: '设备名称', dataIndex: 'dev_name', key: 'dev_name', width: 200 },
    { title: '产品名称', dataIndex: 'product_name', key: 'product_name', width: 200 },
    { title: '当前状态', dataIndex: 'state', key: 'state', width: 100, align: 'center' },
    { title: '在线状态', dataIndex: 'dev_state', key: 'dev_state', width: 100, align: 'center' },
    { title: '设备唯一码', dataIndex: 'unique_number', key: 'unique_number', width: 150, align: 'center' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '操作', dataIndex: 'operation', key: 'operation', width: 100, align: 'center' },
  ],
  pagination: { pageSize: 10 },
  updateTableFunc: GetGatewayDetailDeviceUnlinkList,
  searchParams: SearchP,
})

function reload() {
  debugIsLoading.value = !debugIsLoading.value
  const data = Detail.value.data.debug_info === '' ? 'start' : 'stop'
  DebugGateway({ cmd: data, gateway_id: Number(route.params.gateway_id) }).then(() => {
    usemsg({ content: '设置成功!', type: 'success' })
    // debugIsLoading.value = !debugIsLoading.value
    GetInfo()
  }).finally(() => {
    setTimeout(() => {
      debugIsLoading.value = !debugIsLoading.value
    }, 200)
  })
}
function unbind(dev_id: number, gat_id: number) {
  unbindDevice({ dev_id, gateway_id: gat_id }).then(() => {
    usemsg({ type: 'success', content: '解绑成功!' })
    updateTable()
    Addtable.updateTable()
  })
}
function bind(dev_id: number, gat_id: number) {
  bindDevice({ dev_id, gateway_id: gat_id }).then(() => {
    usemsg({ type: 'success', content: '绑定成功!' })
    Addtable.updateTable()
    updateTable()
  })
}
function GetInfo() {
  GetGatewayDetail(Number(route.params.gateway_id)).then((res) => {
    Detail.value.data = res.data
  })
}
function handleOk() {
  ComfirmGateway({ gateway_id: Number(route.params.gateway_id), ent_id: selectEnt.value }).then(() => {
    usemsg({ content: '设置成功!', type: 'success' })
  })
}
function comfortAdd() {
  showAdd.value = !showAdd.value
}
function addDev() {
  showAdd.value = !showAdd.value
}
onBeforeMount(() => {
  GetInfo()
  updateTable()
  Addtable.updateTable()
})
</script>

<script lang="ts">
export default {
  name: 'product_detail',
}
</script>

<template>
  <div v-if="Detail.data" style="background-color: white;padding: 20px;height: 100%;">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="产品详情">
        <a-descriptions bordered>
          <a-descriptions-item label="开/关调试" :span="1">
            <a-button :loading="debugIsLoading" @click="reload">
              {{ Detail?.data.debug_info === '' ? '开启' : '关闭' }}
            </a-button>
            <a-button v-if="Detail.data.activate === 2 " @click="visible = !visible">
              设置主体
            </a-button>
          </a-descriptions-item>
          <a-descriptions-item v-for="(data, index) in key2name " :key="index" :label="key2name[index]" :span="key2span[index]">
            <div v-if="index === 'created_at'">
              {{ formatDate(new Date(Detail?.data.created_at * 1000)) }}
            </div>
            <div v-else-if="index === 'updated_at'">
              {{ formatDate(new Date(Detail?.data.updated_at * 1000)) }}
            </div>
            <div v-else-if="index === 'dev_state_time'">
              {{ formatDate(new Date(Detail?.data.dev_state_time * 1000)) }}
            </div>
            <div v-else-if="index === 'state'">
              {{ Detail?.data.state === 1 ? '启用' : '禁用' }}
            </div>
            <div v-else-if="index === 'dev_state'">
              {{ Detail?.data.dev_state === 1 ? '在线' : '离线' }}
            </div>
            <div v-else>
              {{ Detail?.data[index] ? Detail?.data[index] : '-' }}
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </a-tab-pane>
      <a-tab-pane key="2" tab="配置设备" force-render>
        <div class="table-up">
          <a-button @click="addDev">
            添加关联设备
          </a-button>
        </div>
        <a-table ref="tableRef" style="width: 100%;" :loading="tableLoading" :pagination="pagination" bordered :data-source="dataSource" :columns="columns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'state'">
              {{ record.state === 1 ? '启用' : '禁用' }}
            </template>
            <template v-if="column.dataIndex === 'dev_state'">
              {{ record.dev_state === 1 ? '启用' : '禁用' }}
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <div>
                <a-popconfirm
                  title="确定解绑此设备吗?"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="unbind(record.dev_id, Number(route.params.gateway_id))"
                >
                  <a-button danger class="but-but">
                    解绑
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <a-modal v-model:open="visible" title="设置主体" @ok="handleOk">
      <a-select
        v-model:value="selectEnt"
        style="width: 120px"
        placeholder="选择主体"
      >
        <a-select-option v-for="ent in Ent.ents?.list" :key="ent.id" :value="ent.id">
          {{ ent.ent_name }}
        </a-select-option>
      </a-select>
    </a-modal>
    <a-modal v-model:open="showAdd" width="80vw" title="添加设备" :destroy-on-close="true" @ok="comfortAdd">
      <div style="margin-bottom: 16px;">
        <span style="margin-right: 10px;">设备名称:</span>
        <a-input v-model:value="SearchP.dev_name" style="width: 200px;display: inline-block;" placeholder="回车搜索名称" @keyup.enter="Addtable.updateTable" />
      </div>
      <a-table ref="tableRef" style="width: 100%;" :scroll="{ y: 400 }" :loading="Addtable.tableLoading.value" :pagination="Addtable.pagination" bordered :data-source="Addtable.dataSource.value" :columns="Addtable.columns">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'state'">
            {{ record.state === 1 ? '启用' : '禁用' }}
          </template>
          <template v-if="column.dataIndex === 'dev_state'">
            {{ record.dev_state === 1 ? '启用' : '禁用' }}
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <div>
              <a-popconfirm
                title="确定绑定此设备吗?"
                ok-text="是"
                cancel-text="否"
                @confirm="bind(record.dev_id, Number(route.params.gateway_id))"
              >
                <a-button type="primary" class="but-but">
                  绑定
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.table-up{
  margin-bottom: 10px;
}
</style>
