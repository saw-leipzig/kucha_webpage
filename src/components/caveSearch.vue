<template>
  <v-card outlined>
    <v-list-item-subtitle>Cave</v-list-item-subtitle>
    <v-autocomplete
      v-model="caveTypesSelected"
      item-text="nameEN"
      return-object
      :items="caveTypes"
      label="Cave Types"
      multiple
      dense
      chips
      small-chips
      deletable-chips
      outlined>
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title>
              <v-badge
                :content="data.item.count"
                inline
                color="grey"
              >
                {{data.item.nameEN}}
              </v-badge>
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
    <v-autocomplete
      v-model="sitesSelected"
      item-text="name"
      return-object
      :items="sites"
      label="Sites"
      multiple
      dense
      chips
      small-chips
      deletable-chips
      outlined>
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title>
              <v-badge
                :content="data.item.count"
                inline
                color="grey"
              >
                {{data.item.name}}
              </v-badge>
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
    <v-autocomplete
      v-model="districtsSelected"
      item-text="name"
      :items="districts"
      label="Districts"
      return-object
      multiple
      dense
      chips
      small-chips
      deletable-chips
      outlined>
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title>
              <v-badge
                :content="data.item.count"
                inline
                color="grey"
              >
                {{data.item.name}}
              </v-badge>
          </v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
    <v-autocomplete
      v-model="regionsSelected"
      item-text="englishName"
      :items="regions"
      label="Regions"
      return-object
      multiple
      dense
      chips
      small-chips
      deletable-chips
      outlined>
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title>
              <v-badge
                :content="data.item.count"
                inline
                color="grey"
              >
                {{data.item.englishName}}
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
  name: 'caveSearch',
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
      caveTypesSelected:[],
      sitesSelected:[],
      districtsSelected:[],
      regionsSelected:[],
      caveTypes:[],
      sites:[],
      districts:[],
      regions:[],
      caveProps:[]
    }
  },
  computed: {

  },
  methods: {
    getCaveTypes(){
      this.caveTypes = []
      for (let caveType of this.$store.state.dic.caveType){
        let newCaveType = Object.assign({}, caveType)
        newCaveType["id"] = caveType.caveTypeID
        if (this.aggregations.caveType){
          newCaveType["count"] = findAgg(this.aggregations.caveType, newCaveType.id)
        } else {
          newCaveType["count"] = -1
        }
        if (newCaveType.count > 0){
          this.caveTypes.push(newCaveType)
        }
      }
      return this.caveTypes

    },
    getSites(){
      this.sites = []
      for (let site of this.$store.state.dic.sites){
        let newSite = Object.assign({}, site)
        newSite['id'] = site.siteID
        if (this.aggregations.site){
          newSite["count"] = findAgg(this.aggregations.site, newSite.id)
        } else {
          newSite["count"] = -1
        }
        if (newSite.count > 0){
          this.sites.push(newSite)
        }
      }
      return this.sites
    },
    getDistricts(){
      this.districts = []
      for (let district of this.$store.state.dic.districts){
        let newDistrict = Object.assign({}, district)
        newDistrict['id'] = district.districtID
        if (this.aggregations.district){
          newDistrict["count"] = findAgg(this.aggregations.district, newDistrict.id)
        } else {
          newDistrict["count"] = -1
        }
        if (newDistrict.count > 0){
          this.districts.push(newDistrict)
        }
      }
      return this.districts
    },
    getRegions(){
      this.regions = []
      for (let region of this.$store.state.dic.region){
        let newRegion = Object.assign({}, region)
        newRegion['id'] = region.regionID
        if (this.aggregations.region){
          newRegion["count"] = findAgg(this.aggregations.region, newRegion.id)
        } else {
          newRegion["count"] = -1
        }
        if (newRegion.count > 0){
          this.regions.push(newRegion)
        }
      }
      return this.regions
    },
    getAgg(item){
      console.log(item);
      return 10
    },
    getCaveProps(){
      this.getCaveTypes()
      this.getSites()
      this.getDistricts()
      this.getRegions()
    },
    prepSearch(){
      let searchObjects = []
      let aggsObject = {}
      aggsObject["caveType"] = {
        "field" :  this.prefix + "caveTypeID"
      }
      aggsObject["site"] = {
        "field" :  this.prefix + "siteID"
      }
      aggsObject["district"] = {
        "field" :  this.prefix + "districtID"
      }
      aggsObject["region"] = {
        "field" :  this.prefix + "regionID"
      }
      if (this.caveTypesSelected.length > 0){
        let caveTypeIDs = []
        for (let caveType of this.caveTypesSelected){
          let caveTypeID = caveType.caveTypeID
          caveTypeIDs.push(caveTypeID)
        }
        let caveTypePath = this.prefix + "caveTypeID"
        let caveTypeSearch = {"terms": {}}
        caveTypeSearch.terms[caveTypePath] = caveTypeIDs
        searchObjects.push(caveTypeSearch)
        aggsObject["caveType"]["ids"] = caveTypeIDs
      }
      if (this.sitesSelected.length > 0){
        let siteIDs = []
        for (let site of this.sitesSelected){
          siteIDs.push(site.siteID)
        }
        let sitePath = this.prefix + "siteID"
        let siteSearch = {
          "terms": {
          }
        }
        siteSearch.terms[sitePath] = siteIDs
        searchObjects.push(siteSearch)
        aggsObject["site"]["ids"] = siteIDs

      }
      if (this.districtsSelected.length > 0){
        let districts = []
        for (let district of this.districtsSelected){
          districts.push(district.districtID)
        }
        let districtPath = this.prefix + "districtID"
        let districtSearch = {
          "terms": {
          }
        }
        districtSearch.terms[districtPath] = districts
        searchObjects.push(districtSearch)
        aggsObject["district"]["ids"] = districts
      }
      if (this.regionsSelected.length > 0){
        let regionIds = []
        for (let region of this.regionsSelected){
          regionIds.push(region.regionID)
        }
        let regionPath = this.prefix + "regionID"
        let regionSearch = {
          "terms": {
          }
        }
        regionSearch.terms[regionPath] = regionIds
        searchObjects.push(regionSearch)
        aggsObject["region"]["ids"] = regionIds
      }
      let result = {
        "search": searchObjects,
        "aggs": aggsObject
      }
      return result

    },
    startSearch(){
      let result = this.prepSearch()
      this.$emit('clicked', result)
    },
  },
  watch: {
    'caveTypesSelected': function(newVal, oldVal) {
      this.startSearch()
    },
    'sitesSelected': function(newVal, oldVal) {
      console.log("sites changed");
      this.startSearch()
    },
    'districtsSelected': function(newVal, oldVal) {
      this.startSearch()
    },
    'regionsSelected': function(newVal, oldVal) {
      this.startSearch()
    },
    'aggregations': function(newVal, oldVal) {
      console.log("updated aggregations on caveSearch", this.aggregations);
      this.getCaveProps()
    },

  },
  mounted:function () {
    this.getCaveProps()
  },
  beforeUpdate:function () {
  }
}
</script>
<style lang="css" >
</style>
