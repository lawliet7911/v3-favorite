import { createRouter, createWebHashHistory, RouteRecordRaw,NavigationGuardNext } from 'vue-router'

import Home from 'src/views/Home.vue'
import Login from 'src/views/login/login.vue'
import store from 'src/store/index'
import BasicLayout from 'src/layout/layout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: "/notebook",
    name: "Notebook",
    component: BasicLayout,
    children: [
      {
        path: "edit/:id?",
        name: "NotebookEdit",
        component: () => import("src/views/notebook/notebookEdit.vue"),
      },
      {
        path: "see/:id",
        name: "NotebookWatch",
        component: () => import("src/views/notebook/notebook.vue"),
      },
    ]
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next:NavigationGuardNext) => {
  // 未登录
  if (to.name != 'Login') {
    if (store.state?.user?.id) {
      next()
    } else {
      next({ name: 'Login' })
    }
  } else {
    // next();
    if (store.state?.user?.id) {
      next({ name: 'Home' })
    } else {
      if (to.params.logout !== undefined) next()
      else{ 
        next({ name: 'Login', params: { logout: !!to.params.logout?1:0 } })
      }
    }
  }
})

export default router
