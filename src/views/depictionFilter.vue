<template>
<div  style="width:100%">
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
        <v-row no-gutters class="mb-1" >
          <v-col  style="min-width: 265px;">
            <free-text-search ref="textSearch" :textSearchParam="getTextSearchParams" @clicked="onTextSearchInput"  @update="updateTextSearchInput" :aggregations="textFacets"></free-text-search>
          </v-col>
        </v-row>
        <v-row no-gutters >
          <v-col  style="min-width: 265px;" class="mr-1">
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
          <v-col class="ml-1" style="min-width: 300px;">
            <iconographySearch ref="iconographySearch" mode="depiction" :preSelected="selectedIcos" @clicked="changedIcoInput" prefix="relatedAnnotationList.tags." altPrefix="relatedIconographyList." :aggregations="icoFacets"></iconographySearch>
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
      <radioGroupSort :startValue="['shortName.keyword']" @clicked="changedSort" class="mt-5" label="Sort" :radioGroupData="getRadioGroupData"></radioGroupSort>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-card v-if="relatedDepictions.length > 0">
    <hideRelatedItems :iconography="iconography" v-if="relatedDepictions.length > 0" :title="resultsTitle" :items="relatedDepictions" v-bind:presentCave="true" v-bind:open="true"></hideRelatedItems>
  </v-card>
</div>

</template>
<script>
import {postQuery} from '@/services/repository'
import caveSearch from '@/components/caveSearch.vue'
import locationSearch from '@/components/locationSearch.vue'
import freeTextSearch from '@/components/freeTextSearch.vue'
import iconographySearch from '@/components/iconographySearch.vue'
import wallSearch from '@/components/wallSearch.vue'
import {getBuckets, buildAgg, prepareSortItem} from  "@/utils/helpers"
import {TextSearchDepiction} from '@/utils/constants.js'
import radioGroupSort from '@/components/radioGroupSort.vue'

export default {
  name: 'depictionFilter',
  components: {
    wallSearch,
    freeTextSearch,
    caveSearch,
    iconographySearch,
    locationSearch,
    radioGroupSort,
  },
  data () {
    return {
      panel: 0,
      aggregations:{},
      visible:[0],
      relatedDepictions:[],
      aggsObject:{},
      textSearch:"",
      caveSearchObjects:null,
      icoSearchObjects:null,
      locationSearchObjects:null,
      wallSearchObjects:null,
      resAmount:0,
      loading:false,
      sort: [],
      direction:"asc",
      iconography: []
    }
  },
  computed: {
    getRadioGroupData(){
      let radioGroupData = []
      radioGroupData.push({
        "label": "Title",
        "value": "title.keyword"
      })
      radioGroupData.push({
        "label": "Short Name",
        "value": "shortName.keyword"
      })
      radioGroupData.push({
        "label": "Cave",
        "value": ["cave.regionID", "cave.districtID", "cave.siteID", "cave.officialNumber"]
      })
      radioGroupData.push({
        "label": "Cave Types",
        "value": "caveTypeID"
      })
      radioGroupData.push({
        "label": "Site",
        "value": "siteID"
      })
      radioGroupData.push({
        "label": "District",
        "value": "districtID"
      })
      radioGroupData.push({
        "label": "Region",
        "value": "regionID"
      })
      radioGroupData.push({
        "label": "Location at wall",
        "value": "wallList.wallLocationID"
      })
      radioGroupData.push({
        "label": "Amount of Annotations",
        "value": {
          "_script": {
            "type": "number",
            "script": "params._source?.relatedAnnotationList?.length ?: 0",
            "order": "desc"
          }
        }
      })
      return radioGroupData
    },
    selectedIcos(){
      if (this.$route.query.iconography){
        this.$log.debug("hello", this.$route.query.iconography);
        return this.$route.query.iconography
      } else {
        return null
      }
    },
    getTextSearchParams(){
      return TextSearchDepiction
    },
    caveFacets(){
      this.$log.debug("aggregations caveFacetts: ", this.aggregations);
      let aggregations = {}
      if (this.aggregations){
        if (this.aggregations["caveType"]){
          aggregations["caveType"] = getBuckets(this.aggregations["caveType"])
        }
        if (this.aggregations["district"]){
          aggregations["district"] = getBuckets(this.aggregations["district"])
        }
        if (this.aggregations["region"]){
          aggregations["region"] = getBuckets(this.aggregations["region"])
        }
        if (this.aggregations["site"]){
          aggregations["site"] = getBuckets(this.aggregations["site"])
        }
      }
      return aggregations
    },
    icoFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = getBuckets(this.aggregations["iconography"])
      }
      this.$log.debug("aggregations icoFacetts: ", aggregations);
      return aggregations
    },
    locationFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = getBuckets(this.aggregations["location"])
      }
      this.$log.debug("aggregations locationFacetts: ", aggregations);
      return aggregations
    },
    textFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = getBuckets(this.aggregations["text"])
      }
      this.$log.debug("aggregations textFacetts: ", aggregations);
      return aggregations
    },
    wallLocationFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = getBuckets(this.aggregations["wallLocation"])
      }
      this.$log.debug("aggregations wallLocationFacetts: ", aggregations);
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
    changedSort(value){
      this.$log.debug("new changed sort Value:", value);
      this.sort = value[0]
      this.direction = value[1]
      this.relatedDepictions = []
    },
    prepAggs(){
      this.$log.debug("prepAggs started");
      let locationRes = this.$refs.locationSearch.prepSearch();
      this.locationSearchObjects = locationRes.search
      buildAgg(locationRes.aggs, "location", this.aggsObject)
      let caveRes = this.$refs.caveSearch.prepSearch();
      this.caveSearchObjects = caveRes.search
      this.buildCaveAggs(caveRes.aggs)
      let icoRes = this.$refs.iconographySearch.prepSearch();
      this.icoSearchObjects = icoRes.search
      this.aggsObject["iconography"] = icoRes.aggs
      let wallLocationRes = this.$refs.wallLocationSearch.prepSearch();
      this.wallLocationSearch = wallLocationRes.search
      this.aggsObject["wallLocation"] = wallLocationRes.aggs

      this.initiateFacets()
    },
    clear(){
      this.$refs.textSearch.clear();
      this.$refs.caveSearch.clear();
      this.$refs.locationSearch.clear();
      this.$refs.wallLocationSearch.clear();
      this.$refs.iconographySearch.clear();
      this.textSearch = "";
      this.prepAggs();
    },
    onTextSearchInput(value) {
      this.textSearch = value.search
      // this.buildTextAggs(value.aggs)
      this.initiateFacets()
    },
    updateTextSearchInput(value) {
      this.textSearch = value.search
    },

    changedCaveInput(value){
      this.$log.debug("initiate facets over changedCaveInput");
      this.$log.debug("new changed Cave Value:", value);
      this.caveSearchObjects = value.search
      this.buildCaveAggs(value.aggs)
      this.initiateFacets()
      this.$log.debug("built aggs:", this.aggsObject);
    },
    changedIcoInput(value){
      this.$log.debug("initiate facets over changedIcoInput");
      this.$log.debug("new changed Ico Value:", value);
      this.icoSearchObjects = value.search
      this.aggsObject["iconography"] = value.aggs
      this.$log.debug("iconography:", value.ico);
      this.iconography = value.ico
      this.initiateFacets()
    },
    changedLocationInput(value){
      this.$log.debug("initiate facets over changedLicationInput");
      this.$log.debug("new changed location Value:", value);
      this.locationSearchObjects = value.search
      buildAgg(value.aggs, "location", this.aggsObject)
      this.initiateFacets()
    },
    changedWallInput(value){
      this.$log.debug("initiate facets over changedWallInput");
      this.$log.debug("new changed wall Value:", value);
      this.wallSearchObjects = value.search
      this.aggsObject["wallLocation"] = value.aggs
      this.initiateFacets()
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
      this.$log.debug("built aggsObject", this.aggsObject);
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
      this.$refs.textSearch.update()
      let searchObject = {}
      this.relatedDepictions = []
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
      let depictionmust = {}
      depictionmust["exists"] = {}
      depictionmust.exists["field"] = "depictionID"
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
          this.$log.debug("search results", res);
          var newDepictions = []
          this.resAmount = res.data.hits.total.value
          for ( var entry of res.data.hits.hits){
            newDepictions.push(entry._source)
          }
          this.loading = false
          this.relatedDepictions = newDepictions
        })
        .catch((error) => {
          this.$log.debug(error)
          this.loading = false
        })
      this.$log.debug("search initiated:", searchObject);
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
      if (!this.stoppAggs){
        this.$log.debug("initiateFacets");
        this.relatedDepictions = []
        let aggregations = {"aggs" : {}}
        for (let aggProp in this.aggsObject){
          this.$log.debug("aggsObject", aggProp, ":", this.aggsObject[aggProp]);
          let agg = JSON.parse(JSON.stringify( this.aggsObject[aggProp].agg))
          for (let filterProp in this.aggsObject){
            if (filterProp !== aggProp){
              if (this.aggsObject[filterProp].filter){
                let filter = JSON.parse(JSON.stringify(this.aggsObject[filterProp].filter))
                if (filterProp === "iconography" || filterProp === "wallLocation"){
                  agg = this.appendFilterToAgg(agg, filter, "reverse_nested")
                  this.$log.debug("append filter to agg returned:", agg, "for: ", filterProp);
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
            this.$log.debug("aggs results", res.data.aggregations);
            this.aggregations = res.data.aggregations
            this.resAmount = res.data.hits.total.value
          })
          .catch((error) => {
            this.$log.debug(error)
          })
      }
    },
  },
  watch: {
    'panel': function(newVal, oldVal) {
      this.$log.debug("updated caveTypes panel", newVal);
    },
    'aggregations': function(newVal, oldVal) {
      this.$log.debug("updated aggregations on should", newVal);
    },

  },
  mounted:function () {
    this.$log.debug("started Depiction filter", this.$route);
    this.prepAggs();
  },
  beforeUpdate:function () {

  }
}
</script>

<style lang = "css" >

</style>