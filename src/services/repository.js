import { get, post, httpClient, baseURL, CancelToken } from "@/utils/httpClient";
import store from '../store'
import axios from 'axios'
  //helpers
export const resourceLocation = "/orte";
export const resourceInstitutions = "/institutionen";
export const resourceProjekte = "/projekte";
export const resourcePublicationsSources ='/publikationen-quellen'
export const resourceSources ='/publikationen-quellen/quellen'
export const resourcePublications ='/publikationen-quellen/publikationen'
export const resourcePerson ='/personen'
export const resourceObjectByUID ='/resolveuid'
export const resourceArchiveStats ='/@@archivestats'
export const tax_OUTypes='/@vocabularies/collective.taxonomy.ou_types'
export const tax_researchFields='/@vocabularies/collective.taxonomy.research_fields'


 //api calls

export function setNewCancelToken() {
  let source = CancelToken.source()
  store.commit('setCancelTokenSource', source)
}


export function getBreadcrumbsByFullPathId(fullPathId) {
  return get(fullPathId + '/@breadcrumbs');
}

export function getItemByFullPathId(fullPathId, metadata_fields) {
  var params = new URLSearchParams();
  params.append('b_size', 10000)
  if(metadata_fields) {
    params.append('metadata_fields', metadata_fields)
  }

  return get(fullPathId, params);
}

export function getItemByFullPathIdBreadcrumbs(fullPathId) {
    var params = new URLSearchParams();
    params.append('b_size', 10000)
    params.append('expand', 'breadcrumbs')

  return get(fullPathId, params);
}

export function ObjectByUID(uid) {
 let params= {
          fullobjects: 1,
          b_size: 1000
        }
  return get(`${resourceObjectByUID}/${uid}`, params);
}


 export function getMainNavigation() {
  let source = CancelToken.source()
  var params = new URLSearchParams();
  params.append('expand.navigation.depth', 2)
  return get('@navigation', params, source)
}

 export function getSiteActions() {
   let source = CancelToken.source()
  return get('@actions', {}, source)
}

export function getRelations(fullPathId) {
  let params = new URLSearchParams();
  params.append('metadata_fields', 'getParentTitle')
  params.append('metadata_fields', 'hierarchical_title')
  return get(fullPathId, params);
}

export function getRelationsAsSearch() {
  let params= {
    portal_type: 'person_relationship',
    fullobjects: 1,
    b_size: 10000
  }
  return get('@search', params);
}

export function getAllPersonRelationships() {
  return get('@person_relationships');
}

export function login(credentials) {
  return post('@login', credentials)

}

export function renewToken() {
  return post('@login-renew')
}

export function getUserProfile(user) {
 //   let source = CancelToken.source()
 return get('@users/'+user)
}

export function getLocationsForLeaflet() {
  var params = new URLSearchParams();
  params.append('metadata_fields', 'latitude')
  params.append('metadata_fields', 'longitude')
  params.append('b_size', 10000)
  return get(`${resourceLocation}`, params);
}

export function getPublication(id) {
  var params = new URLSearchParams();
  params.append('metadata_fields', 'hierarchical_title')
  return get(`${resourcePublications}/${id}`, params);
}

export function getPublicationFull(id) {
  var params = new URLSearchParams();
  params.append('b_size', 10000)
  params.append('fullobjects', 1)
  params.append('metadata_fields', 'hierarchical_title')
  return get(`${resourcePublications}/${id}`, params);
}

export function getSource(id) {
  var params = new URLSearchParams();
  params.append('metadata_fields', 'hierarchical_title')
  return get(`${resourceSources}/${id}`, params);
}

export function getPublicationsStats() {
   let params = {
    b_size: 1
  };
  return get(`${resourcePublications}`, params);
}

export function getSources() {
   let params = {
    b_size: 10000,
  };

  return get(`${resourceSources}`, params);
}

export function getSourcesStats() {
   let params = {
    b_size: 1
  };

  return get(`${resourceSources}`, params);
}

export function getPersons() {
   let params = {
    b_size: 10000
  };

  return get(`${resourcePerson}`, params);
}

export function getPersonsStats() {
   let params = {
    b_size: 1
  };
  return get(`${resourcePerson}`, params);
}

export function getArchiveStats() {
  let params = {};
  return get(resourceArchiveStats, params);
}

export function loginToBackendForCookie(credentials) {
  let formData = new FormData();
  formData.append("__ac_name", credentials.login);
  formData.append("__ac_password", credentials.password);

  //this is for login Plone 5.1.6.
  formData.append("form.submitted", 1);
  //this is for login Plone 5.2.1
  formData.append("buttons.login", 1);
  return httpClient.post(baseURL+"/login_form", formData, { errorHandle: false, headers: { "Accept" : "text/html"}, withCredentials: false})
}

export function sendFeedback(email = {}) {

  return httpClient.post(baseURL+"/@email-notification ", email, { errorHandle: false, withCredentials: false})
}


export function logoutfromBackend() {
  return httpClient.get(baseURL+"/logout", { errorHandle: false, headers: { "Accept" : "text/html"}, withCredentials: false})
}

export function getPerson(id) {
  var params = new URLSearchParams();
  params.append('metadata_fields', 'latitude')
  params.append('metadata_fields', 'longitude')
  params.append('metadata_fields', 'hierarchical_title')
  params.append('b_size', 10000)
  params.append('fullobjects', 1)

  return get(`${resourcePerson}/${id}`, params);
}

export function searchPubsAndSources(params) {
   return get('publikationen-quellen/@search', params)
}

export function getDic() {
  console.log("sarted getting Dics")
  return axios({
    url: 'http://127.0.0.1:9200/kucha_dic/_search',
    method: 'post',
    data: {
            "size" : 10000,
            "query": {
            "match_all" : {}
          },
          "_source": ["iconography.*"]
    }

  })
}

export function searchRoot(params, source) {
    console.log("sarted Search",params,source)
    return axios({
      url: 'http://127.0.0.1:9200/kucha_drop/_search',
      method: 'post',
      data: {
        query: {
          'simple_query_string': {
            'query': params,
            'default_operator': 'and' }
        }
      }

    })

//    .then(response => {
//      console.log(response)
//      return response.data.hits.hits
//    }).catch(function (error) {
//      console.log(error)
//      return null
//    })
   
}

export function search(path, params) {

   return get(path+'/@search', params)
}

export function getLocation(id) {
  return get(`${resourceLocation}/${id}`);
}

export function getLocationRelations(id) {
  return get(`${resourceLocation}/${id}/@relations`);
}

export function getInstituteRelations(id) {
  return get(`${resourceInstitutions}/${id}/@relations`);
}

export function getAllPersonsFull() {
  var params = new URLSearchParams();
  params.append('b_size', 10000)
  //params.append('fullobjects', 1)

  return get(`${resourcePerson}`, params);
}

/*export function getPersonsFactsWithLocations() {
  var params = new URLSearchParams();
  params.append('portal_type', 'person_birthplace')
  params.append('portal_type', 'person_gravesite')
  params.append('portal_type', 'person_placeofdeath')
  params.append('portal_type', 'person_placeofactivity')
  params.append('metadata_fields', 'latitude')
  params.append('metadata_fields', 'longitude')
  params.append('b_size', 10000)
  params.append('fullobjects', 1)
  return get('/@search', params);
}*/

export function getPersonsFactsWithLocations() {
  var params = new URLSearchParams();
  params.append('metadata_fields', 'latitude')
  params.append('metadata_fields', 'longitude')
  return get('/@person_places', params);
}

export function getSomePortraits() {
  var params = new URLSearchParams();
  params.append('portal_type', 'picture')
  params.append('b_size', 20)
  params.append('fullobjects', 1)
  return get('/@search', params);
}

export function getTaxonomie_OUTypes() {
  let params = {
    b_size: 10000
  };
  return get(tax_OUTypes, params);
}

export function getTaxonomie_ResearchFields() {
  let params = {
    b_size: 10000
  };
  return get(tax_researchFields, params);

}

export function getPermaLinkAdress(uuid) {
 let params = {
    UID: uuid
  };
  return get('/@resolver', params);
}

export function getBeaconLists() {
  let params = {
    b_size: 1
  };
  return get(resourcePerson, params);
}
