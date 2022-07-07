import { createStore } from 'vuex'
import storage from 'src/utils/storage'
import router from 'src/router'

const defaultState = {
  user: storage.get('user'),
}
export default createStore({
  state() {
    return defaultState
  },
  getters: {
    user: (state: typeof defaultState): object => {
      return state.user
    },
  },
  mutations: {
    SET_USER(state: typeof defaultState, data: any) {
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
})
