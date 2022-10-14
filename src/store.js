import Vue from 'vue'
import Vuex from 'vuex'
import {getKuchaDiscussionMapping, getKuchaMapping, getDictionary} from '@/services/repository'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)


export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    breadcrumb:[
      {
        text: 'Home',
        disabled: false,
        href: '/',
      },
    ],
    authenticated: false,
    result: 0,
    results: {},
    iconography: {},
    bibKeywords:[],
    caveTypes:[],
    sites:[],
    districts:[],
    regions:[],
    locations:[],
    wallLocation:[],
    mapping: {},
    discussionMapping: {},
    searchText:"",
    totalRes:0,
    searchPack:0,
    disableSearch:true,
    packageVersion: "© 2021 v 1.2.9",
    imgURL: "",
    URL: "",
    user: {},
    prevVisited: "",
  },
  mutations: {
    setBreadcrumb(state, payload){
      state.breadcrumb = payload
    },
    setUser(state, payload){
      state.user = payload
    },
    setWallLocation(state, payload){
      state.wallLocation = payload
    },
    setCaveTypes(state, payload){
      state.caveTypes = payload
    },
    setSites(state, payload){
      state.sites = payload
    },
    setRegions(state, payload){
      state.regions = payload
    },
    setDistricts(state, payload){
      state.districts = payload
    },
    setIconography(state, payload){
      state.iconography = payload
    },
    setBibKeywords(state, payload){
      state.bibKeywords = payload
    },
    setLocations(state, payload){
      state.locations = payload
    },
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
    setMapping (state, payload){
      state.mapping = payload
    },
    setDiscussionMapping (state, payload){
      state.discussionMapping = payload
    },
    setDisableSearch (state, payload){
      state.disableSearch = payload
    },
    setPrevVisited(state, payload){
      state.prevVisited = payload
    }
  },
  getters:{
    getBreadcrumb: (state) => {
      return state.breadcrumb
    },
    getUser: (state) => {
      return state.user
    },
    appVersion: (state) => {
      return state.packageVersion
    },
    getWallLocation: state => {
      return state.wallLocation
    },
    getCaveTypes: state => {
      return state.caveTypes
    },
    getDistricts: state => {
      return state.districts
    },
    getRegions: state => {
      return state.regions
    },
    getSites: state => {
      return state.site
    },
    getBibKeyWords: state => {
      return state.bibKeywords
    },
    getLocations: state => {
      return state.locations
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
    getMapping : state => {
      return state.mapping
    },
    getDiscussionMapping : state => {
      return state.discussionMapping
    },
    getDisableSearch : state => {
      return state.disableSearch
    },
    getPrevVisited : state => {
      return state.prevVisited
    }
  },
  actions: {
    getWallLocation(context){
      getDictionary('wallTree')
        .then(res=> {
          context.commit('setWallLocation', res.data._source.wallTree);
        }).catch(function (error) {
          console.log(error)
          return null
        })
    },
    getLocations(context){
      getDictionary('locations')
        .then(res=> {
          context.commit('setLocations', res.data._source.locations);
        }).catch(function (error) {
          console.log(error)
          return null
        })
    },
    getCaveTypes(context){
      getDictionary('caveTypes')
        .then(res=> {
          context.commit('setCaveTypes', res.data._source.caveTypes);
        }).catch(function (error) {
          console.log(error)
          return null
        })
    },
    getDistricts(context){
      getDictionary('districts')
        .then(res=> {
          context.commit('setDistricts', res.data._source.districts);
        }).catch(function (error) {
          console.log(error)
          return null
        })
    },
    getRegions(context){
      getDictionary('regions')
        .then(res=> {
          context.commit('setRegions', res.data._source.regions);
        }).catch(function (error) {
          console.log(error)
          return null
        })
    },
    getSites(context){
      getDictionary('sites')
        .then(res=> {
          let sites = res.data._source.sites
          sites.push({
            siteID: 0,
            name: "unknown"
          })
          context.commit('setSites', sites);
        }).catch(function (error) {
          console.log(error)
          return null
        })
    },
    getBibKeyWords(context){
      getDictionary('bibKeywords')
        .then(res=> {
          context.commit('setBibKeywords', res.data._source.bibKeywords);
        }).catch(function (error) {
          console.log(error)
          return null
        })
    },
    getIconography(context){
      console.log("initiated getIconography");
      getDictionary('iconographyTree')
        .then(res=> {
          console.log("getIconography", res);
          function setChecked(item) {
            item['checked'] = false
            for (let child of item.children){
              setChecked(child)
            }
          }
          let iconography = res.data._source.iconography
          for (let root of iconography){
            setChecked(root)
          }
          context.commit('setIconography', iconography);
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
    },
    getDiscussionMapping: (context) =>{
      getKuchaDiscussionMapping()
        .then(res=> {
          context.commit('setDiscussionMapping', res.data.kucha_discussion.mappings.properties);
        }).catch(function (error) {
          console.log(error)
          return null
        })
    }
  }



})
