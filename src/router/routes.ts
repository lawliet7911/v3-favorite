import { RouteRecordRaw } from 'vue-router'
import BasicLayout from 'src/layout/BasicLayout.vue'

const notebookRoutes = [
  {
    path: 'edit/:id?',
    name: 'NotebookEdit',
    component: () => import('src/views/notebook/notebookEdit.vue')
  },
  {
    path: 'see/:id',
    name: 'NotebookWatch',
    component: () => import('src/views/notebook/notebookWatch.vue')
  }
]

const billRoutes = [
  {
    path: 'watch',
    name: 'MyBill',
    component: () => import('src/views/Bill/bill.vue')
  }
]

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('src/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('src/views/login/login.vue')
  },
  {
    path: '/notebook',
    name: 'Notebook',
    component: BasicLayout,
    children: notebookRoutes
  },
  {
    // markdown笔记
    path: '/bill',
    name: 'Bill',
    component: BasicLayout,
    children: billRoutes
  }
]
