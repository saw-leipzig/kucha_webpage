import { api  }  from '@/traverser/install';
import {errorResponseHandler} from "@/utils/errorHandler"
import ls from 'local-storage'
import axios from 'axios';
import store from '../store'


//vue-plone-traverser is instanciating an axios instance, we use ist as 'httpClient'
export const httpClient = api;
export const ploneRoot = process.env.VUE_APP_PLONE_ROOT;
export const baseURL = process.env.VUE_APP_PLONE_API_URL_FULL;
export const CancelToken = axios.CancelToken;


const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

const validStatuses = [
  200, 201, 202, 203, 204,
  300, 301, 302, 303, 304
]

/*
 * Returns default headers list
 * which will be used with every request.
 */
export function getHeaders(multipart = false) {
  let defaultHeaders = DEFAULT_HEADERS

  if (multipart) {
    defaultHeaders = {}
  }

  if (ls.get('token')) {
    defaultHeaders = {
      'Authorization': `Bearer ${ls.get('token')}`,
      ...defaultHeaders
    }
  }

  return defaultHeaders
}

export function checkResponse(response) {
  if (validStatuses.includes(response.status)) {
    return response
  }

  // If not authorized then reset token
  // and redirect to login page
  if (response.status === 401) {
    ls.delete('token')
    //localStorage.removeItem('token')
    return Promise.reject(new Error('USER_ANONYMOUS'))
  }

  let err = new Error(response.statusText)
  err.response = response

  return Promise.reject(err)
}

export function get(uri, params = {}, source) {
  if(!source) {
    source = store.getters.cancelTokenSource
  }

  if(source)
  return httpClient.get(uri, {
    cancelToken: source.token,
    params: params,
    headers: getHeaders(),
    withCredentials: false
  })

 return httpClient.get(uri, {
    params: params,
    headers: getHeaders(),
    withCredentials: false
  })
}

export function post(uri, data) {
  return httpClient.post(uri, data, {
    headers: getHeaders(),
    withCredentials: false
  })
}


export function initialize() {

	httpClient.defaults.baseURL = baseURL;
	//httpClient.defaults.crossOrigin = true;
	httpClient.defaults.headers.common['Accept'] = 'application/json';
	httpClient.defaults.headers.common['Content-Type'] = 'application/json';

	//Vue.prototype.$http = httpClient;

	// apply interceptor on response
	httpClient.interceptors.response.use(
		response => response,
		errorResponseHandler
	);

/*	httpClient.interceptors.request.use(function (config) {
		//Vue.$log.debug('intercept request ', config)
		return config;
	}, function (error) {
		return Promise.reject(error);
	});*/
}
