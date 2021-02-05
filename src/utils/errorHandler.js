import Vue from 'vue'
import store from '../store'
import EventBus from '@/utils/eventBus'
import router from '@/router'
import axios from 'axios'
import {  baseURL } from "@/utils/httpClient"
//import VueI18n from '@/plugins/i18n'

export function errorResponseHandler(error) {
     // check for errorHandle config -> e.g. axios.get('someapicall', {errorHandle: false}).
     // !!! custom config does not work at the moment, see https://github.com/axios/axios/issues/2203
     if( error.config && Object.prototype.hasOwnProperty.call(error.config, "errorHandle") && error.config.errorHandle === false ) {
         return Promise.reject(error);
       }

     if(  axios.isCancel(error) ) {
        //maybe there can be a Promise resolve? Is there any request, which needs to know that it was canceled?
         return Promise.reject(error);
       }

  // Error to handle
  if (error.response) {


     // The request was made and the server responded with a status code that falls out of the range of 2xx
    if (error.response.status === 401 ) {
      if(error.config.url.indexOf(baseURL + '/@users') != -1)
      {
        Vue.$log.debug('user profile loading failed');
        store.dispatch('logout');
      }
      else if(error.config.url.indexOf(baseURL + '/@login') != -1)
      {

        store.dispatch('logout');
      }
      /*else {
        Vue.$log.error(error.response.status, error.message);
        store.commit('setRouteBeforeError', router.currentRoute)
        // token is invalid meanwhile
        //TODO: is it possible that this resource is protected for this user and he shall not be logged out?
        store.dispatch('logout');
        router.push({name: "error", params: { id: error.response.status }})
      }*/
      //EventBus.$emit("showMessage", error.message)
    }

    if (error.response.status === 404 ) {

      // not found
      router.replace({name: "error", params: { id: error.response.status }})
      //EventBus.$emit("showMessage", error.message)

    }

    if (error.response.status === 503 ) {
      router.replace({name: "error", params: { id: error.response.status }})
      //EventBus.$emit("showMessage", "Something went wrong")
    }




  } else if (error.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */

     //happens, when preflighted request failes (e.g. 404 from API)
      Vue.$log.error(error.request);
      router.replace({name: "error", params: { id: 'unknown' }})
  } else {
      // Something happened in setting up the request and triggered an Error
      EventBus.$emit("showErrorMessage", "Something went wrong")
      Vue.$log.error('Error', error.message);
  }


  // anyway pass error down
  return Promise.reject(error);
}