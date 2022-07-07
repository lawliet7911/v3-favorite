import Encryption from './index.vue'

export default {
  install(app: any) {
    app.component('encryption', Encryption)
  },
}
