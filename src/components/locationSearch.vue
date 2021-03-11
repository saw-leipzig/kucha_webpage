<template>
  <v-card outlined>
    <v-list-item-subtitle>Location</v-list-item-subtitle>
    <v-select
      v-model="locations"
      :items="getlocations"
      label="Location"
      multiple
      dense
      outlined>
    </v-select>
  </v-card>
</template>
<script>

export default {
  name: 'locationSearch',
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
      locations:[],
    }
  },
  computed: {
    getlocations(){
      let locations = []
      for (let location of this.$store.state.dic.location){
        locations.push(location.name + ", " + location.town + ", " + location.country)
      }
      return locations
    },
  },
  methods: {
    startSearch(){
      let searchObjects = []
      if (this.locations.length > 0){
        let locationIDs = []
        for (let location of this.locations){
          let locationID = this.$store.state.dic.location.find(el => el.name + ", " + el.town + ", " + el.country === location).locationID
          locationIDs.push(locationID)
        }
        let locationPath = this.prefix + "location.locationID"
        let locationSearch = {
          "terms": {
          }
        }
        locationSearch.terms[locationPath] = locationIDs
        searchObjects.push(locationSearch)
      }
      console.log("searchObject", searchObjects);
      this.$emit('clicked', searchObjects)
    },
  },
  watch: {
    'locations': function(newVal, oldVal) {
      this.startSearch()
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
