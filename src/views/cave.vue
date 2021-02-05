<template>
    <v-container>
    <v-card>
      <v-card-title>Information of cave {{getCaveLabel(result.cave)}} </v-card-title>


    <v-list-item two-line v-if=result.cave.officialNumber>
      <v-list-item-content>
        <v-list-item-title>Official Number</v-list-item-title>
        <v-list-item-subtitle>{{result.cave.officialNumber}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line v-if=result.cave.historicalName>
      <v-list-item-content>
        <v-list-item-title>Historical Name</v-list-item-title>
        <v-list-item-subtitle>{{result.cave.historicalName}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line v-if=result.cave.optionalHistoricName>
      <v-list-item-content>
        <v-list-item-title>Optional Historical Name</v-list-item-title>
        <v-list-item-subtitle>{{result.cave.optionalHistoricName}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line v-if=result.cave.firstDocumentedBy>
      <v-list-item-content>
        <v-list-item-title>First Documented By</v-list-item-title>
        <v-list-item-subtitle>{{result.cave.firstDocumentedBy}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line v-if=result.cave.firstDocumentedInYear>
      <v-list-item-content>
        <v-list-item-title>First Documented in Year</v-list-item-title>
        <v-list-item-subtitle>{{result.cave.firstDocumentedInYear}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line v-if=result.cave.caveGroupID>0>
      <v-list-item-content>
        <v-list-item-title>Cave Group</v-list-item-title>
        <v-list-item-subtitle>{{result.cave.caveGroupID}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line v-if=result.cave.siteID>
      <v-list-item-content>
        <v-list-item-title>Site</v-list-item-title>
        <v-list-item-subtitle>{{getSite(result.cave.siteID)}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line v-if=result.cave.districtID>
      <v-list-item-content>
        <v-list-item-title>District</v-list-item-title>
        <v-list-item-subtitle>{{getDistrict(result.cave.districtID)}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line v-if=result.cave.regionID>
      <v-list-item-content>
        <v-list-item-title>Region</v-list-item-title>
        <v-list-item-subtitle>{{getRegion(result.cave.regionID)}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
</v-card>
</v-container>
</template>

<script>
import {getCaveLabel,getSiteLabel, getRegionLabel,getDistrictLabel} from  "@/utils/helpers"
export default {

  name: 'cave',
  components: {
   },

  data () {

    console.log("cave started.");
    return {
          show: false

  }
  },
  computed: {

    result () {
      console.log("computing result of index: ",this.$store.state.result);
      console.log(this.$store.state.results[this.$store.state.result]);
      return this.$store.state.results[this.$store.state.result]._source
    }
  },
  methods: {
    getSite(ID){
        console.log("SiteID:",ID);
        return getSiteLabel(ID)
    },
    getRegion(ID){
        return getRegionLabel(ID)
    },
    getDistrict(ID){
        return getDistrictLabel(ID)
    },
    getCaveLabel(entry){
      return getCaveLabel(entry)
    }



  },

}
</script>

<style lang="css" scoped>

.v-tab {
  padding: 8px;
  min-width: 20px;
}
</style>
