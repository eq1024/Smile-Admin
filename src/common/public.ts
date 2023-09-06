import request from '@/utils/request'

export function UploadImage(formData: FormData) {
  return request.post<{ image_path: string }>('/v1/public/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function userLogin(login: { phone: string; password: string }) {
  return request.post<{ expire: string
    token: string
    username: string
    uid: number }>('/v1/public/login', login)
}
