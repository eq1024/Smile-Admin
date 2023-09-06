declare interface GetMainP {
  ent_name?: string;
  page_index?: number;
  page_size?: number;
}

declare interface GetMainR {
  list: {
    created_at: number;
    id: string;
    ent_name: string;
    updated_at: number;
  }[];
  total: number;
}

declare interface GetProductListP {
  product_name?: string;
  page_index?: number;
  page_size?: number;
  state?: number;
}

declare interface GetProductListR {
  list: {
    dev_type: number;
    id: number;
    image: {
      image_path: string;
      image_id: number;
    }[]
    product_name: string;
    network_way: "zigbee" | "bacnet" | "modbus" | "mqtt" | "wifi" | "bluetooth" | "ethernet" | "usb" | "websocket" | "http" | "udp" | "tcp";
    state: number;
    description: string;
    dev_count: number;
    is_default: number;
    alias_name: string,
    product_id: number,
  }[],
  total: number
}

declare interface UpdateStateP {
  product_id: number;
  state: number;
}

declare interface UpdateProductP {
  description: string;
  image_id: number;
  product_name: string;
  product_id?: number;
}


declare interface AddProductP {
  /**
   * 描述
   */
  description: string;
  /**
   * 设备类型，设备类型, 1-网关设备,2-网关子设备,3-直连设备
   */
  config: string;
  dev_type: number;
  /**
   * 主体ID
   */
  image_id: number;
  /**
   * 产品名称
   */
  product_name: string;
  product_id: number;
  alias_name: string;
  network_way: "zigbee" | "bacnet" | "modbus" | "mqtt" | "wifi" | "bluetooth" | "ethernet" | "usb" | "websocket" | "http" | "udp" | "tcp";
  id?: number
}
declare interface ProductDetailR {
  created_at: number;
  description: string;
  dev_type: number;
  device_count: number;
  config: string;
  id: number;
  image: {
    image_path: string;
    image_id: number;
  }[];
  metadata: string;
  product_name: string;
  network_way: string;
  state: number;
  updated_at: number;
}

declare interface GetGatewayR {
  list: {
    description: string;
    dev_state: number;
    dev_state_time: number;
    gateway_name: string;
    id: number;
    state: number;
    unique_number: string;
    dev_count: number;
  }[];
  total: number;
}

declare interface GetGatewayDetailR {
  created_at: number;
  debug_info: string;
  description: string;
  dev_count: number;
  dev_state: number;
  dev_state_time: number;
  extra: string;
  gateway_name: string;
  id: number;
  ip: string;
  secret_id: string;
  secret_key: string;
  state: number;
  unique_number: string;
  updated_at: number;
  version: string;
  activate: number;
}


declare interface AddGatewayP {
  description?: string;
  gateway_name: string;
  unique_number: string;
  id?: number,
  gateway_id?: number,
}

declare interface GetGatewayP {
  dev_state?: number;
  gateway_name?: string;
  page_index?: number;
  page_size?: number;
  state?: number;
}



