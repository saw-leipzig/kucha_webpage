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

export function searchRoot(params, source) {
  return axios({
    url: 'http://127.0.0.1:9200/kucha_flat/_search',
    method: 'post',
    data: {
      "from":params.batchStart,
      query: {
        'simple_query_string': {
          'query': params.searchtext,
          'default_operator': 'and'
        }
      }
    }
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