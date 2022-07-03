import storage from 'src/utils/storage'
import router from 'src/router'

import { createStore } from 'vuex'
const defaultState = {
  user: storage.get('user'),
}
export default {
  state() {
    return defaultState
  },
  getters: {
    user: (state: typeof defaultState): object => {
      return state.user
    },
  },
  mutations: {
    SET_USER(state: typeof defaultState, data:object) {
      state.user = data
    },
    LOGOUT(state: typeof defaultState) {
      state.user = {} 
      storage.remove('user')
      storage.remove('user-expTime')
      router.push({ name: 'Login', params: { logout: 1 } })
    },
  },
  actions: {},
}