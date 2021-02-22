import { ploneRoot, baseURL } from "@/utils/httpClient";
import { defaultQueryParams } from "@/utils/constants";
import joinPath from 'path.join';
import { buildBaseUrl } from 'vue-matomo/src/utils'
import  router  from '../router'


export function checkImageUrl(url) {
  let correctImageFormat = new RegExp(/.*\.(?:png|jpg|jpeg|gif)/, "i");
  return url.match(correctImageFormat)

}

export function getURLFromRouteObject(routeObject) {
  let url = routeObject.path
  let params = []
  if (routeObject.params) {
    for (let [key, value] of Object.entries(routeObject.params)) {
      if(Array.isArray(value)) {
        value.forEach( v =>  params.push(key + '=' + v))
      }
      else {
        params.push(key + '=' + value)
      }
    }
    url += '?' + params.join('&')
  }
  return url
}

export function getDefaultQueryParams(modulespecific_params) {
  let merged = Object.assign({}, defaultQueryParams, modulespecific_params)
  return merged
}

export function getItemIdFromUrl(url) {
  let id = url.split('/').pop();
  if('/'+id===ploneRoot) id=""
  return id;
}

export function routeToDetail(ploneId) {
       // let ploneId = item["@id"];
        let itemId = ploneId.split('/').pop();
        let path = this.$route.fullPath + '/' + itemId;
        this.$router.push({ path: path});
    }

export function removeQueryfromPloneId(ploneId) {
  const uri = new URL(ploneId)
  return uri.origin+uri.pathname;
}

export function getAbsoluteApiURL(path) {
  return baseURL+path;
}

 export function createFrontendLink(ploneId) {
  console.log("ploneID",ploneId)
  let link = window.location+"/depiction/"
  if (ploneId){
    link = window.location+"/depiction/"+ploneId.toString()
  }
  console.log('created Link: ',link)
  const path = new URL(link);
  return link;
}
