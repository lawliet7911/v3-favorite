import { createRouter, createWebHashHistory, RouteRecordRaw, NavigationGuardNext } from 'vue-router'

import Home from 'src/views/Home.vue'
import Login from 'src/views/login/login.vue'
import { useUserState } from 'src/store/index'
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
    path: '/notebook',
    name: 'Notebook',
    component: BasicLayout,
    children: [
      {
        path: 'edit/:id?',
        name: 'NotebookEdit',
        component: () => import('src/views/notebook/notebookEdit.vue'),
      },
      {
        path: 'see/:id',
        name: 'NotebookWatch',
        component: () => import('src/views/notebook/notebook.vue'),
      },
    ],
  },
  {
    // markdown笔记
    path: '/bill',
    name: 'Bill',
    component: BasicLayout,
    children: [
      {
        path: 'watch',
        name: 'MyBill',
        component: () => import('src/views/Bill/bill.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next: NavigationGuardNext) => {
  let userState = useUserState();
  // 未登录访问其他页面
  if (to.name != 'Login') {
    if (userState.user?.id) {
      next()
    } else {
      // 无用户信息
      next({ name: 'Login' })
    }
  } else {
    // 访问登录页
    // next();
    if (userState.user?.id) {
      // 有用户信息 去首页
      next({ name: 'Home' })
    } else {
      // 退出登录
      next()
      // if (to.params.logout !== undefined) next()
      // else {
      //   next({ name: 'Login', params: { logout: !!to.params.logout ? 1 : 0 } })
      // }
    }
  }
})

export default router
