import router from '@/router'
//import Vue from 'vue'
import { setNewCancelToken } from '@/services/repository'

// initToken
setNewCancelToken();

/**
 * @function
 * at each route change: pending request have the cancelTokenSource from store, will be aborted and a new cancelToken is set
 */
