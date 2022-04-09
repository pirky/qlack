import { boot } from 'quasar/wrappers'
import { authManager } from 'src/services'
import { RouteLocationRaw } from 'vue-router'

declare module 'vue-router' {
}

const loginRoute = (): RouteLocationRaw => {
  return {
    name: 'auth'
  }
}

// this boot file wires together authentication handling with router
export default boot(({ router, store }) => {
  // if the token was removed from storage, redirect to login
  authManager.onLogout(() => {
    router.push(loginRoute())
      .catch((e) => { console.log(e) })
  })

  // add route guard to check auth user
  router.beforeEach(async (to) => {
    const isAuthenticated = await store.dispatch('auth/check')

    // route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
      // check if logged in if not, redirect to login page
      return loginRoute()
    }

    // route is only for guests so redirect to home
    if (to.meta.guestOnly && isAuthenticated) {
      return { name: 'home' }
    }
  })
})
