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
      path: '/cave/:id',
      name: 'cave',
      component: () => import('@/views/cave'),
      props: true 
    },
  ]
})
