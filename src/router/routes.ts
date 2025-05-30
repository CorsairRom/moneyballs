import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageEntries.vue') },
      { path: 'settings', component: () => import('pages/PageSettings.vue') },
      { path: 'history', component: () => import('pages/PageHistory.vue') },
      { path: 'history/:monthKey', component: () => import('pages/PageMonthDetail.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
