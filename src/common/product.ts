export function GetMain(params: GetMainP) {
  return request.get<GetMainR>('/v1/public/ent/list', {
    params,
  })
}

export function GetProductList(params: GetProductListP) {
  return request.get<GetProductListR>('/v1/product/list', {
    params: { ...params, page_size: 1000 },
  })
}

export function DeleteProduct(data: { id: number }) {
  return request.post('/v1/product/delete', data)
}

export function UpdateProMetadata(data: {
  product_id: number
  metadata: string
}) {
  return request.post('/v1/product/update/metadata', data)
}

export function GetProductDetail(id: number) {
  return request.get<ProductDetailR>(`/v1/product/detail?id=${id}`)
}

export function UpdateState(data: UpdateStateP) {
  return request.post('/v1/product/update/state', data)
}

export function UpdateProduct(data: UpdateProductP) {
  return request.post('/v1/product/update/info', data)
}

export function AddProduct(data: AddProductP) {
  return request.post('/v1/product/add', data)
}
