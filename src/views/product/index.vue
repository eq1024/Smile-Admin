<script setup lang="ts">
import type { FormInstance, UploadProps } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type OverlayScrollbars from 'overlayscrollbars'
import DefaultImg from '@/assets/device-product.png'
import { useEnt } from '@/stores/entID'

interface ProductItem {
  dev_type: number
  id: number
  image: {
    image_path: string
    image_id: number
  }[]
  product_name: string
  state: number
  description: string
  alias_name: string
  product_id: number
  network_way: 'zigbee' | 'bacnet' | 'modbus' | 'mqtt' | 'wifi' | 'bluetooth' | 'ethernet' | 'usb' | 'websocket' | 'http' | 'udp' | 'tcp'
}
const router = useRouter()
const Ent = useEnt()
const productList = ref<GetProductListR['list']>([])
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const FileList = ref<UploadProps['fileList']>([])
const form = ref<FormInstance>()
const scrollbar = ref<Record<string, OverlayScrollbars> >()
const viewHeight = ref<'auto' | number>('auto')
const isEditing = ref<boolean>(false)

const ProductForm = ref<AddProductP>({
  description: '',
  config: '',
  dev_type: 1,
  image_id: null,
  product_name: '',
  alias_name: '',
  product_id: null,
  network_way: 'zigbee',
})
const rules: Record<string, Rule[]> = reactive({
  product_name: [{ required: true, trigger: 'change' }],
  alias_name: [{ required: true, trigger: 'change' }],
  product_id: [{ required: true, pattern: /^\d+$/, trigger: 'change', message: '产品ID应该是不为空的数字' }],
  network_way: [{ required: true, trigger: 'change' }],
  image_id: [{ required: false, trigger: 'change' }],
  dev_type: [{ required: true, trigger: 'change' }],
})
const SearchP = ref({ state: null, product_name: '' })

function handleCancel() {
  form.value.resetFields()
  FileList.value = []
}

function handleOk() {
  rules.image_id[0].required = true
  ProductForm.value.product_id = Number(ProductForm.value.product_id)
  ProductForm.value.image_id = (FileList.value && FileList.value?.length > 0) ? FileList.value[0].id : null
  form.value?.validate().then(() => {
    if (isEditing.value) {
      ProductForm.value.product_id = ProductForm.value.id
      UpdateProduct(ProductForm.value).then(() => {
        visible.value = false
        form.value.resetFields()
        FileList.value = []
        GetList()
      })
    }
    else {
      AddProduct(ProductForm.value).then(() => {
        visible.value = false
        form.value.resetFields()
        FileList.value = []
        GetList()
      })
    }
  }, (firl) => {
    console.log(firl)
  })
}
function add() {
  isEditing.value = false
  visible.value = !visible.value
  Object.assign(ProductForm.value, {
    description: '',
    dev_type: 1,
    image_id: 0,
    name: '',
  })
}
function edit(item: ProductItem) {
  isEditing.value = true
  visible.value = !visible.value
  Object.assign(ProductForm.value, item)
  FileList.value = item.image.map((item) => {
    return {
      id: item.image_id,
      uid: String(item.image_id),
      name: String(item.image_id),
      status: 'done',
      url: item.image_path,
    }
  })
}
function route2detail(product: ProductItem) {
  router.push({ name: 'product_detail', params: { product_id: product.id } })
}
function ChangeState(product: ProductItem) {
  UpdateState({ product_id: product.id, state: product.state === 1 ? 2 : 1 }).then(() => {
    GetList()
  })
}
function confirm(id: number) {
  DeleteProduct({ id }).then(() => {
    GetList()
  })
}
function GetList() {
  loading.value = true
  GetProductList({ ...SearchP.value }).then((res) => {
    productList.value = res.data?.list ? res.data?.list : []
    loading.value = false
  })
}
onBeforeMount(() => {
  GetList()
  nextTick(() => {
    viewHeight.value = scrollbar.value?.scrollbar.getState().hostSize.height || 'auto'
  })
})
</script>

<script lang="ts">
export default {
  name: 'product',
  inheritAttrs: false,
  customOptions: {},
}
</script>

<template>
  <Scrollbar ref="scrollbar" :speed="5">
    <div :style="`min-height:${viewHeight}px`">
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
        <span style="margin-left: 35px;margin-right: 5px;">产品状态:</span>
        <a-select
          v-model:value="SearchP.state"
          @change="GetList"
        >
          <a-select-option :value="null">
            全部
          </a-select-option>
          <a-select-option :value="1">
            在线
          </a-select-option>
          <a-select-option :value="2">
            离线
          </a-select-option>
        </a-select>
        <span style="margin-left: 15px;margin-right: 5px;">产品名称:</span>
        <a-input v-model:value="SearchP.product_name" style="width: 200px;display: inline-block;" placeholder="回车搜索名称" @keyup.enter="GetList" />
      </div>
      <a-spin :spinning="loading">
        <div class="but-container" :style="`min-height: calc(${viewHeight}px - 60px)`">
          <!-- dev_type 1-网关设备,2-网关子设备,3-直连设备 -->
          <div v-for="i in productList" :key="i.id" class="device-card">
            <div class="card-top">
              <div>
                <div class="top-img" :style="`background:url(${i.image[0]?.image_path ? i.image[0].image_path : DefaultImg})`" alt="fake" />
              </div>
              <div class="top-infos">
                <div class="info-1">
                  <div class="name">
                    {{ i.product_name }}
                  </div>
                  <div :class="i.state === 2 ? 'statusdeactive' : 'status'">
                    {{ i.state === 2 ? '禁用中' : '启用中' }}
                  </div>
                </div>
                <div class="info-2">
                  <div>
                    <div>设备类型</div>
                    <div v-if="i.dev_type === 1">
                      网关设备
                    </div>
                    <div v-if="i.dev_type === 2">
                      网关子设备
                    </div>
                    <div v-if="i.dev_type === 3">
                      直连设备
                    </div>
                  </div>
                  <div>
                    <div>接入方式</div>
                    <div>{{ i.network_way }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-but">
              <a-button class="but-but" @click="edit(i)">
                <edit-outlined />
                编辑
              </a-button>
              <a-button class="but-but" @click="route2detail(i)">
                <eye-outlined />
                详情
              </a-button>
              <a-button v-if="i.state === 2" type="primary" style="background-color: rgb(25, 163, 87);border: none;" class="but-but" @click="ChangeState(i)">
                <play-square-outlined />
                启用
              </a-button>
              <a-button v-if="i.state === 1" danger type="primary" class="but-but" @click="ChangeState(i)">
                <play-square-outlined />
                禁用
              </a-button>
              <!-- // 1启用 2禁用 -->
              <a-popconfirm
                v-if="i.state === 2 && i.is_default !== 1"
                title="确定删除此产品吗?"
                ok-text="是"
                cancel-text="否"
                @confirm="confirm(i.id)"
              >
                <a-button danger class="but-but">
                  <delete-outlined />
                </a-button>
              </a-popconfirm>

              <a-popover v-else-if="i.state === 1 && i.is_default !== 1">
                <template #content>
                  <span>请先禁用并清除下属设备后再删除</span>
                </template>
                <a-button danger class="but-but" :disabled="i.state === 1 || i.dev_count !== 0">
                  <delete-outlined />
                </a-button>
              </a-popover>

              <a-popover v-else>
                <template #content>
                  <span>默认产品无法删除</span>
                </template>
                <a-button danger class="but-but" :disabled="true">
                  <delete-outlined />
                </a-button>
              </a-popover>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
    <a-modal v-model:open="visible" title="新增产品" @ok="handleOk" @cancel="handleCancel">
      <a-form
        ref="form"
        :model="ProductForm"
        :rules="rules"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
      >
        <a-form-item
          label="产品图片"
          name="image_id"
        >
          <UploadImg v-model:file-list="FileList" />
        </a-form-item>
        <a-form-item
          label="产品名称"
          name="product_name"
        >
          <a-input v-model:value="ProductForm.product_name" placeholder="产品名称" />
        </a-form-item>
        <a-form-item
          label="产品别名"
          name="alias_name"
        >
          <a-input v-model:value="ProductForm.alias_name" placeholder="产品名称" />
        </a-form-item>
        <a-form-item
          label="产品ID"
          name="product_id"
        >
          <a-input v-model:value="ProductForm.product_id" :disabled="isEditing" placeholder="产品名称" />
        </a-form-item>
        <a-form-item
          label="设备描述"
          name="description"
        >
          <a-textarea v-model:value="ProductForm.description" placeholder="产品描述" />
        </a-form-item>
        <a-form-item
          label="配置"
          name="description"
        >
          <a-textarea v-model:value="ProductForm.config" placeholder="配置内容" />
        </a-form-item>
        <a-form-item
          label="设备类型"
          name="dev_type"
        >
          <a-select
            v-model:value="ProductForm.dev_type"
            style="width: 120px"
            :disabled="isEditing"
          >
            <a-select-option :value="1">
              网关设备
            </a-select-option>
            <a-select-option :value="2">
              网关子设备
            </a-select-option>
            <a-select-option :value="3">
              直连设备
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="接入方式"
          name="network_way"
        >
          <a-select
            v-model:value="ProductForm.network_way"
            style="width: 120px"
          >
            <a-select-option value="zigbee" />
            <a-select-option value="bacnet" />
            <a-select-option value="modbus" />
            <a-select-option value="mqtt" />
            <a-select-option value="wifi" />
            <a-select-option value="bluetooth" />
            <a-select-option value="ethernet" />
            <a-select-option value="usb" />
            <a-select-option value="websocket" />
            <a-select-option value="http" />
            <a-select-option value="udp" />
            <a-select-option value="tcp" />
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </Scrollbar>
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
