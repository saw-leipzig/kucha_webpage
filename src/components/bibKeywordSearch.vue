<template>
  <v-card outlined>
    <v-list-item-subtitle>Keywords</v-list-item-subtitle>
    <v-autocomplete
      v-model="keywords"
      :items="getkeywords"
      item-text="bibKeyword"
      id="bibKeywordID"
      label="Keywords"
      multiple
      dense
      chips
      small-chips
      deletable-chips
      return-object
      outlined>
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title>
              <v-badge
                :content="data.item.count"
                inline
                color="grey"
              >
                {{data.item.bibKeyword}}
              </v-badge>
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </v-card>
</template>
<script>
import {findAgg} from  "@/utils/helpers"

export default {
  name: 'bibKeywordSearch',
  components: {
  },
  props: {
    prefix:"",
    aggregations:{}
  },
  data () {
    return {
      visible:true,
      relatedDepictions:[],
      loading: false,
      textSearch:"",
      keywords:[],
    }
  },
  computed: {
    getkeywords(){
      var keywords = []
      for (let keyword of this.$store.state.dic.bibKeyWords){
        if (this.aggregations){
          keyword["count"] = findAgg(this.aggregations, keyword.bibKeywordID)
        }
        if (keyword.count > 0){
          keywords.push(keyword)
        }
      }
      return keywords
    },
  },
  methods: {
    clear(){
      this.keywords = [];
    },
    prepSearch(){
      let searchObjects = []
      let aggsObject = {}
      let keywordsPath = this.prefix + "bibKeywordID"
      aggsObject = {
        "agg": {
          "keywordList": {
            "nested": {
              "path": "keywordList"
            },
            "aggs": {
              "keyword": {
                "terms": {
                  "size":2000,
                  "field": keywordsPath
                }
              }
            }
          }
        }
      }
      if (this.keywords.length > 0){
        aggsObject["filter"] = {}
        aggsObject.filter = {
          "keywordList": {
            "nested": {
              "path": "keywordList"
            },
            "aggs": {
              "keyword": {
                "filter": {
                  "terms": {
                  }
                },
                "aggs": {
                  "comment_to_issue": {
                    "reverse_nested": {}
                  }
                }
              }
            }
          }
        }
        let bibKeywordIDs = []
        for (let keyword of this.keywords){
          bibKeywordIDs.push(keyword.bibKeywordID)
        }
        let bibKeywordSearch = {
          "nested": {
            "path": "keywordList",
            "query": {
              "terms": {
              }
            }
          }
        }
        bibKeywordSearch.nested.query.terms[keywordsPath] = bibKeywordIDs
        aggsObject.filter.keywordList.aggs.keyword.filter.terms[keywordsPath] = bibKeywordIDs
        searchObjects.push(bibKeywordSearch)
      }
      let result = {}
      result['search'] = searchObjects
      result['aggs'] = aggsObject
      console.log("searchObject of keywords", result);
      return result
    },
    startSearch(){
      let result = this.prepSearch()
      this.$emit('clicked', result)
    },
  },
  watch: {
    'keywords': function(newVal, oldVal) {
      this.startSearch()
    },
    'aggregations': function(newVal, oldVal) {
      console.log("updated aggregations on bibKeyWord", this.aggregations);
    },

  },
  mounted:function () {
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
