export function AddGateway(data: AddGatewayP) {
  return request.post('/v1/gateway/add', data)
}

export function GetGatewayList(params: GetGatewayP) {
  return request.get<GetGatewayR>('/v1/gateway/list', {
    params,
  })
}

export function bindDevice(data: { dev_id: number; gateway_id: number }) {
  return request.post('/v1/gateway/device/bind', data)
}

export function DeleteGateway(data: { id: number }) {
  return request.post('/v1/gateway/delete', data)
}

export function unbindDevice(data: { dev_id: number; gateway_id: number }) {
  return request.post('/v1/gateway/device/unbind', data)
}

export function GetGatewayDetail(id: number | string) {
  return request.get<GetGatewayDetailR>(`/v1/gateway/detail?id=${id}`)
}

export function UpdateGatewayState(data: {
  gateway_id: number
  state: number
}) {
  return request.post('/v1/gateway/update/state', data)
}

export function UpdateGatewayInfo(data: {
  gateway_id?: number
  gateway_name: string
  description?: string
}) {
  return request.post('/v1/gateway/update/info', data)
}

export function DebugGateway(data: {
  gateway_id?: number
  cmd: string
}) {
  return request.post('/v1/gateway/debug', data)
}

export function ComfirmGateway(data: {
  gateway_id?: number
  ent_id: string
}) {
  return request.post('/v1/gateway/confirm', data)
}

export function GetGatewayDetailDeviceLinkedList(params: {
  dev_name?: string
  gateway_id: number
  page_index?: number
  page_size?: number
}) {
  return request.get<GatewayBR>('/v1/gateway/list/bind/device', {
    params,
  })
}
export function GetGatewayDetailDeviceUnlinkList(params: {
  dev_name?: string
  gateway_id: number
  page_index?: number
  page_size?: number
}) {
  return request.get<GatewayBR>('/v1/gateway/list/unbind/device', {
    params,
  })
}
