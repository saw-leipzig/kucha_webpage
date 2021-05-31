import Vue from 'vue'
import Vuex from 'vuex'
import { getDic, getKuchaMapping } from '@/services/repository'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)


export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    authenticated: false,
    result: 0,
    results: {},
    dic: {},
    mapping: {},
    searchText:"",
    totalRes:0,
    searchPack:0,
    disableSearch:true,
    packageVersion: "© 2021 v 1.2.9",
    imgURL: "",
    URL: "",
  },
  mutations: {
    setImgURL (state, id) {
      state.imgURL = id
    },
    setURL (state, id) {
      state.URL = id
    },
    setAuthenticated (state, id) {
      state.authenticated = id
    },
    setResult (state, id) {
      state.result = id
    },
    setSearchText (state, txt){
      state.searchText = txt
    },
    setTotalRes (state, id){
      state.totalRes = id
    },
    setSearchPack (state, id){
      state.searchPack = id
    },
    setResults (state, payload){
      state.results = payload
    },
    setDics (state, payload){
      state.dic = payload
    },
    setMapping (state, payload){
      state.mapping = payload
    },
    setDisableSearch (state, payload){
      state.disableSearch = payload
    }
  },
  getters:{
    appVersion: (state) => {
      return state.packageVersion
    },
    getURL : state => {
      return state.URL
    },
    getImgURL : state => {
      return state.imgURL
    },
    getAuthenticated : state => {
      return state.authenticated
    },
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
    },
    getMapping : state => {
      return state.mapping
    },
    getDisableSearch : state => {
      return state.disableSearch
    }
  },
  actions: {
    getDics: (context) => {
      getDic()
        .then( res => {
          console.log("recieved dic result.", res)
          let dic = res.data.hits.hits[0]._source
          context.commit('setDics', dic);
          console.log(dic)
        }).catch(function (error) {
          console.log(error)
          return null
        })
    },
    getMapping: (context) =>{
      getKuchaMapping()
        .then(res=> {
          context.commit('setMapping', res.data.kucha_deep.mappings.properties);
        }).catch(function (error) {
          console.log(error)
          return null
        })
    }
  }



})
