## Smile Admin
>基于Vue3、Vite4、ant-design-vue4、Pinia和Typescript的一整套企业级中后台前端解决方案

#### 预览: 

https://vue3-template-d4r0h2c17-eq1024.vercel.app/


#### 项目目录结构

![目录结构](https://pic-1300230199.cos.ap-guangzhou.myqcloud.com/NewPic/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20230906161808.png)


#### 使用

项目使用`yarn`包管理工具,第一次使用请全局安装
```shell
npm install yarn -g
```

第一步:克隆本项目
```shell
git clone https://github.com/eq1024/Smile-Admin
```
第二步:进入并构建依赖
```shell
cd ./vue3-template

yarn
```

第三步:运行项目
```shell
yarn dev
```


#### mock
在根目录`main.ts`中删除mockjs的引入快速关闭模拟



#### 差异内容

1. 集成overlayscrollbars负责视区滚动

2. 集成monaco Editor,目前仅配置`json`支持,可在`components/monaco.vue`自行更改

3. 封装图片上传,支持多图

4. 自动引入自定义组件和Ant Design Vue 组件 ,自动引入函数,更改配置见`vite.config.ts`

5. 统一管理svg图片,封装svg引入组件,使用自动引入

6. 已配置`visualizer`插件,用于build时分析打包大小

7. 支持内部系统的自动化CI,已提供可用的gitlab pipeline 文件,见根目录`.gitlab-ci.yaml`,
如不需要可删除

8. 完整表单功能,使用composition Api形式封装,支持自定义搜索,翻页等操作,具体见`useTable.ts`文件

```tsx
function updateTable() {
  // updateTableFunc 表格刷新操作(如刷新,翻页等)时执行的函数,由调用useTable.ts时传入
  updateTableFunc({
    // 此处 需要根据自己项目的后台接口定制化修改,当前 page_index表示页数,page_size表示页面条数,筛选参数与页面信息同层
    page_index: _pagination.current,
    page_size: _pagination.pageSize,
    ...searchParams.value,
  }).then((res) => {
    _dataSource.value = res.data?.list
    _pagination.total = res.data?.total
  }).finally(() => {
    tableLoading.value = false
  })
  selectedRowKeys.value = []
  tableLoading.value = true
}
```

## 其他说明
vue单体文件请参考如下约定
```
✕ bad
**/product/index.vue

✓ good

**/product/product.vue
```

keepalive的include属性 是根据 单体vue文件的name属性生效的,vue2中可以设置name属性,但在vue3中,因为 vue3 SFCs 会自动根据你的文件名去推断 name,所以第一种情况会错误(期望意义上的)推断出name是index,但是include传值是根据router的name定义的,所以尽量保持vue单体文件名和route的name一致,必要情况使用多一个非 setup的script标签

```typescript
<script>
  export default {
    name: 'CustomName',
  }
</script>
```
