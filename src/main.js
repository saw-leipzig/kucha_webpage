import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import vuetify from './plugins/vuetify'
import router from './router'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import hideRelatedItems from '@/components/hideRelatedItems.vue'
import store from './store'
import '../static/annotorious.min.css'
import lineClamp from 'vue-line-clamp'
import VueLogger from 'vuejs-logger';
import VueHead from 'vue-head'


window.$ = require("jquery");
window.jQuery = require("jquery");
const isProduction = process.env.NODE_ENV === 'production';
const options = {
  isEnabled: true,
  logLevel : isProduction ? 'error' : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
};

Vue.use(VueHead)
Vue.use(VueLogger, options);
Vue.config.productionTip = false
Vue.use(lineClamp, {
  // plugin options
})

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