import { GetMain } from '@/common/product'

export const useEnt = defineStore('ent', {
  state: (): { ent: number | string; ents: GetMainR } => ({
    ent: getCookie('ent-id') || 'all',
    ents: { list: [], total: null },
  }),

  actions: {
    setEnt(id: any) {
      setCookie('ent-id', id)
      this.ent = id
    },
    async setEnts() {
      const temp = await GetMain({})
      this.ents = temp.data
    },
  },
})
