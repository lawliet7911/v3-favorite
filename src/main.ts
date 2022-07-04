import { createApp } from "vue"
import App from "./App.vue"

import router from "./router/index"
import store from "./store/index"

// UI框架
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
// element-icons
import * as ElementPlusIconsVue from "@element-plus/icons-vue"

// rest.css
import "src/assets/css/common.css"

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(store).use(ElementPlus).mount("#app")
