import Avatar from './index.vue'

export default {
  install(app: any) {
    app.component('myAvatar', Avatar)
  },
}
