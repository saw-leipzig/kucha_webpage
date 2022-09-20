<template>
<div style="width:100%">
  <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <v-breadcrumbs
          :items="$store.state.breadcrumb"
        >
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              :href="item.href"
              :disabled="item.disabled"
            >
              <span style="color: black;">
                {{item.text}}
              </span>
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row no-gutters >
          <v-col >
            <free-text-search ref="textSearch" :textSearchParam="getTextSearchParams" @clicked="onTextSearchInput" @update="updateTextSearchInput" :aggregations="textFacets"></free-text-search>
          </v-col>
        </v-row>
        <v-row>
         <v-col  style="min-width: 265px;">
            <v-row>
              <v-col>
                <bibKeywordSearch ref="bibKeywordSearch" @clicked="changedBibKeywordInput" prefix="keywordList." :aggregations="bibKeywordFacets"></bibKeywordSearch>
              </v-col>
            </v-row>
         </v-col>
         <v-col  style="min-width: 265px;">
            <v-row>
              <v-col>
                <checkBoxFilter
                  ref="bibCheckBoxSearch"
                  @clicked="changedBibCeckboxInput"
                  :checkBoxData="getBibCheckBoxData"
                  :aggregations="bibCheckBoxFacets"
                  >
                  </checkBoxFilter>
              </v-col>
            </v-row>
         </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="initiateSearch(2000)" :loading="loading" dense block color="success">{{"Show " + resAmount +" Results"}}</v-btn>
          </v-col>
          <v-col cols=1>
            <v-btn icon @click="clear()" dense block color="success"><v-icon>mdi-restart</v-icon></v-btn>
          </v-col>
        </v-row>
        <radioGroupSort :startValue="['yearORG.keyword']" @clicked="changedSort" class="mt-5" label="Sort" :radioGroupData="getRadioGroupData"></radioGroupSort>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-card v-if="relatedBibliography.length > 0">
    <hideRelatedItems v-if="relatedBibliography.length > 0" :title="resultsTitle" :items="relatedBibliography" v-bind:presentCave="true" v-bind:open="true"></hideRelatedItems>
  </v-card>
</div>

</template>
<script>
import { postQuery } from '@/services/repository'
import {TextSearchBibliography} from '@/utils/constants.js'
import radioGroupSort from '@/components/radioGroupSort.vue'
import freeTextSearch from '@/components/freeTextSearch.vue'
import bibKeywordSearch from '@/components/bibKeywordSearch.vue'
import checkBoxFilter from '@/components/checkBoxFilter.vue'
import {getBuckets, buildAgg, getAuthorOrEditor, prepareSortItem} from  "@/utils/helpers"

export default {
  name: 'bibliographyFilter',
  components: {
    freeTextSearch,
    bibKeywordSearch,
    checkBoxFilter,
    radioGroupSort
  },
  data () {
    return {
      panel: 0,
      sort: ["yearORG.keyword"],
      direction:"asc",
      aggregations:{},
      visible:[0],
      relatedBibliography:[],
      textSearch:"",
      aggsObject:{},
      resAmount:0,
      loading:false,
      bibKeywordsSearchObjects:[],
      bibCheckBoxSearchObjects:[]
    }
  },
  computed: {
    getTextSearchParams(){
      return TextSearchBibliography
    },
    getRadioGroupData(){
      let radioGroupData = []
      radioGroupData.push({
        "label": "Year",
        "value": "yearORG.keyword"
      })
      radioGroupData.push({
        "label": "Author",
        "value": "authorString.keyword"
      })
      radioGroupData.push({
        "label": "Title (Original)",
        "value": "titleORG.keyword"
      })
      radioGroupData.push({
        "label": "Title (English Translation)",
        "value": "titleEN.keyword"
      })
      radioGroupData.push({
        "label": "Title (Transcription)",
        "value": "titleTR.keyword"
      })
      return radioGroupData
    },
    getBibCheckBoxData(){
      let bibCheckBoxData = {}
      bibCheckBoxData["annotation"] = {
        "path": "",
        "label": "annotation"
      }
      bibCheckBoxData["unpublished"] = {
        "path": "",
        "label": "unpublished"
      }
      return bibCheckBoxData
    },
    bibKeywordFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = getBuckets(this.aggregations["keyword"])
      }
      console.log("aggregations bibKeywordsFacetts: ", aggregations);
      return aggregations
    },
    bibCheckBoxFacets(){
      let aggregations = {}
      if (this.aggregations){
        for (let checkBox in this.getBibCheckBoxData){
          aggregations[checkBox] = getBuckets(this.aggregations[checkBox])
        }
      }
      console.log("aggregations bibKeywordsFacetts: ", aggregations);
      return aggregations
    },
    resultsTitle(){
      if (this.loading){
        return "Loading, please wait!"
      } else {
        if (this.resAmount === 1){
          return "Found " + this.resAmount + " Result"
        } else {
          return "Found " + this.resAmount + " Results"
        }
      }
    }
  },
  methods: {
    clear(){
      this.$refs.textSearch.clear();
      this.$refs.bibKeywordSearch.clear();
      this.$refs.bibCheckBoxSearch.clear();
      this.textSearch = "";
      this.bibKeywordsSearchObjects = [];
      this.bibCheckBoxSearchObjects = [];
      this.initiateFacets();
    },
    onTextSearchInput(value) {
      this.textSearch = value.search
      // this.buildTextAggs(value.aggs)
      this.initiateFacets()
    },
    updateTextSearchInput(value) {
      this.textSearch = value.search
    },
    changedBibKeywordInput(value){
      console.log("new changed keyword Value:", value);
      this.bibKeywordsSearchObjects = value.search
      this.aggsObject["keyword"] = value.aggs
      this.initiateFacets()
    },
    changedBibCeckboxInput(value){
      console.log("new changed checkbox Value:", value);
      this.bibCheckBoxSearchObjects = value.search
      buildAgg(value.aggs, Object.keys(value.aggs), this.aggsObject)

      this.initiateFacets()
    },
    changedSort(value){
      console.log("new changed sort Value:", value);
      this.sort = value[0]
      this.direction = value[1]
      this.relatedBibliography = []
    },
    textFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = this.getBuckets(this.aggregations["text"])
      }
      console.log("aggregations locationFacetts: ", aggregations);
      return aggregations
    },
    sortBib(){
      if (this.relatedBibliography.length > 0){
        if (this.sort === "year"){
          if (this.direction === "asc"){
            this.relatedBibliography.sort(function(a, b){
              var nameA = a["yearORG"].trim().toUpperCase();
              var nameB = b["yearORG"].trim().toUpperCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
            })
          } else {
            this.relatedBibliography.sort(function(a, b){
              var nameA = a["yearORG"].trim().toUpperCase();
              var nameB = b["yearORG"].trim().toUpperCase();
              if (nameA > nameB) {
                return -1;
              }
              if (nameA < nameB) {
                return 1;
              }
            })
          }
        } else if (this.sort === "author"){
          if (this.direction === "asc"){
            this.relatedBibliography.sort(function(a, b){
              var nameA = getAuthorOrEditor(a).trim().toUpperCase();
              var nameB = getAuthorOrEditor(b).trim().toUpperCase();
              if (nameA > nameB) {
                return -1;
              }
              if (nameA < nameB) {
                return 1;
              }
            })
          } else {
            this.relatedBibliography.sort(function(a, b){
              var nameA = getAuthorOrEditor(a).trim().toUpperCase();
              var nameB = getAuthorOrEditor(b).trim().toUpperCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
            })

          }
        } else if (this.sort === "title"){
          if (this.direction === "asc"){
            this.relatedBibliography.sort(function(a, b){
              var nameA = a["titleORG"].trim().toUpperCase();
              var nameB = b["titleORG"].trim().toUpperCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
            })
          } else {
            this.relatedBibliography.sort(function(a, b){
              var nameA = a["titleORG"].trim().toUpperCase();
              var nameB = b["titleORG"].trim().toUpperCase();
              if (nameA > nameB) {
                return -1;
              }
              if (nameA < nameB) {
                return 1;
              }
            })
          }

        }
      }
    },


    buildAgg(aggInfo, reference){
      delete this.aggsObject[reference]
      for (let prop in aggInfo){
        this.aggsObject[prop] = {}
        if (aggInfo[prop].ids){
          this.aggsObject[prop]['filter'] = {
          }
          this.aggsObject[prop].filter[prop] = {
            "filter": {
              "terms" : {
              }
            }
          }
          this.aggsObject[prop].filter[prop].filter.terms[aggInfo[prop].field] = aggInfo[prop].ids
        }
        this.aggsObject[prop]['agg'] = {
        }
        this.aggsObject[prop].agg[prop] = {
          "terms" : {
            "size": 10000
          }
        }
        this.aggsObject[prop].agg[prop].terms["field"] = aggInfo[prop].field
      }
    },

    buildCaveAggs(aggInfo){
      delete this.aggsObject.caveType
      delete this.aggsObject.site
      delete this.aggsObject.district
      delete this.aggsObject.region
      for (let prop in aggInfo){
        this.aggsObject[prop] = {}
        if (aggInfo[prop].ids){
          this.aggsObject[prop]['filter'] = {
          }
          this.aggsObject[prop].filter[prop] = {
            "filter": {
              "terms" : {
              }
            }
          }
          this.aggsObject[prop].filter[prop].filter.terms[aggInfo[prop].field] = aggInfo[prop].ids
        }
        this.aggsObject[prop]['agg'] = {
        }
        this.aggsObject[prop].agg[prop] = {
          "terms" : {
            "size": 10000
          }
        }
        this.aggsObject[prop].agg[prop].terms["field"] = aggInfo[prop].field
      }
      console.log("built aggsObject", this.aggsObject);
    },
    buildQueries(){
      let queries = {
        "must": [],
        "should": []}
      if (this.textSearch){
        if ((this.textSearch.should.length > 0) || (this.textSearch.must.length > 0)){
          for (let textSearchObject of this.textSearch.should){
            queries.should.push(textSearchObject)
          }
          for (let textSearchObject of this.textSearch.must){
            queries.must.push(textSearchObject)
          }
        }
      }
      if (this.bibKeywordsSearchObjects){
        if (this.bibKeywordsSearchObjects.length > 0){
          for (let bibKeywordsSearchObject of this.bibKeywordsSearchObjects){
            queries.must.push(bibKeywordsSearchObject)
          }
        }
      }
      if (this.bibCheckBoxSearchObjects){
        if (this.bibCheckBoxSearchObjects.length > 0){
          for (let bibCheckBoxSearchObject of this.bibCheckBoxSearchObjects){
            queries.must.push(bibCheckBoxSearchObject)
          }
        }
      }

      return queries
    },
    initiateSearch(amount){
      this.$refs.textSearch.update()
      let searchObject = {}
      this.relatedBibliography = []
      searchObject["size"] = amount

      searchObject["sort"] = prepareSortItem(this.sort, this.direction)
      searchObject["query"] = {}
      searchObject.query["bool"] = {}
      searchObject.query.bool["must"] = {}
      searchObject.query.bool.must = []
      let shouldQuery = {
        "bool": {
          "should": []
        }
      }
      let bibliographymust = {}
      bibliographymust["exists"] = {}
      bibliographymust.exists["field"] = "annotatedBibliographyID"
      searchObject.query.bool.must.push(bibliographymust)
      let queries = this.buildQueries()
      for (let query of queries.must){
        searchObject.query.bool.must.push(query)
      }
      for (let query of queries.should){
        shouldQuery.bool.should.push(query)
      }
      if (shouldQuery.bool.should.length > 0){
        searchObject.query.bool.must.push(shouldQuery)
      }
      this.resAmount = 0
      this.loading = true
      postQuery(searchObject)
        .then( res => {
          console.log("search results", res);
          var newDepictions = []
          this.resAmount = res.data.hits.total.value
          for ( var entry of res.data.hits.hits){
            newDepictions.push(entry._source)
          }
          this.loading = false
          this.relatedBibliography = newDepictions
          this.sortBib()
          console.log("relatedBibliography", this.relatedBibliography);
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
        })
      console.log("search initiated:", searchObject);
    },
    appendFilterToAgg(agg, filter, propertyName){
      for (let prop in filter){
        if (prop === propertyName){
          filter["aggs"] = agg
          return filter
        } else {
          if ( (typeof filter[prop] === "object" || typeof filter[prop] === 'function') && (filter[prop] !== null) ) {
            if (this.appendFilterToAgg(agg, filter[prop], propertyName) !== null){
              return filter
            }
          }
        }
      }
      return null
    },
    initiateFacets(){
      this.relatedBibliography = []
      let aggregations = {"aggs" : {}}
      for (let aggProp in this.aggsObject){
        console.log("aggsObject", aggProp, ":", this.aggsObject[aggProp]);
        let agg = JSON.parse(JSON.stringify( this.aggsObject[aggProp].agg))
        for (let filterProp in this.aggsObject){
          if (filterProp !== aggProp){
            if (this.aggsObject[filterProp].filter){
              let filter = JSON.parse(JSON.stringify(this.aggsObject[filterProp].filter))
              if (filterProp === "keywords" || filterProp === "wallLocation"){
                agg = this.appendFilterToAgg(agg, filter, "reverse_nested")
              } else {
                agg = this.appendFilterToAgg(agg, filter, "filter")
              }
            }
          }
        }
        for (let finalAggProp in agg){
          aggregations.aggs[aggProp] = agg[finalAggProp]
        }
      }
      aggregations["size"] = 0
      aggregations["query"] = {
        "bool": {
          "must": [
            {
              "exists": {
                "field": "annotatedBibliographyID"
              }
            }
          ]
        }
      }
      aggregations["post_filter"] = {}
      aggregations["post_filter"]["bool"] = {}
      aggregations["post_filter"]["bool"]["must"] = []
      let queries = this.buildQueries()
      let shouldQuery = {
        "bool": {
          "should": []
        }
      }

      for (let query of queries.must){
        aggregations.query.bool.must.push(query)
      }
      for (let query of queries.should){
        shouldQuery.bool.should.push(query)
      }
      if (shouldQuery.bool.should.length > 0){
        aggregations.query.bool.must.push(shouldQuery)
      }
      postQuery(aggregations)
        .then( res => {
          console.log("aggs results", res.data.aggregations);
          this.aggregations = res.data.aggregations
          this.resAmount = res.data.hits.total.value
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
  watch: {
    'panel': function(newVal, oldVal) {
      console.log("updated caveTypes panel", newVal);
    },
    'aggregations': function(newVal, oldVal) {
      console.log("updated aggregations on bibliographyFilter", newVal);
    },

  },
  mounted:function () {
    console.log("started Bibliography filter");
    let bibKeywordRes = this.$refs.bibKeywordSearch.prepSearch();
    this.bibKeywordsSearchObjects = bibKeywordRes.search
    this.aggsObject["keyword"] = bibKeywordRes.aggs
    let bibCheckBoxRes = this.$refs.bibCheckBoxSearch.prepSearch();
    this.bibCheckBoxSearchObjects = bibCheckBoxRes.search
    buildAgg(bibCheckBoxRes.aggs, Object.keys(bibCheckBoxRes.aggs), this.aggsObject)
    this.initiateFacets()
  },
  beforeUpdate:function () {

  }
}
</script>

<style lang = "css" >

</style>