<template>
  <v-card outlined>
    <v-list-item-subtitle>{{label}}</v-list-item-subtitle>
    <v-autocomplete
      v-model="keywords"
      :items="getkeywords"
      item-text="key"
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
                :content="data.item.doc_count"
                inline
                color="grey"
              >
                {{data.item.key}}
              </v-badge>
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </v-card>
</template>
<script>

export default {
  name: 'comboboxSearch',
  components: {
  },
  props: {
    prefix:"",
    aggregations:{
      type: Array,
      default: function(){
        return []
      }
    },
    label:""
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
      if (this.aggregations){
        return this.aggregations
      } else {
        return []
      }
    },
  },
  methods: {
    clear(){
      this.keywords = [];
    },
    prepSearch(){
      this.$log.debug("prepsearch", this.prefix);
      let searchObjects = []
      let aggsObject = {}
      let keywordsPath = this.prefix
      aggsObject = {
        "agg": {
          "aggs": {
            "terms": {
              "size":2000,
              "field": keywordsPath
            }
          }
        }
      }
      if (this.keywords.length > 0){
        aggsObject["filter"] = {}
        aggsObject.filter = {
          "aggs": {
            "filter": {
              "terms": {
              }
            }
          }
        }
        let bibKeywordIDs = []
        for (let keyword of this.keywords){
          this.$log.debug("keyword", keyword);
          bibKeywordIDs.push(keyword.key)
        }
        let bibKeywordSearch = {
          "terms": {
          }
        }
        bibKeywordSearch.terms[keywordsPath] = bibKeywordIDs
        aggsObject.filter.aggs.filter.terms[keywordsPath] = bibKeywordIDs
        searchObjects.push(bibKeywordSearch)
      }
      let result = {}
      result['search'] = searchObjects
      result['aggs'] = aggsObject
      this.$log.debug("searchObject of keywords", result);
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
      this.$log.debug("updated aggregations on bibKeyWord", this.aggregations);
    },

  },
  mounted:function () {
    this.$log.debug("combobox initiated", this.prefix);
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
