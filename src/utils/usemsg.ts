import { message } from 'ant-design-vue'

interface msgPayload {
  type: 'error' | 'warning' | 'success'
  content: string
}

export function usemsg(msg: msgPayload) {
  message[msg.type](msg.content, 3)
}
