<template>
  <v-card outlined>
    <v-list-item-subtitle>Cave</v-list-item-subtitle>
    <v-select v-model="caveTypes" :items="getCaveTypes" label="Cave Types" multiple dense outlined></v-select>
    <v-select v-model="sites" :items="getSites" label="Sites" multiple dense outlined></v-select>
    <v-select v-model="districts" :items="getDistricts" label="Districts" multiple dense outlined></v-select>
    <v-select v-model="regions" :items="getRegions" label="Regions" multiple dense outlined></v-select>
  </v-card>
</template>
<script>

export default {
  name: 'caveSearch',
  components: {
  },
  props: {
    prefix:""
  },

  data () {
    return {
      visible:true,
      relatedDepictions:[],
      loading: false,
      textSearch:"",
      caveTypes:[],
      sites:[],
      districts:[],
      regions:[],
      caveProps:[]
    }
  },
  computed: {
    getCaveTypes(){
      let caveTypes = []
      for (let caveType of this.$store.state.dic.caveType){
        caveTypes.push(caveType.nameEN)
      }
      return caveTypes
    },
    getSites(){
      let sites = []
      for (let site of this.$store.state.dic.sites){
        sites.push(site.name)
      }
      return sites
    },
    getDistricts(){
      let districts = []
      for (let district of this.$store.state.dic.districts){
        districts.push(district.name)
      }
      return districts
    },
    getRegions(){
      let regions = []
      for (let region of this.$store.state.dic.region){
        regions.push(region.englishName)
      }
      return regions
    }
  },
  methods: {
    getCaveProps(){
      this.caveProps = []
      let caveTypes = {
        "items":this.getCaveTypes,
        "name":"Cave Types",
        "model":this.caveTypes
      }
      this.caveProps.push(caveTypes)
      let sites = {
        "items":this.getSites,
        "name":"Sites",
        "model":this.sites
      }
      this.caveProps.push(sites)
      let districts = {
        "items":this.getDistricts,
        "name":"Districts",
        "model":this.districts
      }
      this.caveProps.push(districts)
      let regions = {
        "items":this.getRegions,
        "name":"Regions",
        "model":this.regions
      }
      this.caveProps.push(regions)
    },
    startSearch(){
      let searchObjects = []
      if (this.caveTypes.length > 0){
        let caveTypeIDs = []
        for (let caveType of this.caveTypes){
          let caveTypeID = this.$store.state.dic.caveType.find(el => el.nameEN === caveType).caveTypeID
          caveTypeIDs.push(caveTypeID)
        }
        let caveTypePath = this.prefix + "caveTypeID"
        let caveTypeSearch = {"terms": {}}
        caveTypeSearch.terms[caveTypePath] = caveTypeIDs
        searchObjects.push(caveTypeSearch)
      }
      if (this.sites.length > 0){
        let siteIDs = []
        for (let site of this.sites){
          let siteID = this.$store.state.dic.sites.find(el => el.name === site).siteID
          siteIDs.push(siteID)
        }
        let sitePath = this.prefix + "siteID"
        let siteSearch = {
          "terms": {
          }
        }
        siteSearch.terms[sitePath] = siteIDs
        searchObjects.push(siteSearch)
      }
      if (this.districts.length > 0){
        let districts = []
        for (let district of this.districts){
          let districtID = this.$store.state.dic.districts.find(el => el.name === district).districtID
          districts.push(districtID)
        }
        let districtPath = this.prefix + "districtID"
        let districtSearch = {
          "terms": {
          }
        }
        districtSearch.terms[districtPath] = districts
        searchObjects.push(districtSearch)
      }
      if (this.regions.length > 0){
        let regionIds = []
        for (let region of this.regions){
          let regionID = this.$store.state.dic.region.find(el => el.englishName === region).regionID
          regionIds.push(regionID)
        }
        let regionPath = this.prefix + "regionID"
        let regionSearch = {
          "terms": {
          }
        }
        regionSearch.terms[regionPath] = regionIds
        searchObjects.push(regionSearch)
      }
      console.log("searchObject", searchObjects);
      this.$emit('clicked', searchObjects)
    },
  },
  watch: {
    'caveTypes': function(newVal, oldVal) {
      this.startSearch()
    },
    'sites': function(newVal, oldVal) {
      this.startSearch()
    },
    'districts': function(newVal, oldVal) {
      this.startSearch()
    },
    'regions': function(newVal, oldVal) {
      this.startSearch()
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
