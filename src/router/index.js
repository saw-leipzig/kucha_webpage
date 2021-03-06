import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import store from '../store'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login'),
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
      component: () => import('@/views/depictionFilter'),
      props: true
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
router.beforeEach((to, from, next) => {
  console.log(store.getters.getAuthenticated);
  if (store.getters.getAuthenticated){
    next()
  } else {
    if (to.name !== 'login') {
      next({
        name: "login"
      })
    } else {
      next()
    }
  }
})
export default router
