import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

Vue.use(Router)

export default new Router({

  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/depiction/:id',
      name: 'depiction',
      component: () => import('@/views/depiction'),
      props: true
    },
    {
      path: '/depiction/',
      name: 'depictionFilter',
      component: () => import('@/views/depictionFilter')
    },
    {
      path: '/iconography/',
      name: 'iconographyFilter',
      component: () => import('@/views/iconographyFilter')
    },
    {
      path: '/iconography/:id',
      name: 'iconography',
      component: () => import('@/views/iconography'),
      props: true
    },
    {
      path: '/bibliography/',
      name: 'bibliographyFilter',
      component: () => import('@/views/bibliographyFilter')
    },
    {
      path: '/bibliography/:id',
      name: 'bibliography',
      component: () => import('@/views/bibliography'),
      props: true
    },
    {
      path: '/cave/',
      name: 'caveFilter',
      component: () => import('@/views/caveFilter'),
      props: true
    },
    {
      path: '/cave/:id',
      name: 'cave',
      component: () => import('@/views/cave'),
      props: true
    },
  ]
})
