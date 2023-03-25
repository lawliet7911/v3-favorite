import { createRouter, createWebHashHistory, NavigationGuardNext } from 'vue-router'
import { useUserState } from 'src/store/index'
import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

function isLoggedIn(userState: any) {
  return userState.user?.id !== undefined
}

router.beforeEach((to, from, next: NavigationGuardNext) => {
  const userState = useUserState()
  const isUserLoggedIn = isLoggedIn(userState)
  const isVisitingLoginPage = to.name === 'Login'
  const isVisitingOtherPage = to.name !== 'Login'

  if (isVisitingOtherPage && !isUserLoggedIn) {
    next({ name: 'Login' }) // 无用户信息
  } else if (isVisitingLoginPage && isUserLoggedIn) {
    next({ name: 'Home' }) // 有用户信息 去首页
  } else {
    next()
  }
})

export default router
