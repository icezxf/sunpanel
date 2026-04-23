import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/admin/Profile.vue')
      },
      {
        path: 'personalization',
        name: 'Personalization',
        component: () => import('@/views/admin/Personalization.vue')
      },
      {
        path: 'groups',
        name: 'Groups',
        component: () => import('@/views/admin/Groups.vue')
      },
      {
        path: 'docker',
        name: 'Docker',
        component: () => import('@/views/admin/Docker.vue')
      },
      {
        path: 'gallery',
        name: 'Gallery',
        component: () => import('@/views/admin/Gallery.vue')
      },
      {
        path: 'export-import',
        name: 'ExportImport',
        component: () => import('@/views/admin/ExportImport.vue')
      },
      {
        path: 'api',
        name: 'API',
        component: () => import('@/views/admin/API.vue')
      },
      {
        path: 'accounts',
        name: 'Accounts',
        component: () => import('@/views/admin/Accounts.vue')
      },
      {
        path: 'public-gallery',
        name: 'PublicGallery',
        component: () => import('@/views/admin/PublicGallery.vue')
      },
      {
        path: 'global-settings',
        name: 'GlobalSettings',
        component: () => import('@/views/admin/GlobalSettings.vue')
      },
      {
        path: 'pro',
        name: 'Pro',
        component: () => import('@/views/admin/Pro.vue')
      },
      {
        path: 'migration',
        name: 'Migration',
        component: () => import('@/views/admin/Migration.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/admin/About.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
