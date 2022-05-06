import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
// import store from '../store'

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
      path: '/pr/:id/annotation/:annotoriousID',
      name: 'depiction',
      component: () => import('@/views/depiction'),
      props: true
    },
    {
      path: '/pr/:id',
      name: 'depiction',
      component: () => import('@/views/depiction'),
      props: true
    },
    {
      path: '/pr/',
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
    {
      path: '/impressum/',
      name: 'impressum',
      component: () => import('@/views/impressum'),
      props: true
    },
    {
      path: '/tour/',
      name: 'Virtuel Tour',
      component: () => import('@/views/tour'),
      props: true
    },
    {
      path: '/forum/',
      name: 'Forum for Dating Questions',
      component: () => import('@/views/forumFilter'),
      props: true
    },
    {
      path: '/about/',
      name: 'About the project',
      component: () => import('@/views/about'),
      props: true
    },
  ]
})
router.beforeEach((to, from, next) => {
  // console.log(store.getters.getAuthenticated);
  // if (store.getters.getAuthenticated){
  //   next()
  // } else {
  //   if (to.name !== 'login') {
  //     next({
  //       name: "login"
  //     })
  //   } else {
  //     next()
  //   }
  // }
  next()
})
export default router
