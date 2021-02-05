import router from '@/router'
import Vue from 'vue'
import ls from 'local-storage'
import store from '../store'




/**
 * @function
 * at each route change: check, if user has not logged out, but the token has expired
 */
router.beforeEach((to, from, next) => {

  let tokendate = ls.get('tokendate')

  if(tokendate) {
    let milliseconds = Date.now() - tokendate
    let minutes = Math.floor(milliseconds/1000/60)
    // token expires after 12 hours ... after 11 hours and 45 minutes send to logout (60*11 + 45 = 705)
    if(minutes > 705) {
      Vue.$log.debug('renew token or logout');
      store.dispatch('logout')
     }
    }

  next();

});