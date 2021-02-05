import { ploneRoot, baseURL } from "@/utils/httpClient";
import { defaultQueryParams } from "@/utils/constants";
import { resourceLocation, resourceInstitutions, resourceProjekte, resourcePublicationsSources, resourceSources, resourcePublications,resourcePerson } from "@/services/repository";
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
  console.log(window.location)
  let link = window.location.protocol+"//"+window.location.host+"/depiction/"+ploneId.toString()
  console.log('created Link: ',link)
  const path = new URL(link);
  return link;
}

export function getParentId(childId) {
  if(!childId)
    return null

  let parentId = childId;
  let li = childId.lastIndexOf('/')
  if(li !== -1 )
    parentId = childId.substring(0,li)
//console.log(parentId)
      return parentId
}

export function isRootURL(url) {
  let rootpathes = [ resourceLocation, resourceInstitutions, resourceProjekte, resourcePublicationsSources, resourceSources, resourcePublications,resourcePerson]
  for(let i = 0; i< rootpathes.length; i++) {
    if(url == getAbsoluteApiURL(rootpathes[i])) {
      return true
    }
  }
  return false
}

export function getFullUrlMatomo(route) {
  const baseUrl = buildBaseUrl({'router': router})
  const baseUrlHasSlash = baseUrl.slice(-1) === '/'
  const url = baseUrl + (baseUrlHasSlash ? route.fullPath.replace(/^\//, '') : route.fullPath)
  return url
}

export function routerSettingAwareRelativePath(path) {
  if(router.mode == 'hash')
    return '/#'+ path
  else
    return path
}
