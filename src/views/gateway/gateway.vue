<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type OverlayScrollbars from 'overlayscrollbars'
import { useEnt } from '@/stores/entID'

const router = useRouter()
const Ent = useEnt()
const visible = ref<boolean>(false)
const form = ref<FormInstance>()
const scrollbar = ref<Record<string, OverlayScrollbars> >()
const viewHeight = ref<'auto' | number>('auto')
const isEditing = ref<boolean>(false)
const GatewayForm = ref<AddGatewayP>({
  description: '',
  unique_number: '',
  gateway_name: '',
  gateway_id: null,
})
const rules: Record<string, Rule[]> = reactive({
  unique_number: [{ required: true, trigger: 'change' }],
  gateway_name: [{ required: true, trigger: 'change' }],
})
const tableRef = ref()
const searchParams = ref({ activate: 0, state: null, dev_state: null, gateway_name: '' })
const options1 = [{
  value: 0,
  label: '全部',
},
{
  value: 1,
  label: '已分配',
},
{
  value: 2,
  label: '未分配',
}]
const options2 = [{
  value: null,
  label: '全部',
},
{
  value: 1,
  label: '已启用',
},
{
  value: 2,
  label: '已禁用',
}]
const options3 = [{
  value: null,
  label: '全部',
},
{
  value: 1,
  label: '在线',
},
{
  value: 2,
  label: '离线',
}]
// [error]
const { dataSource, columns, tableLoading, pagination, updateTable } = useTable({
  table: tableRef,
  columns: [
    { title: '网关名称', dataIndex: 'gateway_name', key: 'gateway_name', align: 'center' },
    { title: '网关状态', dataIndex: 'state', key: 'state', width: 80, align: 'center' },
    { title: '在线状态', dataIndex: 'dev_state', key: 'dev_state', width: 80, align: 'center' },
    { title: '在线状态时间', dataIndex: 'dev_state_time', key: 'dev_state_time', align: 'center' },
    { title: '下属设备', dataIndex: 'dev_count', key: 'dev_count', width: 80, align: 'center' },
    { title: '网关标识', dataIndex: 'unique_number', key: 'unique_number', align: 'center' },
    { title: '产品描述', dataIndex: 'description', key: 'description', align: 'center' },
    { title: '操作', dataIndex: 'operation', key: 'operation', width: 400, align: 'center' },
  ],
  pagination: { pageSize: 10 },
  updateTableFunc: GetGatewayList,
  searchParams,
})

function handleCancel() {
  form.value.resetFields()
}

function handleOk() {
  form.value?.validate().then(() => {
    if (isEditing.value) {
      GatewayForm.value.gateway_id = GatewayForm.value.id
      UpdateGatewayInfo(GatewayForm.value).then(() => {
        visible.value = false
        form.value.resetFields()
        // FileList.value = []
        updateTable()
      })
    }
    else {
      AddGateway(GatewayForm.value).then(() => {
        visible.value = false
        form.value.resetFields()
        // FileList.value = []
        updateTable()
      })
    }
  }, (firl) => {
    console.log(firl)
  })
}
function add() {
  isEditing.value = false
  visible.value = !visible.value
  Object.assign(GatewayForm.value, {
    description: '',
    unique_number: '',
    gateway_name: '',
  })
}
function edit(item: any) {
  isEditing.value = true
  visible.value = !visible.value
  Object.assign(GatewayForm.value, item)
}
function route2detail(Gateway: any) {
  router.push({ name: 'gateway_detail', params: { gateway_id: Gateway.id } })
}
function ChangeState(product: any) {
  UpdateGatewayState({ gateway_id: product.id, state: product.state === 1 ? 2 : 1 }).then(() => {
    updateTable()
  })
}
function confirm(id: number) {
  DeleteGateway({ id }).then(() => {
    updateTable()
  })
}
onBeforeMount(() => {
  updateTable()
  nextTick(() => {
    viewHeight.value = scrollbar.value?.scrollbar.getState().hostSize.height || 'auto'
  })
})

function selectActive() {
  pagination.current = 1
  updateTable()
}
</script>

<template>
  <div style="height: 100%;">
    <!-- <div>搜索</div> -->
    <div class="top-container">
      <a-popover>
        <template #content>
          <span v-if="Ent.ent === 'all'">请选择具体主体后再添加</span>
        </template>
        <a-button type="primary" :disabled="Ent.ent === 'all'" @click="add">
          <template #icon>
            <plusOutlined />
          </template>
          新增
        </a-button>
      </a-popover>
      <span style="margin-left: 30px;">筛选分配状态:</span><a-select v-model:value="searchParams.activate" style="margin-left: 4px;" :options="options1" @change="selectActive" />
      <span style="margin-left: 30px;">筛选启用状态:</span><a-select v-model:value="searchParams.state" style="margin-left: 4px;" :options="options2" @change="selectActive" />
      <span style="margin-left: 30px;">筛选在线状态:</span><a-select v-model:value="searchParams.dev_state" style="margin-left: 4px;" :options="options3" @change="selectActive" />
      <span style="margin-left: 15px;margin-right: 5px;">设备名称:</span>
      <a-input v-model:value="searchParams.gateway_name" style="width: 200px;display: inline-block;" placeholder="回车搜索名称" @keyup.enter="selectActive" />
    </div>
    <div style="height: calc(100% - 60px) ;">
      <Scrollbar ref="scrollbar" :speed="5">
        <div class="but-container" :style="`height: calc(${viewHeight}px)`">
          <a-table ref="tableRef" :scroll="{ y: Number(viewHeight) - 125 }" :loading="tableLoading" :pagination="pagination" style="width: 100%;" bordered :data-source="dataSource" :columns="columns">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'dev_state'">
                {{ record.dev_state === 1 ? '启用' : '禁用' }}
              </template>
              <template v-if="column.dataIndex === 'dev_state_time'">
                {{ formatDate(new Date(record.dev_state_time * 1000)) }}
              </template>
              <template v-if="column.dataIndex === 'operation'">
                <div class="card-but">
                  <a-button class="but-but" @click="edit(record)">
                    <edit-outlined />
                    编辑
                  </a-button>
                  <a-button class="but-but" @click="route2detail(record)">
                    <eye-outlined />
                    详情
                  </a-button>
                  <a-button v-if="record.state === 2" type="primary" style="background-color: rgb(25, 163, 87);border: none;" class="but-but" @click="ChangeState(record)">
                    <play-square-outlined />
                    启用
                  </a-button>
                  <a-button v-if="record.state === 1" danger type="primary" class="but-but" @click="ChangeState(record)">
                    <play-square-outlined />
                    禁用
                  </a-button>
                  <!-- // 1启用 2禁用 -->
                  <a-popconfirm
                    v-if="record.state === 2 && record.dev_count === 0"
                    title="确定删除此产品吗?"
                    ok-text="是"
                    cancel-text="否"
                    @confirm="confirm(record.id)"
                  >
                    <a-button danger class="but-but">
                      <delete-outlined />
                    </a-button>
                  </a-popconfirm>
                  <a-popover v-else>
                    <template #content>
                      <span>请确保网关已禁用且关联设备为空</span>
                    </template>
                    <a-button danger class="but-but" :disabled="record.state === 1 || record.dev_count !== 0">
                      <delete-outlined />
                    </a-button>
                  </a-popover>
                </div>
              </template>
              <template v-if="column.dataIndex === 'state'">
                {{ record.state === 2 ? '禁用' : '启用' }}
              </template>
            </template>
          </a-table>
        </div>
      </Scrollbar>
    </div>
    <a-modal v-model:open="visible" title="新增产品" @ok="handleOk" @cancel="handleCancel">
      <a-form
        ref="form"
        :model="GatewayForm"
        :rules="rules"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
      >
        <a-form-item
          label="网关名称"
          name="gateway_name"
        >
          <a-input v-model:value="GatewayForm.gateway_name" placeholder="网关名称" />
        </a-form-item>
        <a-form-item
          label="网关标识"
          name="unique_number"
        >
          <a-input v-model:value="GatewayForm.unique_number" placeholder="网关标识" />
        </a-form-item>

        <a-form-item
          label="网关描述"
          name="description"
        >
          <a-textarea v-model:value="GatewayForm.description" placeholder="网关描述" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.top-container {
  margin-bottom: 7px;
  padding: 10px 25px;
  background-color: white;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, .05);
}

.but-container {
  background-color: white;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, .05);
  padding: 5px;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
.but-but{
  margin: 0 4px;
}
  .device-card {
    flex: 0 0 25%;
    padding: 0 15px;
    height: 170px;
    margin: 15px 0;
    min-width: 350px;
    // max-width: 420px;
    .card-top {
      border: 0.5px solid #e2e2e2;
      padding: 4px 0;
      display: flex;
      align-items: center;
      margin-bottom: 6px;

      .top-img {
        width: 110px;
        height: 110px;
        padding: 10px;
        background-size: contain !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
      }

      .top-infos {
        padding-left: 10px;
        flex: 1;
        height: 110px;
        .info-1 {
          display: flex;
          padding-top: 4px;
          margin-bottom: 14px;
          justify-content: space-between;

          .name {
            font-weight: 500;
            font-size: 18px;
            line-height: 30px;
            width: 120px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .status {
            height: 30px;
            padding: 3px 10px 3px 30px;
            line-height: 24px;
            background-color: #e1f9cb;
            clip-path: polygon(100% 0%, 100% 51%, 100% 100%, 25% 100%, 0% 50%, 25% 0%);
          }
          .statusdeactive{
            flex: 0 0 85px;
            height: 30px;
            line-height: 24px;
            padding: 3px 10px 3px 30px;
            background-color: #fae3e3;
            clip-path: polygon(100% 0%, 100% 51%, 100% 100%, 25% 100%, 0% 50%, 25% 0%);
          }
        }
        .info-2{
          display: flex;
          > div{
            flex: 0 0 50%;
          }
        }
      }
    }

    .card-but {
      display: flex;
      justify-content: space-between;
    }

  }
}
</style>
