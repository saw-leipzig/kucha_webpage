<template>
<div>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-header>
        Iconography Filter
      </v-expansion-panel-header>
      <v-expansion-panel-content>
            <iconographySearch ref="iconographySearch" @clicked="changedIcoInput" prefix="" mode="iconography"></iconographySearch>
        <v-row>
          <v-col>
            <v-btn @click="initiateSearch(2000)" :loading="loading" dense block color="success">{{"Show " + resAmount +" Results"}}</v-btn>
          </v-col>
          <v-col cols=1>
            <v-btn icon @click="clear()" dense block color="success"><v-icon>mdi-restart</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-card v-if="relatedIconography.length > 0">
    <hideRelatedItems v-if="relatedIconography.length > 0" :title="resultsTitle" :items="relatedIconography" v-bind:presentCave="true" v-bind:open="true"></hideRelatedItems>
  </v-card>
</div>

</template>
<script>
import {postQuery} from '@/services/repository'
import iconographySearch from '@/components/iconographySearch.vue'
import {TextSearchDepiction} from '@/utils/constants.js'

export default {
  name: 'iconographyFilter',
  components: {
    iconographySearch,
  },
  data () {
    return {
      panel: 0,
      aggregations:{},
      visible:[0],
      relatedIconography:[],
      textSearch:"",
      caveSearchObjects:null,
      aggsObject:{},
      icoSearchObjects:null,
      locationSearchObjects:null,
      wallSearchObjects:null,
      resAmount:0,
      loading:false,
    }
  },
  computed: {
    getTextSearchParams(){
      return TextSearchDepiction
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
      this.$refs.iconographySearch.clear();
      this.textSearch = "";
      this.caveSearchObjects = null;
      this.icoSearchObjects = null;
      this.locationSearchObjects = null;
      this.wallSearchObjects = null;
      this.initiateFacets();
    },
    changedIcoInput(value){
      console.log("new changed Ico Value:", value);
      this.icoSearchObjects = value.search
      this.aggsObject["iconography"] = value.aggs
      this.initiateFacets()
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
      if ( this.caveSearchObjects){
        if (this.caveSearchObjects.length > 0){
          for (let caveSearchObject of this.caveSearchObjects){
            queries.must.push(caveSearchObject)
          }
        }
      }
      if (this.locationSearchObjects){
        if (this.locationSearchObjects.length > 0){
          for (let locationSearchObject of this.locationSearchObjects){
            queries.must.push(locationSearchObject)
          }
        }
      }
      if (this.wallSearchObjects){
        if (this.wallSearchObjects.length > 0){
          for (let wallLocationSearchObject of this.wallSearchObjects){
            queries.must.push(wallLocationSearchObject)
          }
        }
      }
      if (this.icoSearchObjects){
        if (this.icoSearchObjects.length > 0){
          for (let icoSearchObject of this.icoSearchObjects){
            queries.must.push(icoSearchObject)
          }
        }
      }

      return queries
    },
    initiateSearch(amount){
      let searchObject = {}
      this.relatedIconography = []
      searchObject["size"] = amount
      searchObject["sort"] = ["cave.regionID", "cave.districtID", "cave.siteID", "cave.officialNumber"]
      searchObject["query"] = {}
      searchObject.query["bool"] = {}
      searchObject.query.bool["must"] = {}
      searchObject.query.bool.must = []
      let shouldQuery = {
        "bool": {
          "should": []
        }
      }
      let depictionmust = {}
      depictionmust["exists"] = {}
      depictionmust.exists["field"] = "iconographyID"
      searchObject.query.bool.must.push(depictionmust)
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
          this.relatedIconography = newDepictions
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
      console.log("initFacets started");
      this.relatedIconography = []
      let aggregations = {}
      aggregations["size"] = 0
      aggregations["query"] = {
        "bool": {
          "must": [
            {
              "exists": {
                "field": "iconographyID"
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
        aggregations.post_filter.bool.must.push(query)
      }
      for (let query of queries.should){
        shouldQuery.bool.should.push(query)
      }
      if (shouldQuery.bool.should.length > 0){
        aggregations.post_filter.bool.must.push(shouldQuery)
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
      console.log("updated aggregations on should", newVal);
    },

  },
  mounted:function () {
    console.log("started Depiction filter");

    let icoRes = this.$refs.iconographySearch.prepSearch();
    this.icoSearchObjects = icoRes.search
    this.aggsObject["iconography"] = icoRes.aggs
    this.initiateFacets()
  },
  beforeUpdate:function () {

  }
}
</script>

<style lang = "css" >
</style>