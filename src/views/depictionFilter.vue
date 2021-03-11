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
              <v-col>
              <caveSearch @clicked="changedCaveInput" prefix="cave."></caveSearch>
              </v-col>
              <v-col>
              <locationSearch @clicked="changedCaveInput" prefix="cave."></locationSearch>
              </v-col>
            </v-col>
            <v-col  style="min-width: 265px;">
              <iconographySearch @clicked="changedIcoInput" prefix="relatedAnnotationList.tags."></iconographySearch>
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

export default {
  name: 'depictionFilter',
  components: {
    freeTextSearch,
    caveSearch,
    iconographySearch,
    locationSearch,
  },
  data () {
    return {
      panel: 0,
      visible:[0],
      relatedDepictions:[],
      textSearch:"",
      caveSearchObjects:[],
      icoSearchObjects:[],
      locationSearchObjects:[],
      resAmount:0,
      loading:false
    }
  },
  computed: {
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
    onClickChild (value) {
      this.textSearch = value
      this.initiateSearch()
    },

    changedCaveInput(value){
      console.log("new changed Cave Value:", value);
      this.caveSearchObjects = value
      this.initiateSearch()
    },
    changedIcoInput(value){
      console.log("new changed Ico Value:", value);
      this.icoSearchObjects = value
      this.initiateSearch()
    },
    changedLocationInput(value){
      console.log("new changed Ico Value:", value);
      this.locationSearchObjects = value
      this.initiateSearch()
    },
    initiateSearch(){
      let searchObject = {}
      this.relatedDepictions = []
      searchObject["size"] = 2000
      searchObject["sort"] = ["cave.regionID", "cave.districtID", "cave.siteID", "cave.officialNumber"]
      searchObject["query"] = {}
      searchObject.query["bool"] = {}
      searchObject.query.bool["must"] = {}
      searchObject.query.bool.must = []
      let depictionFilter = {}
      depictionFilter["exists"] = {}
      depictionFilter.exists["field"] = "depictionID"
      searchObject.query.bool.must.push(depictionFilter)
      if (this.textSearch.length > 0){
        let textSearchFilter = {}
        textSearchFilter["query_string"] = {}
        textSearchFilter.query_string["query"] = this.textSearch
        searchObject.query.bool.must.push(textSearchFilter)
      }
      if (this.caveSearchObjects.length > 0){
        for (let caveSearchObject of this.caveSearchObjects){
          searchObject.query.bool.must.push(caveSearchObject)
        }
      }
      if (this.locationSearchObjects.length > 0){
        for (let locationSearchObject of this.locationSearchObjects){
          searchObject.query.bool.must.push(locationSearchObject)
        }
      }
      if (this.icoSearchObjects.length > 0){
        for (let icoSearchObject of this.icoSearchObjects){
          searchObject.query.bool.must.push(icoSearchObject)
        }
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
  },
  watch: {
    'panel': function(newVal, oldVal) {
      console.log("updated caveTypes panel", newVal);
    },

  },
  mounted:function () {
    console.log("started Depiction Filter");
  },
  beforeUpdate:function () {

  }
}
</script>

<style lang = "css" >
</style>