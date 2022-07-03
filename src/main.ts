import { createApp } from 'vue'
import App from './App.vue'

import router from './router/index'
import store from './store/index'

// UI框架
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// rest.css
import 'src/assets/css/common.css'

createApp(App)
  .use(router)
  .use(store)
  .use(ElementPlus)
  .mount('#app')
