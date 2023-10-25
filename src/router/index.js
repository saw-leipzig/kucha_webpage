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
      name: 'Depiction',
      component: () => import('@/views/depiction'),
      props: true
    },
    {
      path: '/pr/:id',
      name: 'Depiction',
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
      name: 'Iconography',
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
      name: 'Bibliography Entry',
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
      path: '/search/',
      name: 'Search',
      component: Home,
      props: { isSearch: true }
    },
    {
      path: '/cave/:id',
      name: 'Cave',
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
      path: '/news/',
      name: 'News',
      component: () => import('@/views/news'),
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
    {
      path: '/game/',
      name: 'Game',
      component: () => import('@/views/game'),
      props: true
    },
    { path: "/404",
      component:  () => import('@/views/pageNotFound'),
    },
    {
      // This is a hack to use :to tag for absolute paths.
      path: "/http*",
      beforeEnter: to => {
        window.open(to.fullPath.substring(1), '_blank');
      }
    },
    {
      path: "/:catchAll(.*)", // Unrecognized path automatically matches 404
      redirect: '/404',
    }
  ]
})
router.beforeEach((to, from, next) => {
  // console.log("url", to);
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
        href: to.fullPath.replace(to.params.id, ""),
      }
    )
    if (Object.keys(to.params).length > 0){
      breadcrumb.push(
        {
          text: to.name + ' Entry ' + to.params.id,
          disabled: false,
          href: to.fullPath,
        }
      )
    }
  } else {
    breadcrumb = []
  }
  console.log("setBreadcrumb", breadcrumb);
  if (breadcrumb.length === store.state.breadcrumb.lenth){
    let same = true
    for (let i = 0; i < breadcrumb.length; i++){
      if (breadcrumb[i].href !== store.state.breadcrumb[i].href){
        same = false
        break
      }
    }
    if (!same){
      console.log("neuer Eintrag nicht gleich!", breadcrumb, store.state.breadcrumb);
      store.commit("setBreadcrumb", breadcrumb)
    }
  }
  // console.log("new url", store.state.breadcrumb);
  console.log("to.name", to.name);
  if (to.name === 'Home' || to.name === 'News' || to.name === 'Login' || to.name === 'Game' || to.name === undefined){
    if (store.state.showMenu){
      console.log("not showing menu");
      store.commit("setShowMenu", false)
    }
  } else {
    if (!store.state.showMenu){
      store.commit("setShowMenu", true)
    }
  }
  // if (store.getters.getUser.granted){
  // } else {

  //   console.log("to", to.name);
  //   if (to.name === 'Home' || to.name === 'News' || to.name === "Game"){
  //     store.commit("setShowMenu", false)
  //     next()
  //   } else if (to.path.includes('http')){
  //     next()
  //   } else if (to.name !== 'login') {
  //     store.commit("setShowMenu", false)
  //     store.commit("setPrevVisited", to)
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
