import { mock } from 'mockjs'

mock('/request/v1/public/login', 'post', () => {
  return {
    code: 200,
    msg: 'Success',
    data: {
      expire: 1993905472,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9hY2NvdW50X2lkIjoxLCJleHAiOjE2OTM5MDU0NzIsImlhdCI6MTY5MzgxOTA3Mn0.8MJpm2DmBpJnN_SZdbg3H-BtAhkEfk-czjRqo7zYAOs',
      uid: 1,
      username: '管理员',
    },

  }
})

mock('/request/v1/product/update/state', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/gateway/delete', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/product/delete', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/gateway/update/state', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/gateway/confirm', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/gateway/device/unbind', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/gateway/device/bind', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/gateway/debug', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/product/update/metadata', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/product/update/info', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/product/add', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/gateway/update/info', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock('/request/v1/gateway/add', 'post', () => {
  return {
    code: 400,
    msg: 'Mock模式下不允许操作',
    data: {},
  }
})

mock(RegExp('/request/v1/gateway/list' + '.*'), 'get', () => {
  return {
    code: 200,
    msg: 'Success',
    detail: 'success',
    data: {
      list: [
        {
          description: '仅办公室使用',
          dev_count: 6,
          dev_state: 1,
          dev_state_time: 1693305390,
          gateway_name: '办公室网关设备',
          id: 1,
          state: 1,
          unique_number: '00e00b81a272',
        },
      ],
      total: 1,
    },
  }
})

mock(RegExp('/request/v1/product/list' + '.*'), 'get', () => {
  return {
    code: 200,
    msg: 'Success',
    detail: 'success',
    data: {
      list: [
        {
          alias_name: 'modbus.milli.human.detector',
          description: '空调',
          dev_count: 1,
          dev_type: 2,
          id: 4,
          image: [],
          is_default: 1,
          network_way: 'modbus',
          product_id: 4,
          product_name: '空调',
          state: 1,
        },
        {
          alias_name: 'z2m.milli.human.detector',
          description: '人体传感器zigbee版',
          dev_count: 0,
          dev_type: 2,
          id: 5,
          image: [],
          is_default: 1,
          network_way: 'zigbee',
          product_id: 5,
          product_name: '人体传感器',
          state: 1,
        },
      ],
      total: 9,
    },
  }
})

mock(RegExp('/request/v1/product/detail' + '.*'), 'get', () => {
  return {
    code: 200,
    msg: 'Success',
    detail: 'success',
    data: {
      alias_name: 'modbus.milli.human.detector',
      config: '',
      created_at: 1687859456,
      description: '人体传感器modbus版',
      dev_type: 2,
      device_count: 1,
      id: 4,
      image: [
        {
          image_id: 97,
          image_path: 'https://iot-1253251646.cos.ap-guangzhou.myqcloud.com/dev/images/20230904873307e216826a30b45aca736bf2ac42.jpeg',
        },
      ],
      metadata: '{"id":"modbus.milli.human.detector","name":"人体传感器","desc":"人体传感器","property":[{"identifier":"exist","name":"人体存在情况","accessMode":"r","desc":"人体存在情况","defaultValue":"2","dataType":{"type":"enum","specs":{"1":"有人","2":"无人"}}}],"event":[],"function":[]}',
      network_way: 'modbus',
      product_name: '人体传感器',
      shadow: '{"metadata":{"reported":{"exist":0}},"state":{"desired":{},"reported":{"exist":"2"}},"timestamp":0,"version":0}',
      state: 1,
      updated_at: 1693820391,
    },
  }
})

mock(RegExp('/request/v1/gateway/detail' + '.*'), 'get', () => {
  return {
    code: 200,
    msg: 'Success',
    detail: 'success',
    data: {
      activate: 1,
      created_at: 1686304107,
      debug_info: '',
      description: 'Maple Mono SC',
      dev_count: 6,
      dev_state: 1,
      dev_state_time: 1693305390,
      extra: '{"build_time":"","cpu":"Intel(R)Celeron(R)CPUN2840@2.16GHz","cpu_id":"78060300FFFBEBBF","git_commit":"","mac":"00:e0:0b:81:a2:72","mem":"2G"}',
      gateway_name: '办公室网关设备',
      id: 1,
      ip: '192.168.0.67',
      secret_id: 'a88al35aasy2',
      secret_key: 'tkdg437o0ctf',
      state: 1,
      unique_number: '00e00b81a272',
      updated_at: 1693821902,
      version: '',
    },
  }
})
