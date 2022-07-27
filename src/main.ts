import { createApp } from 'vue'
import App from './App.vue'

import router from './router/index'
// import store from './store/index'
// UI框架
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'src/assets/css/common.css'

import * as components from 'src/components'
import { createPinia } from 'pinia'

const app = createApp(App)
Object.values(components).forEach((component) => {
  app.use(component)
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const pinia = createPinia()

app.use(router).use(ElementPlus, { locale: zhCn }).use(pinia).mount('#app')
