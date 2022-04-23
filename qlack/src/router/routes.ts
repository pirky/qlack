import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    meta: { requiresAuth: true },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('src/pages/ChatPage.vue')
      },
      {
        path: 'channel/:channelName',
        meta: { validChannelName: true },
        component: () => import('src/pages/ChatPage.vue')
      }
    ]
  },

  {
    path: '/auth',
    meta: { guestOnly: true },
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'auth',
        component: () => import('src/pages/AuthPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    redirect: () => {
      return { path: '/' }
    }
  }
]

export default routes
