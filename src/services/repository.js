import axios from 'axios'
import store from '../store'
// helpers



// api calls
const auth = {
  username: "read_only_user",
  password: "kuchaReadOnly"
}
export function getDic() {
  return axios({
    url: store.state.URL + 'kucha_dic/_search',
    method: 'post',
    auth: auth,
    data: {
      "size" : 10000,
      "query": {
        "match_all" : {}
      },
      "_source": ["bibKeyWords.*", "location.*", "region.*", "districts.*", "ornaments.*", "iconography.*", "sites.*", "caveType.*", "wallLocation.*"]
    }
  })
}
export function getKuchaMapping() {
  return axios({
    url: store.state.URL + 'kucha_deep/_mapping',
    method: 'get',
    auth: auth,
    data: {
    }
  })
}
export function getDepictionStats() {
  return axios({
    url: store.state.URL + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: {
      "size":0,
      "aggs": {
        "genres": {
          "terms": { "field": "cave.site.siteID" }
        },
        "relatedAnnotationList": {
          "nested": {
            "path": "relatedAnnotationList"
          },
          "aggs": {
            "tags": {
              "nested": {
                "path": "relatedAnnotationList.tags"
              },
              "aggs": {
                "genres": {
                  "terms": { "field": "relatedAnnotationList.tags.root" }
                }
              }
            }
          }
        }
      }
    }
  })
}
export function getBibStats() {
  return axios({
    url: store.state.URL + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: {
      "size":0,
      "aggs": {
        "bibliography": {
          "filter":
          {
            "exists": {
              "field": "annotatedBibliographyID"
            }
          },
          "aggs":{
            "Annotated":{
              "terms": { "field": "annotation" }
            }
          }
        }
      }
    }
  })
}
export function postQuery(queryInput){
  return axios({
    url: store.state.URL + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: queryInput
  })
}

export function buildNestedQueries(mapping, path, queryWord){
  let results = []
  for ( var obj in mapping){
    if (mapping[obj].type === "nested"){
      var objPath = path
      if (objPath === ""){
        objPath = obj
      } else {
        objPath += "." + obj
      }
      var nested = {
        "nested": {
          "path": objPath,
          "query":{
            "query_string": {
              "lenient": true,
              "query": queryWord
            }
          }
        }
      }
      results.push(nested)
      var nestedQueries = buildNestedQueries(mapping[obj].properties, objPath, queryWord)
      for (let nestedQuery of nestedQueries){
        var subNested = {
          "nested": {
            "path": objPath,
            "query":{
            }
          }
        }
        subNested.nested.query = nestedQuery
        results.push(subNested)
      }
    }
  }
  return results
}

export function searchRoot(params, source) {
  var nestedQueries = buildNestedQueries(source, "", params.searchtext)
  var searchQuery = {
    "from" : params.batchStart,
    "query": {
      "bool": {
        "should" : [
          {
            "query_string": {
              "query" : params.searchtext
            }
          }
        ]
      }
    }
  }
  for (var nestedQuery of nestedQueries){
    searchQuery.query.bool.should.push(nestedQuery)
  }
  console.log("searchQuery", searchQuery);
  return axios({
    url: store.state.URL + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: searchQuery
  })
}
export function getItemById(params) {
  return axios({
    url: store.state.URL + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: {
      'query': {
        'multi_match': {
          'query': params.id,
          'fields': params.type
        }
      }
    }
  })
}
export function getDepictionByAnnotation(params) {
  console.log("params", params);
  return axios({
    url: store.state.URL + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: {
      "size": 2000,
      "query": {
        "nested": {
          "path": "relatedAnnotationList",
          "query": {
            "nested": {
              "path": "relatedAnnotationList.tags",
              "query": {
                "terms": {
                  "relatedAnnotationList.tags.iconographyID": params.iconographyID
                }
              }
            }
          }
        }
      }
    }
  })
}
export function getDepictionByBibliography(params) {
  return axios({
    url: store.state.URL + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: {
      "size": 2000,
      "query": {
        "nested": {
          "path": "relatedBibliographyList",
          "query": {
            "terms": {
              "relatedBibliographyList.annotatedBibliographyID": params.annotatedBibliographyID
            }
          }
        }
      }
    }
  })
}