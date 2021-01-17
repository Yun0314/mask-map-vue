const routes = [{
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [{
      path: '',
      name: "Index",
      meta: {
        label: '口罩地圖',
        icon: 'home'
      },
      component: () => import('pages/Index.vue')
    }]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
