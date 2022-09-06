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
      path: '/pr/:id/annotation/:annotoriousID',
      name: 'Depiction Entry',
      component: () => import('@/views/depiction'),
      props: true
    },
    {
      path: '/pr/:id',
      name: 'Depiction Entry',
      component: () => import('@/views/depiction'),
      props: true
    },
    {
      path: '/pr/',
      name: 'Depiction',
      component: () => import('@/views/depictionFilter'),
      props: true
    },
    {
      path: '/iconography/',
      name: 'Iconography',
      component: () => import('@/views/iconographyFilter')
    },
    {
      path: '/iconography/:id',
      name: 'Iconography Entry',
      component: () => import('@/views/iconography'),
      props: true
    },
    {
      path: '/bibliography/',
      name: 'Bibliography',
      component: () => import('@/views/bibliographyFilter')
    },
    {
      path: '/bibliography/:id',
      name: 'bibliography Entry',
      component: () => import('@/views/bibliography'),
      props: true
    },
    {
      path: '/cave/',
      name: 'Cave',
      component: () => import('@/views/caveFilter'),
      props: true
    },
    {
      path: '/cave/:id',
      name: 'Cave Entry',
      component: () => import('@/views/cave'),
      props: true
    },
    {
      path: '/impressum/',
      name: 'Impressum',
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
      name: 'About the Project',
      component: () => import('@/views/about'),
      props: true
    },
    { path: "*",
      component:  () => import('@/views/pageNotFound'),
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log("url", to);
  let breadcrumb = [
    {
      text: 'Home',
      disabled: false,
      href: '/',
    },
  ]
  if (to.path !== "/"){
    breadcrumb.push(
      {
        text: to.name,
        disabled: false,
        href: to.fullPath,
      }
    )
    if (Object.keys(to.params).length > 0){
      breadcrumb.push(
        {
          text: to.name + ' ' + to.params.id,
          disabled: false,
          href: to.fullPath,
        }
      )
    }
  } else {
    breadcrumb = []
  }
  store.commit("setBreadcrumb", breadcrumb)
  console.log("new url", store.state.breadcrumb);

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
