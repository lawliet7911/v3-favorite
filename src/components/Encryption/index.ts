import Encryption from './index.vue'

export default {
  install(app:any) {
    // 此处形参为main.js文件中use()方法自动传进来的Vue实例
    app.component('encryption', Encryption)
  },
}
