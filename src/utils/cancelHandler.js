import router from '@/router'
import store from '../store'
//import Vue from 'vue'
import { setNewCancelToken } from '@/services/repository'

// initToken
setNewCancelToken();

/**
 * @function
 * at each route change: pending request have the cancelTokenSource from store, will be aborted and a new cancelToken is set
 */
router.beforeEach((to, from, next) => {
  let source = store.getters.cancelTokenSource

  if (source) {
    source.cancel('Cancel requests from '+ from.fullPath)
    setNewCancelToken();
  }

  next();

});