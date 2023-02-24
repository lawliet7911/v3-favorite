import Avatar from './commonAvatar.vue'

export default {
  install(app: any) {
    app.component('myAvatar', Avatar)
  }
}
