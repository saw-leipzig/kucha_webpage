<template>
<div>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-header>
        Depiction Filter
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row align="start" dense style="flex-wrap: wrap;">
          <v-col  style="min-width: 265px;">
            <free-text-search @clicked="onClickChild"></free-text-search>
          </v-col>
        </v-row>
        <v-row align="start" dense style="flex-wrap: wrap;">
          <v-col  style="min-width: 265px;">
            <v-row>
              <v-col>
                <caveSearch ref="caveSearch" @clicked="changedCaveInput" prefix="cave." :aggregations="caveFacets"></caveSearch>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <locationSearch ref="locationSearch" @clicked="changedLocationInput" prefix="location." :aggregations="locationFacets"></locationSearch>
              </v-col>
            </v-row>
          </v-col>
          <v-col style="min-width: 200px;max-width: 265px;">
            <wallSearch ref="wallLocationSearch" @clicked="changedWallInput" prefix="wallIDs." :aggregations="wallLocationFacets"></wallSearch>
          </v-col>
          <v-col  style="min-width: 300px;">
            <iconographySearch ref="iconographySearch" @clicked="changedIcoInput" prefix="relatedAnnotationList.tags." :aggregations="icoFacets"></iconographySearch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="initiateSearch(2000)" :loading="loading" dense block color="success">{{"Show " + resAmount +" Results"}}</v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  <hideRelatedItems v-if="relatedDepictions.length > 0" :title="resultsTitle" :items="relatedDepictions" v-bind:presentCave="true" v-bind:open="true"></hideRelatedItems>

</div>

</template>
<script>
import { postQuery } from '@/services/repository'
import caveSearch from '@/components/caveSearch.vue'
import locationSearch from '@/components/locationSearch.vue'
import freeTextSearch from '@/components/freeTextSearch.vue'
import iconographySearch from '@/components/iconographySearch.vue'
import wallSearch from '@/components/wallSearch.vue'

export default {
  name: 'depictionFilter',
  components: {
    wallSearch,
    freeTextSearch,
    caveSearch,
    iconographySearch,
    locationSearch,
  },
  data () {
    return {
      panel: 0,
      aggregations:{},
      visible:[0],
      relatedDepictions:[],
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
    caveFacets(){
      console.log("aggregations caveFacetts: ", this.aggregations);
      let aggregations = {}
      if (this.aggregations){
        if (this.aggregations["caveType"]){
          aggregations["caveType"] = this.getBuckets(this.aggregations["caveType"])
        }
        if (this.aggregations["district"]){
          aggregations["district"] = this.getBuckets(this.aggregations["district"])
        }
        if (this.aggregations["region"]){
          aggregations["region"] = this.getBuckets(this.aggregations["region"])
        }
        if (this.aggregations["site"]){
          aggregations["site"] = this.getBuckets(this.aggregations["site"])
        }
      }
      return aggregations
    },
    icoFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = this.getBuckets(this.aggregations["iconography"])
      }
      console.log("aggregations icoFacetts: ", aggregations);
      return aggregations
    },
    locationFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = this.getBuckets(this.aggregations["location"])
      }
      console.log("aggregations locationFacetts: ", aggregations);
      return aggregations
    },
    wallLocationFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = this.getBuckets(this.aggregations["wallLocation"])
      }
      console.log("aggregations locationFacetts: ", aggregations);
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
    getBuckets(element){
      for (let prop in element){
        if (prop === "buckets"){
          return element[prop]
        } else {
          let res = this.getBuckets(element[prop])
          if (res !== null){
            return res
          }
        }
      }
      return null
    },
    onClickChild (value) {
      this.textSearch = value
      this.initiateSearch(0)
    },

    changedCaveInput(value){
      console.log("new changed Cave Value:", value);
      this.caveSearchObjects = value.search
      this.buildCaveAggs(value.aggs)
      this.initiateFacets()
      console.log("built aggs:", this.aggsObject);
    },
    changedIcoInput(value){
      console.log("new changed Ico Value:", value);
      this.icoSearchObjects = value.search
      this.aggsObject["iconography"] = value.aggs
      this.initiateFacets()
    },
    changedLocationInput(value){
      console.log("new changed location Value:", value);
      this.locationSearchObjects = value.search
      this.buildAgg(value.aggs, "location")
      this.initiateFacets()
    },
    changedWallInput(value){
      console.log("new changed wall Value:", value);
      this.wallSearchObjects = value.search
      this.aggsObject["wallLocation"] = value.aggs
      this.initiateFacets()
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
      let queries = []
      if (this.textSearch){
        if (this.textSearch.length > 0){
          let textSearchmust = {}
          textSearchmust["query_string"] = {}
          textSearchmust.query_string["query"] = this.textSearch
          queries.push(textSearchmust)
        }
      }
      if ( this.caveSearchObjects){
        if (this.caveSearchObjects.length > 0){
          for (let caveSearchObject of this.caveSearchObjects){
            queries.push(caveSearchObject)
          }
        }
      }
      if (this.locationSearchObjects){
        if (this.locationSearchObjects.length > 0){
          for (let locationSearchObject of this.locationSearchObjects){
            queries.push(locationSearchObject)
          }
        }
      }
      if (this.wallSearchObjects){
        if (this.wallSearchObjects.length > 0){
          for (let wallLocationSearchObject of this.wallSearchObjects){
            queries.push(wallLocationSearchObject)
          }
        }
      }
      if (this.icoSearchObjects){
        if (this.icoSearchObjects.length > 0){
          for (let icoSearchObject of this.icoSearchObjects){
            queries.push(icoSearchObject)
          }
        }
      }

      return queries
    },
    initiateSearch(amount){
      let searchObject = {}
      this.relatedDepictions = []
      searchObject["size"] = amount
      searchObject["sort"] = ["cave.regionID", "cave.districtID", "cave.siteID", "cave.officialNumber"]
      searchObject["query"] = {}
      searchObject.query["bool"] = {}
      searchObject.query.bool["must"] = {}
      searchObject.query.bool.must = []
      let depictionmust = {}
      depictionmust["exists"] = {}
      depictionmust.exists["field"] = "depictionID"
      searchObject.query.bool.must.push(depictionmust)
      for (let query of this.buildQueries()){
        searchObject.query.bool.must.push(query)
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
          this.relatedDepictions = newDepictions
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
      let aggregations = {"aggs" : {}}
      for (let aggProp in this.aggsObject){
        console.log("aggsObject", aggProp, ":", this.aggsObject[aggProp]);
        let agg = JSON.parse(JSON.stringify( this.aggsObject[aggProp].agg))
        for (let filterProp in this.aggsObject){
          if (filterProp !== aggProp){
            if (this.aggsObject[filterProp].filter){
              let filter = JSON.parse(JSON.stringify(this.aggsObject[filterProp].filter))
              if (filterProp === "iconography" || filterProp === "wallLocation"){
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
                "field": "depictionID"
              }
            }
          ]
        }
      }
      aggregations["post_filter"] = {}
      aggregations["post_filter"]["bool"] = {}
      aggregations["post_filter"]["bool"]["must"] = []
      for (let query of this.buildQueries()){
        aggregations.post_filter.bool.must.push(query)
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

    let locationRes = this.$refs.locationSearch.prepSearch();
    this.locationSearchObjects = locationRes.search
    this.buildAgg(locationRes.aggs, "location")
    let caveRes = this.$refs.caveSearch.prepSearch();
    this.caveSearchObjects = caveRes.search
    this.buildCaveAggs(caveRes.aggs)
    let icoRes = this.$refs.iconographySearch.prepSearch();
    this.icoSearchObjects = icoRes.search
    this.aggsObject["iconography"] = icoRes.aggs
    this.initiateFacets()
    let wallLocationRes = this.$refs.wallLocationSearch.prepSearch();
    this.wallLocationSearch = wallLocationRes.search
    this.aggsObject["wallLocation"] = wallLocationRes.aggs
    this.initiateFacets()
  },
  beforeUpdate:function () {

  }
}
</script>

<style lang = "css" >
</style>