import axios from 'axios'
// helpers



// api calls
const auth = {
  username: "read_only_user",
  password: "kuchaReadOnly"
}
export function getDictionary(name){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_dic/_doc/' + name,
    method: 'get',
    auth: auth,
    data: {
    }
  })
}
export function regUser(firstname, surname, email, affiliation){
  return axios({
    url: process.env.VUE_APP_USERREG + 'resource?registerrequest',
    method: 'post',
    auth: auth,
    data: {
      "firstname": firstname,
      "lastname": surname,
      "email": email,
      "affiliation": affiliation
    }
  })
}
export function validateUser(email, pw){
  return axios({
    url: process.env.VUE_APP_USERREG + 'resource?validateUser',
    method: 'post',
    auth: auth,
    data: {
      "email": email,
      "sessionID": pw
    }
  })
}
export function isLoggedIn(sessionID){
  return axios({
    url: process.env.VUE_APP_USERREG + 'resource?isLoggedIn',
    method: 'post',
    auth: auth,
    data: {
      "sessionID": sessionID
    }
  })
}
export function changeUserData(userdata, oldmail, oldPW){
  return axios({
    url: process.env.VUE_APP_USERREG + 'resource?changeUser',
    method: 'post',
    auth: {
      'username':oldmail,
      'password': oldPW
    },
    data: userdata
  })
}
export function putComments(data, uuid, sendMail, sessionID, text){
  return axios({
    url: process.env.VUE_APP_USERREG + 'resource?putComment&uuid=' + uuid + '&sendMail=' + sendMail + '&sessionID=' + sessionID + '&message=' + text,
    method: 'PUT',
    headers: {
      "Content-Type": "application/json; utf-8"
    },
    auth: auth,
    data: data
  })
}
export function getPRList(){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
    method: 'Post',
    auth: auth,
    data: {
      "size": 4000,
      "_source": {
        "exclude": [
          "cave.wallList",
          "cave.preservationClassification",
          "cave.caveAreaList",
          "cave.caveSketchList",
          "relatedAnnotationList",
          "relatedImages",
          "description",
          "positionNotes",
          "relatedIconographyList",
          "relatedBibliographyList"
        ]
      },
      "query": {
        "exists": {
          "field": "depictionID"
        }
      }
    }
  })
}
export function getBiblioList(){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
    method: 'Post',
    auth: auth,
    data: {
      "size": 4000,
      "_source": {
        "exclude": [
          "notes",
          "bibtexKey",
          "authorList.affiliation",
          "authorList.email",
          "authorList.homepage",
          "authorList.kuchaVisitor",
          "modifiedOn",
          "authorList.modifiedOn",
          "authorList.authorID",
          "abstractText",
          "url",
          "uri",
          "comments"
        ]
      },
      "query": {
        "exists": {
          "field": "annotatedBibliographyID"
        }
      }
    }
  })
}

export function getIcoList(){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
    method: 'Post',
    auth: auth,
    data: {
      "size": 4000,
      "_source": {
        "exclude": [
          "oe"
        ]
      },
      "query": {
        "exists": {
          "field": "iconographyID"
        }
      }
    }
  })
}


export function getCaveList(){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
    method: 'Post',
    auth: auth,
    data: {
      "size": 4000,
      "_source": {
        "exclude": [
          "wallList",
          "caveAreaList"
        ]
      },
      "query": {
        "exists": {
          "field": "caveID"
        }
      }
    }
  })
}
export function getDiscussionKeywords(){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_discussion/_search',
    method: 'post',
    auth: auth,
    data: {
      "size":0,
      "aggs": {
        "keywordList": {
          "terms": { "field": "keywordList.keyword" }
        }
      }
    }
  })
}
export function getCommentsByItems(caveIDs, prIDs, icoIDs, biblioIDs){
  let data = {
    "query": {
      "bool": {
        "must": [
          {
            "exists": {
              "field": "isInfo"
            }
          }
        ],
        "should": [
        ]
      }
    }
  }
  let should = {
    "bool": {
      "should": [
      ]
    }
  }

  if (caveIDs.length > 0){
    should.bool.should.push(
      {
        "terms": {
          "caves.value": caveIDs
        }
      }
    )
  }
  if (prIDs.length > 0){
    should.bool.should.push(
      {
        "terms": {
          "prs.value": prIDs
        }
      }
    )
  }
  if (icoIDs.length > 0){
    should.bool.should.push(
      {
        "terms": {
          "iconography.value": icoIDs
        }
      },
    )
  }
  if (biblioIDs.length > 0){
    should.bool.should.push(
      {
        "terms": {
          "bibliography.value": biblioIDs
        }
      }
    )
  }
  data.query.bool.must.push(should)
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_discussion/_search',
    method: 'post',
    auth: auth,
    data: data
  })
}
export function getComments(){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_discussion/_search',
    method: 'post',
    auth: auth,
    data: {
      "size": 4000,
      "query": {
        "exists": {
          "field": "isInfo"
        }
      }
    }
  })
}
export function getWallTreeByTimestamp(timestamp){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_backup/_search',
    method: 'post',
    auth: auth,
    data: {
      "sort": [
        {"timestamp" : {"order" : "desc"}}
      ],
      "size": 4000,
      "query": {
        "bool": {
          "must": [
            {
              "range": {
                "timestamp": {
                  "lte": timestamp
                }
              }
            },
            {
              "exists": {
                "field": "content.wallTree"
              }
            }
          ]
        }
      }
    }
  })
}
export function getIconogrpaphyByTimestamp(timestamp){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_backup/_search',
    method: 'post',
    auth: auth,
    data: {
      "sort": [
        {"timestamp" : {"order" : "desc"}}
      ],
      "size": 4000,
      "query": {
        "bool": {
          "must": [
            {
              "range": {
                "timestamp": {
                  "lte": timestamp
                }
              }
            },
            {
              "exists": {
                "field": "content.iconography"
              }
            }
          ]
        }
      }
    }
  })
}
export function getKuchaMapping() {
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_mapping',
    method: 'get',
    auth: auth,
    data: {
    }
  })
}

export function getIntro(){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_discussion/_doc/introduction',
    method: 'get',
    auth: auth
  })
}

export function getKuchaDiscussionMapping() {
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_discussion/_mapping',
    method: 'get',
    auth: auth,
    data: {
    }
  })
}

export function getDepictionStats() {
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: {
      "size":0,
      "aggs": {
        "depiction_count": {
          "filter": {
            "exists": {
              "field": "depictionID"
            }
          }
        },
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
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
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
export function postQuery(queryInput, destination){
  if (!destination){
    destination = process.env.VUE_APP_ESAPI + 'kucha_deep/_search'
  }
  return axios({
    url: destination,
    method: 'post',
    auth: auth,
    data: queryInput
  })
}
export function getIdealByIcoID(icoID){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: {
      "size": 4000,
      "query": {
        "bool": {
          "must": [
            {
              "multi_match": {
                "query": icoID,
                "fields": "iconographyID"
              }
            },
            {
              "exists": {
                "field": "typicalID"
              }
            }
          ]
        }
      }
    }
  })
}
export function getIdeals(){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: {
      "size": 4000,
      "query": {
        "exists": {
          "field": "oe.typicalID"
        }
      }
    }
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
              "query": queryWord,
              "default_operator": "AND"
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
              "default_operator": "AND",
              "query" : params.searchtext.trim()
            }
          }
        ]
      }
    },
  }
  for (var nestedQuery of nestedQueries){
    searchQuery.query.bool.should.push(nestedQuery)
  }
  searchQuery["sort"] = [
    {"iconographyID" : "asc"},
    {"shortName.keyword" : "asc"},
    {"caveID" : "asc"},
    {"annotatedBibliographyID" : "asc"},
    "_score"
  ]
  console.log("searchQuery", searchQuery);
  console.log("searchQuery params", params);
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
    method: 'post',
    auth: auth,
    data: searchQuery
  })
}
export function getItemById(params) {
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
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
  // console.log("params", params);
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
    method: 'post',
    headers: {'Accept-Encoding': 'gzip,deflate', 'Content-Length':4000},
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    auth: auth,
    data: {
      "size": 6000,
      "query": {
        "bool": {
          "must": [
            {
              "bool" : {
                "should":
                    [
                      {
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
                      },
                      {
                        "nested": {
                          "path": "relatedIconographyList",
                          "query": {
                            "terms": {
                              "relatedIconographyList.iconographyID": params.iconographyID
                            }
                          }
                        }
                      },
                    ]
              }
            },
            {
              "exists": {
                "field": "depictionID"
              }
            }
          ]
        }
      }
    }
  })
}
export function getVersionsOfEntry(entry){
  var field
  var ID
  console.log("getversions", entry);
  if (entry.depictionID){
    field = "content.depictionID"
    ID = entry.depictionID
  } else if (entry.iconographyID){
    field = "content.iconographyID"
    ID = entry.iconographyID
  } else if (entry.annotatedBibliographyID){
    field = "content.annotatedBibliographyID"
    ID = entry.annotatedBibliographyID
  } else if (entry.caveID){
    field = "content.caveID"
    ID = entry.caveID
  }
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_backup/_search',
    method: 'post',
    // headers: {'Accept-Encoding': 'gzip,deflate', 'Content-Length':4000},
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    auth: auth,
    data: {
      "_source": {
        "excludes": [
          "content"
        ]
      },
      "sort" : [
        "timestamp"
      ],
      "size": 4000,
      "query": {
        "multi_match": {
          "query": ID,
          "fields": field
        }
      }
    }
  })
}
export function getVersionOfEntry(entryUniqueID){
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_backup/_doc/' + entryUniqueID,
    method: 'get',
    auth: auth,
    data: {
    }
  })
}
export function getDepictionByBibliography(params) {
  return axios({
    url: process.env.VUE_APP_ESAPI + 'kucha_deep/_search',
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