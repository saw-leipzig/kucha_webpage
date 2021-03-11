import axios from 'axios'
// helpers



// api calls

export function getDic() {
  return axios({
    url: 'http://127.0.0.1:9200/kucha_dic/_search',
    method: 'post',
    data: {
      "size" : 10000,
      "query": {
        "match_all" : {}
      },
      "_source": ["location.*", "region.*", "districts.*", "ornaments.*", "iconography.*", "sites.*", "annotatedBibliography.*", "caveType.*", "wallLocation.*"]
    }
  })
}
export function getKuchaMapping() {
  return axios({
    url: 'http://127.0.0.1:9200/kucha_deep/_mapping',
    method: 'get',
    data: {
    }
  })
}
export function getDepictionStats() {
  return axios({
    url: 'http://127.0.0.1:9200/kucha_deep/_search',
    method: 'post',
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
    url: 'http://127.0.0.1:9200/kucha_deep/_search',
    method: 'post',
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
    url: 'http://127.0.0.1:9200/kucha_deep/_search',
    method: 'post',
    data: queryInput
  })
}

function buildNestedQueries(mapping, path, queryWord){
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
    url: 'http://127.0.0.1:9200/kucha_deep/_search',
    method: 'post',
    data: searchQuery
  })
}
export function getItemById(params) {
  console.log("params", params);
  return axios({
    url: 'http://127.0.0.1:9200/kucha_deep/_search',
    method: 'post',
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
    url: 'http://127.0.0.1:9200/kucha_deep/_search',
    method: 'post',
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
    url: 'http://127.0.0.1:9200/kucha_deep/_search',
    method: 'post',
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