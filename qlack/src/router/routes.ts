import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    meta: { requiresAuth: true },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: ':',
        component: () => import('src/pages/ChatPage.vue')
      },
      {
        path: ':id',
        component: () => import('src/pages/ChatPage.vue')
      }
    ]
  },

  {
    path: '/auth',
    name: 'auth',
    meta: { guestOnly: true },
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/AuthPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
