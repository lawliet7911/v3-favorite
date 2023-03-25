import { defineStore } from 'pinia'
import storage from 'src/utils/storage'
import router from 'src/router'

export const useUserState = defineStore('user', {
  state: () => {
    return {
      user: storage.get('user') || {}
    }
  },
  actions: {
    setUser(data: object) {
      this.user = data
    },
    LOGOUT() {
      this.user = {}
      storage.remove('user')
      storage.remove('user-expTime')
      router.push({ name: 'Login', params: { logout: 1 } })
    }
  }
})
