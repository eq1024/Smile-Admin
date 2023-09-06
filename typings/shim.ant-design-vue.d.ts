import type { UploadProps } from 'ant-design-vue'

declare module 'ant-design-vue'{
  export interface UploadFile{
    id:number
  }
}