import Vue from 'vue'
import Vuex from 'vuex'
import {login, loginToBackendForCookie, logoutfromBackend, getAllPersonRelationships, getLocationsForLeaflet, getBeaconLists} from '@/services/repository'
import ls from 'local-storage'

Vue.use(Vuex)

const persistDataPlugin = store => {

  store.subscribe((mutation, state) => {
   if (mutation.type === 'auth_success' || mutation.type === 'logout') {
     ls.set('auth-state', state.status)
      }
  })
}

export default new Vuex.Store({
  plugins: [persistDataPlugin],
  state: {
    loading: false,
    activeFact: null,
    activeSource: null,
    beacon_lists: null,
    personsWithLocationFacts: [],
    locationFactsGeneralized: [],
    personRelationships: [],
    locations: [],
    routeBeforeError:' ',
    status: ls.get('token') != undefined? 'success':'',
    user: ls.get('user'),
    userObject: null,
    token: ls.get('token'),
    tokendate: ls.get('tokendate'),
    searchMode: 'explore',
    searchResults: {},
    searchQuery:{},
    searchListLink: null,
    listRunner: true,
    cancelTokenSource: undefined,
    theme_dark: ls.get('theme_dark') != undefined? ls.get('theme_dark') : true,
    viewSettings: {
      locations: {
        tab: 'tab-list',
      },
      projects: {
        tab: null,
      },
      ous: {
        tab: null,
      },
      persons: {
        tab: 'tab-list',
      },
      personDetail: {
        tab: 'tab-2',
      },
      publications_sources: {
        tab: 'tab-list',
      },
      publications: {
        tab: 'tab-list',
      },
      sources: {
        tab: 'tab-list',
      }
    }
  },
  mutations: {
    updateViewSetting (state, object) {
      if(object)
        state.viewSettings = {...state.viewSettings, ...object }
    },
    setSearchQueryParams (state, queryParams) {
     // this._vm.$log.debug('hit', queryParams.b_start)
      queryParams ? state.searchQuery = queryParams : state.searchQuery = null
    },
    refreshSearchQuery(state) {
      let deepCopy = Object.assign({}, state.searchQuery)
      this.commit('setSearchQueryParams', deepCopy)
    },
    setSearchListLink (state, fullpath) {
      //this._vm.$log.debug('hit', queryParams.b_start)
      fullpath ? state.searchListLink = fullpath : state.searchListLink = null
    },
    setBeaconLists (state, payload) {

      state.beacon_lists = {}
      state.beacon_lists.viplist = payload.viplist
      state.beacon_lists.blacklist = payload.blacklist
    },
    setSearchResults (state, results) {
      results ? state.searchResults = results : state.searchResults = null
    },
    setSearchMode (state, mode) {
      mode ? state.searchMode = mode : state.searchMode = null
    },
    setActiveFact (state, fact) {
      fact ? state.activeFact = fact : state.activeFact = null
    },
    setActiveSource (state, source) {
      source ? state.activeSource = source : state.activeSource = null
    },
    setPersonRelationships (state, relations) {
      state.personRelationships = relations
    },
    setLocations (state, locations) {
      state.locations = locations
    },
    setSources (state, sources) {
      state.sources = sources
    },
    setCancelTokenSource (state, cancelTokenSource) {
      cancelTokenSource ? state.cancelTokenSource = cancelTokenSource : state.cancelTokenSource = null
    },
    setTokenDate(state, tokendate) {
      state.tokendate = tokendate
    },
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, pl) {
      state.status = 'success'
      state.token = pl.token
      state.user = pl.user;
      state.tokendate = pl.tokendate

       //delete cache items
      state.personsWithLocationFacts = []
      state.locationFactsGeneralized = []
      state.personRelationships = []
      state.locations = []
      state.searchResults = []
      state.beacon_lists = null
    },
    auth_error(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = 'loggedout'
      state.token = ''
      state.user = ''
      state.tokendate = 0

      //delete cache items
      state.personsWithLocationFacts = []
      state.locationFactsGeneralized = []
      state.personRelationships = []
      state.locations = []
      state.searchResults = []
      state.beacon_lists = null
    },
    refreshAuthLocalStore(state) {
      state.status = ls.get('auth-state')
      state.token = ls.get('token')
      state.user = ls.get('user');
      state.tokendate = ls.get('tokendate');
    },
    setRouteBeforeError(state, pl) {
      state.routeBeforeError = pl
    },
    setPersonsWithLocationFacts(state, pl) {
      state.personsWithLocationFacts = pl
    },
     setLocationFactsGeneralized(state, pl) {
      state.locationFactsGeneralized = pl
    },
     setUserObject(state, pl) {
      state.userObject = pl
    },
    switchTheme(state) {
      state.theme_dark = !state.theme_dark
      ls.set('theme_dark', state.theme_dark)
    }
  },
  getters: {
    appVersion: (state) => {
      return state.packageVersion
    },
    isAuthenticated: (state) => {
     return state.token !== undefined && state.status  == 'success'
    },
    isAuthenticatedAndHasWriteRights: (state, getters) => {
     return getters.isAuthenticated
    },
    listRunner: state => state.listRunner,
    searchQuery: state => state.searchQuery,
    searchMode: state => state.searchMode,
    personRelationships: state =>  {
      return state.personRelationships;
    },
    locations: state =>  {
      return state.locations;
    },
    cancelTokenSource: state => state.cancelTokenSource,
    tokendate: state => state.tokendate,
    theme_dark: state => state.theme_dark
  },
  actions: {

    login({commit}, credentials){
    return new Promise((resolve, reject) => {
        commit('auth_request');
        login(credentials)
        .then(resp => {
          const token = resp.data.token;
          const user = credentials.login;
          ls.set('user', user)
          ls.set('token', token)
          let timestamp = Date.now()
          ls.set('tokendate', timestamp)
          commit('auth_success', { token: token, user: user, tokendate: timestamp});
          commit('refreshSearchQuery')
          if(this._vm.$matomo) {
            this._vm.$matomo.setUserId(user)
            this._vm.$matomo.trackEvent('Authorization', 'login', 'success', user)
          }
          loginToBackendForCookie(credentials)
          .catch(err => {
            this._vm.$log.error(err, 'backend cookie writing failed')
          })
          resolve()
        })
        .catch(err => {
          commit('auth_error')
          this._vm.$log.error('auth_error', err )
           if(this._vm.$matomo) {
            this._vm.$matomo.trackEvent('Authorization', 'login', 'failed', credentials.login)
          }
          ls.remove('token')
          ls.remove('user')
          reject(err)
        })
      })

    },

    logout({ commit }, userInitiated=false) {
      return new Promise((resolve) => {
        ls.remove('token')
        ls.remove('user')
        ls.remove('tokendate')
        commit('logout')
        if(this._vm.$matomo) {
          if(userInitiated) {
            this._vm.$matomo.trackEvent('Authorization', 'logout', 'user')
          }
          else {
            this._vm.$matomo.trackEvent('Authorization', 'logout', 'app')
          }
          this._vm.$matomo.resetUserId()
        }
        logoutfromBackend()
          .catch(err => {
            this._vm.$log.error(err, 'logging out from backend failed')
          })
        resolve();
      })
    },

    loadPersonRelationships(context) {
      return new Promise((resolve, reject) => {
        if (context.state.personRelationships.length === 0) {
          getAllPersonRelationships()
          .then(res => {
            context.commit('setPersonRelationships', res.data.items)
            resolve()
          })
          .catch(err => {
            this._vm.$log.error(err, 'person relationsships loading error')
            reject()
          })
        }
        else {
          resolve()
        }
      })
    },

    loadLocations(context) {
      return new Promise((resolve, reject) => {
        if (context.state.locations.length === 0) {
          getLocationsForLeaflet()
          .then(res => {
            context.commit('setLocations', res.data.items)
             resolve()
          })
          .catch(err => {
            this._vm.$log.error(err, 'locations loading error')
            reject()
          })
        }
        else {
          resolve()
        }
      })
    },

    loadBeaconLists(context) {
      return new Promise((resolve, reject) => {
        if (context.state.beacon_lists == null) {
          getBeaconLists()
          .then(res => {
            context.commit('setBeaconLists', { blacklist: res.data.seealso_black_list, viplist: res.data.seealso_vip_list}  )
             resolve()
          })
          .catch(err => {
            this._vm.$log.error(err, 'beacon lists loading error')
            reject()
          })
        }
        else {
          resolve()
        }
      })
    }



  }
})
