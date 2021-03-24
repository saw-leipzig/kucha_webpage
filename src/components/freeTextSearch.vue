<template>
  <div>
    <v-row align="start" dense style="flex-wrap: wrap;">
      <v-col class="flex-grow-1 flex-shrink-0" style="min-width: 265px;">
        <v-text-field
          id="global-search-input-field"
          ref="globalSearchInput"
          label="Free Textsearch"
          clearable
          :dense=false
          prepend-inner-icon="mdi-magnify"
          v-model="textSearch"
          @mouseup.prevent
          @mousedown.prevent
          return-object
          @click:clear.prevent="checkClear"
          v-on:keyup.enter="startSearch"
          v-on:keyup.escape="checkClear"
          autocomplete="off"
          accesskey="f"
        >
        </v-text-field>
      </v-col>
      <v-col class="flex-grow-1 flex-shrink-1" style="max-width: 200px;">
        <v-checkbox v-model="advancedSearch" label="Advanced Search"></v-checkbox>
      </v-col>
      </v-row>
    <v-row v-if="advancedSearch" align="start" dense style="flex-wrap: wrap;">
      <v-col  class="flex-grow-0 flex-shrink-0" cols="12" md="10">
        <v-autocomplete
        v-model="selectedTextFeilds"
        :items="textFields"
        chips
        label="Search Fields"
        multiple
        outlined
        deletable-chips
        required
        :menu-props="{closeOnContentClick: true }">
        </v-autocomplete>
      </v-col>
    </v-row>
</div>
</template>
<script>
import {TextSearchDepiction} from '@/utils/constants.js'
export default {
  name: 'freeTextSearch',
  components: {
  },
  props: {
  },
  data () {
    return {
      visible:true,
      relatedDepictions:[],
      loading: false,
      textSearch:"",
      advancedSearch:false,
      selectedTextFeilds: []
    }
  },
  computed: {
    textFields(){
      return Object.keys(TextSearchDepiction)
    }
  },
  methods: {
    prepSearch(){
      let searchObjects = []
      let aggsObject = {}
      let result = {}
      let query = {}
      if (this.advancedSearch){
        // let locationPath = this.prefix + "locationID"
        for (let searchfield of this.selectedTextFeilds){
          for (let aggfield in TextSearchDepiction[searchfield]){
            if (TextSearchDepiction[searchfield][aggfield].nested){
              query = {
                "nested": {
                  "path": aggfield,
                  "query":{
                    "query_string": {
                      "query": this.textSearch
                    }
                  }
                }
              }
            } else {
              query = {
                "query_string": {
                  "query": this.textSearch,
                  "default_field": aggfield,
                  "lenient": true
                }
              }
            }
            searchObjects.push(query)

          }
        }
      } else {
        let textSearchmust = {}
        textSearchmust["query_string"] = {}
        textSearchmust.query_string["query"] = this.textSearch
        searchObjects.push(textSearchmust)
      }
      result['search'] = searchObjects
      result['aggs'] = aggsObject
      console.log("searchObject of location", result);
      return result
    },
    startSearch(){
      if (this.textSearch.length > 0){
        let result = this.prepSearch()
        this.$emit('clicked', result)
      }
    },
    checkClear() {
      this.textSearch = '';
    },
  },
  watch: {
  },
  mounted:function () {
    this.selectedTextFeilds = this.textFields
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
