<template>
  <v-card outlined>
    <v-list-item-subtitle>Location</v-list-item-subtitle>
    <v-autocomplete
      v-model="locations"
      :items="getlocations"
      item-text="fullName"
      id="locationID"
      label="Location"
      multiple
      dense
      chips
      small-chips
      deletable-chips
      return-object
      outlined>
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title>
              <v-badge
                :content="data.item.count"
                inline
                color="grey"
              >
                {{data.item.fullName}}
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
  name: 'locationSearch',
  components: {
  },
  props: {
    prefix:"",
    aggregations:{}
  },
  data () {
    return {
      update:false,
      locations:[],
    }
  },
  computed: {
    getlocations(){
      var locations = []
      for (let location of this.$store.state.dic.location){
        location["fullName"] = location.name
        if (location.town){
          location["fullName"] += ", " + location.town
        }
        if (location.country){
          location["fullName"] += ", " + location.country
        }
        if (this.aggregations){
          location["count"] = findAgg(this.aggregations, location.locationID)
        }
        if (location.count > 0){
          locations.push(location)
        }
      }
      return locations
    },
  },
  methods: {
    clear(){
      this.update = false
      this.locations = [];
      this.update = true
    },
    prepSearch(){
      let searchObjects = []
      let aggsObject = {}
      let locationPath = this.prefix + "locationID"
      aggsObject["location"] = {
        "field" :  locationPath
      }
      if (this.locations.length > 0){
        let locationIDs = []
        for (let location of this.locations){
          locationIDs.push(location.locationID)
        }
        let locationSearch = {
          "terms": {
          }
        }
        locationSearch.terms[locationPath] = locationIDs
        aggsObject["location"]["ids"] = locationIDs
        searchObjects.push(locationSearch)
      }
      let result = {}
      result['search'] = searchObjects
      result['aggs'] = aggsObject
      console.log("searchObject of location", result);
      return result
    },
    startSearch(){
      let result = this.prepSearch()
      this.$emit('clicked', result)
    },
  },
  watch: {
    'locations': function(newVal, oldVal) {
      if (this.update){
        this.startSearch()
      }
    },
    'aggregations': function(newVal, oldVal) {
      console.log("updated aggregations on location", this.aggregations);
    },

  },
  mounted:function () {
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
