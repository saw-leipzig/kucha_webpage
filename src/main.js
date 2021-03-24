import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'
import router from './router'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import hideRelatedItems from '@/components/hideRelatedItems.vue'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

Vue.component("hideRelatedItems", hideRelatedItems)
new Vue({
  axios,
  vuetify,
  router,
  store,
  data: {
    show: false
  },
  render: h => h(App)
}).$mount('#app')