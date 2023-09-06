import type { Stores } from 'typings/stores'

export const userStore = defineStore('user', {
  state: (): Stores.user => ({
    username: '',
    expire: '',
    token: '',
    uid: null,
  }),
  actions: {
    async login(phone: string, password: string) {
      return new Promise((resolve, reject) => {
        userLogin({ phone, password }).then((res) => {
          const { data, msg } = res
          if (data) {
            this.username = data.username
            this.expire = data.expire
            this.token = data.token
            this.uid = data.uid
            setCookie('token', this.token)
            resolve(msg)
          }
          else {
            reject(msg)
          }
        })
      })
    },
    async logout() {
      return new Promise((resolve) => {
        removeCookie('token')
        usemsg({ type: 'success', content: '退出成功!' })
        resolve('')
      })
    },
  },
})
