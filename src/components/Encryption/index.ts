import Encryption from './encryption-dialog.vue'

export default {
  install(app: any) {
    app.component('encryption-dialog', Encryption)
  }
}
