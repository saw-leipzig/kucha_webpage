import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'
import router from './router'
import Vuex from 'vuex'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import createPersistedState from 'vuex-persistedstate'
import { getDic } from '@/services/repository'
import openseadragon from 'openseadragon'
Vue.config.productionTip = false

Vue.use(VueAxios, axios)

Vue.use(Vuex)
const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    result: 0,
    results: {},
    dic: {},
    searchText:"",
    totalRes:0,
    searchPack:0
  },
  mutations: {
    setResult (state,id) {
      state.result=id
    },
    setSearchText (state,txt){
      state.searchText=txt
    },
    setTotalRes (state,id){
      state.totalRes=id
    },
    setSearchPack (state,id){
      state.searchPack=id
    },
    setResults (state,payload){
      state.results=payload
    },
    setDics (state,payload){
      state.dic=payload
    }
  },
  getters:{
    getSearchText : state => {
      return state.searchText
    },
    getTotalRes : state => {
      return state.totalRes
    },
    getsearchPack : state => {
      return state.searchPack
    },
    getResult : state => {
      return state.result
    },
    getResults : state => {
      return state.results
    },
    getDics : state => {
      return state.dic
    }
  },
  actions: {
    getDics: (context) => {
      getDic()
      .then( res => {
        console.log("recieved dic result.",res)
        let dic = res.data.hits.hits[0]._source
//          this.previousUrl = res.data.batching? res.data.batching.prev : null
//          this.nextUrl = res.data.batching? res.data.batching.next : null
        context.commit('setDics', dic);
        console.log(dic)
      }).catch(function (error) {
        console.log(error)
        return null
      })
    }
  }

})
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
