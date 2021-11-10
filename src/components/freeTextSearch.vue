<template>
  <div>
    <div v-for="n in textSearchFields" v-bind:key="n">
      <v-card outlined>
      <v-row align="start" dense style="flex-wrap: wrap;margin-right:5px;margin-left:5px;" >
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
            v-on:keyup.enter="startSearch(false)"
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
        <v-row align="start" dense style="flex-wrap: wrap;margin-right:5px;margin-left:5px;" >
          <v-alert
            :value="alert[n]"
            color="pink"
            dark
            border="top"
            icon="mdi-alert"
            transition="scale-transition"
            dismissible
          >
            {{alertText[n]}}
          </v-alert>
        </v-row>

      <v-row v-if="advancedSearch" align="start" dense style="flex-wrap: wrap;wrap;margin-right:5px;margin-left:5px;">
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
    </v-card>
  </div>
</div>
</template>
<script>
import {buildNestedQueries} from '@/services/repository'

export default {
  name: 'freeTextSearch',
  components: {
  },
  props: {
    textSearchParam:{}
  },
  data () {
    return {
      alert:{1:false},
      alertText:{1:""},
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
      return Object.keys(this.textSearchParam).sort()
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
      this.alertText[this.textSearchFieldsCount] = ""
      this.alert[this.textSearchFieldsCount] = false
      this.shouldMustSelect[this.textSearchFieldsCount] = "should"
      this.textSearch[this.textSearchFieldsCount] = ""
    },
    removeTextSearch(n){
      let newTextSearchFields = []
      for (let id of this.textSearchFields){
        if (n !== id){
          newTextSearchFields.push(id)
        }
      }
      delete this.textSearch[n]
      delete this.alert[n]
      delete this.alertText[n]
      delete this.shouldMustSelect[n]
      delete this.selectedTextChips[n]
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
        if (this.textSearch[field].length > 0){
          if (this.advancedSearch){
            for (let searchfield of this.selectedTextChips[field]){
              let mustQuery = {
                "bool": {
                  "should": [
                  ]
                }
              }
              for (let aggfield in this.textSearchParam[searchfield]){
                if (this.textSearchParam[searchfield][aggfield].nested){
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
            let deepquery = buildNestedQueries(this.$store.state.mapping, "", this.textSearch[field])
            console.log("deepquery", deepquery);

            textSearchmust["query_string"] = {
              "lenient": true,
            }
            textSearchmust.query_string["query"] = this.textSearch[field]
            searchObjects.should.push(textSearchmust)
            for (query of deepquery){
              searchObjects.should.push(query)
            }
          }
        }
      }
      result['search'] = searchObjects
      result['aggs'] = aggsObject
      console.log("searchObject of location", result);
      return result
    },
    update(){
      this.startSearch(true)
    },
    startSearch(update){
      let foundNoTextChip = false
      if (this.advancedSearch){
        for (let text in this.textSearch){
          if (this.selectedTextChips[text].length === 0){
            foundNoTextChip = true
            this.alert[text] = true
            this.alertText[text] = "This search field has no target fields selected. It cannot be included. Please make a choise and start a new search!"
          }
        }
      }
      if (!foundNoTextChip){
        let result = this.prepSearch()
        if (update){
          this.$emit('update', result)
        } else {
          this.$emit('clicked', result)
        }
      }
    },
    checkClear(n) {
      this.textSearch[n] = '';
    },
    clear() {
      for (let field in this.textSearch){
        this.textSearch[field] = '';
      }
    },
  },
  watch: {
    'advancedSearch': function(newVal, oldVal) {
      if (newVal === false){
        this.textSearchFieldsCount = 1
        this.textSearchFields = [1]
        this.visible = true
        this.relatedDepictions = []
        this.loading = false
        this.textSearch = {
          1: ""
        }
        this.advancedSearch = false
        this.selectedTextChips = {
          1:[]
        }
        this.shouldMustSelect = {1:"should"}
      }
    }
  },
  mounted:function () {
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
