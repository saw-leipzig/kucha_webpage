<template>
  <div>
    <div v-for="n in textSearchFields" v-bind:key="n">
    <v-row align="start" dense style="flex-wrap: wrap;" >
      <v-col class="flex-grow-1 flex-shrink-0" style="min-width: 265px;">
        <v-text-field
          :prepend-icon="advancedSearch ? 'mdi-plus' : undefined"
          :append-icon="(advancedSearch && (textSearchFields.length > 1)) ? 'mdi-minus' : undefined"
          id="global-search-input-field"
          ref="globalSearchInput"
          label="Free Textsearch"
          @click:append="removeTextSearch(n)"
          @click:prepend="addTextSearch(n)"
          clearable
          :dense=false
          prepend-inner-icon="mdi-magnify"
          v-model="textSearch[n]"
          @mouseup.prevent
          @mousedown.prevent
          return-object
          @click:clear.prevent="checkClear(n)"
          v-on:keyup.enter="startSearch"
          v-on:keyup.escape="checkClear(n)"
          autocomplete="off"
          accesskey="f"
        >

        </v-text-field>
      </v-col>
      <v-col v-if="advancedSearch" class="flex-grow-1 flex-shrink-1" style="max-width: 100px;">
      <v-select
        v-model="shouldMustSelect[n]"
        :items="shouldMust"
      >
      </v-select>
      </v-col>
      <v-col class="flex-grow-1 flex-shrink-1" style="max-width: 200px;">
        <v-checkbox v-if="first(n)" v-model="advancedSearch" label="Advanced Search"></v-checkbox>
      </v-col>
      </v-row>
    <v-row v-if="advancedSearch" align="start" dense style="flex-wrap: wrap;">
      <v-col  class="flex-grow-0 flex-shrink-0" cols="12" md="10">
        <v-autocomplete
        dense
        v-model="selectedTextChips[n]"
        :items="textFields"
        hint="Select Field for Search"
        chips
        label="Search Fields"
        multiple
        outlined
        deletable-chips
        required
        :menu-props="{closeOnContentClick: true }">
          <template #selection="{ item }">
            <v-chip @click="removeChipTextSearch(item, n)" small color="#007d40" text-color="white">{{item}}</v-chip>
          </template>        </v-autocomplete>
      </v-col>
    </v-row>
  </div>
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
      textSearchFieldsCount:1,
      textSearchFields:[1],
      visible:true,
      relatedDepictions:[],
      loading: false,
      textSearch:{
        1: ""
      },
      advancedSearch:false,
      selectedTextChips: {1:[]},
      shouldMust:["should", "must"],
      shouldMustSelect:{1:"should"}
    }
  },
  computed: {
    textFields(){
      return Object.keys(TextSearchDepiction)
    }
  },
  methods: {
    first(n){
      return (this.textSearchFields.indexOf(n) === 0)
    },
    addTextSearch(n){
      this.textSearchFieldsCount += 1
      this.textSearchFields.push(this.textSearchFieldsCount)
      this.selectedTextChips[this.textSearchFieldsCount] = []
      this.shouldMustSelect[this.textSearchFieldsCount] = "should"
    },
    removeTextSearch(n){
      let newTextSearchFields = []
      for (let id of this.textSearchFields){
        if (n !== id){
          newTextSearchFields.push(id)
        }
      }
      this.textSearchFields = newTextSearchFields
    },
    removeChipTextSearch(item, n){
      let newSelected = []
      for (let chip of this.selectedTextChips[n]){
        if (chip !== item){
          newSelected.push(chip)
        }
      }
      this.selectedTextChips = newSelected
    },
    prepSearch(){
      let searchObjects = {
        must: [],
        should: []
      }
      let aggsObject = {}
      let result = {}
      for (let field in this.textSearch){
        let query = {}
        if (this.advancedSearch){
          for (let searchfield of this.selectedTextChips[field]){
            let mustQuery = {
              "bool": {
                "should": [
                ]
              }
            }
            for (let aggfield in TextSearchDepiction[searchfield]){
              if (TextSearchDepiction[searchfield][aggfield].nested){
                query = {
                  "nested": {
                    "path": aggfield,
                    "query":{
                      "query_string": {
                        "query": this.textSearch[field],
                        "lenient": true,
                      }
                    }
                  }
                }
              } else {
                query = {
                  "query_string": {
                    "query": this.textSearch[field],
                    "default_field": aggfield,
                    "lenient": true,
                  }
                }
              }
              if (this.shouldMustSelect[field] === "should"){
                searchObjects.should.push(query)
              } else {
                mustQuery.bool.should.push(query)
              }
            }
            searchObjects.must.push(mustQuery)
          }
        } else {
          let textSearchmust = {}
          textSearchmust["query_string"] = {
            "lenient": true,
          }
          textSearchmust.query_string["query"] = this.textSearch[field]
          searchObjects.should.push(textSearchmust)
        }
      }
      result['search'] = searchObjects
      result['aggs'] = aggsObject
      console.log("searchObject of location", result);
      return result
    },
    startSearch(){
      let found = false
      for (let text in this.textSearch){
        if (this.textSearch[text].length > 0){
          found = true
        }
      }
      if (found){
        let result = this.prepSearch()
        this.$emit('clicked', result)
      }
    },
    checkClear(n) {
      this.textSearch[n] = '';
    },
  },
  watch: {

  },
  mounted:function () {
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
