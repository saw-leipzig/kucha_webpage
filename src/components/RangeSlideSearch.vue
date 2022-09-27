<template>
  <v-card outlined>
    <v-list-item-subtitle>{{label}}</v-list-item-subtitle>
    <v-range-slider
      v-model="chronologicalRangeSelected"
      :min="rangeMin"
      :max="rangeMax"
      :step="rangeStep"
      thumb-label="always"
      ticks
      hide-details
      thumb-size=46
      class="mt-5"
      label="Chronological Range"
    >
    <template v-slot:thumb-label="{ value }">
      {{ chronologicalRange[((value+425) / 25)] }}
    </template>
    </v-range-slider>

  </v-card>
</template>
<script>

export default {
  name: 'comboboxSearch',
  components: {
  },
  props: {
    prefix:{
      type: String,
      default: function(){
        return ""
      }
    },
    aggregations:{
      type: [],
      default: function(){
        return []
      }
    },
    label:{
      type: String,
      default: function(){
        return ""
      }
    },
    rangeMin:{
      type: String,
      default: function(){
        return "-42"
      }
    },
    rangeMax:{
      type: String,
      default: function(){
        return "2025"
      }
    },
    rangeStep:{
      type: String,
      default: function(){
        return "25"
      }
    },
    chronologicalDefault:{
      type: Array,
      default: function(){
        return [-425, 2025]
      }
    },
    chronologicalRange:{
      type: Array,
      default: function(){
        return []
      }
    }
  },
  data () {
    return {
      visible:true,
      relatedDepictions:[],
      loading: false,
      textSearch:"",
      keywords:[],
      chronologicalRangeSelected: [-425, 2025],
    }
  },
  computed: {

  },
  methods: {
    clear(){
      this.keywochronologicalRangeSelectedrds = this.chronologicalDefault;
    },
    prepSearch(){
      this.$log.debug("prepsearch", this.prefix);
      let searchObjects = {
        must: [],
        should: []
      }
      let aggsObject = {}
      if (this.chronologicalDefault[0] !== this.chronologicalRangeSelected[0]){
        let query = {}
        query = {
          "range": {
            "chronologicalRangeMin": {
              "lte": this.chronologicalRangeSelected[0]
            }
          }
        }
        searchObjects.must.push(query)
      }
      if (this.chronologicalDefault[1] !== this.chronologicalRangeSelected[1]){
        let query = {}
        query = {
          "range": {
            "chronologicalRangeMax": {
              "gte": this.chronologicalRangeSelected[1]
            }
          }
        }
        searchObjects.should.push(query)
      }
      let result = {}
      result['search'] = searchObjects
      result['aggs'] = aggsObject
      this.$log.debug("searchObject of keywords", result);
      return result
    },
    startSearch(){
      let result = this.prepSearch()
      this.$emit('clicked', result)
    },
  },
  watch: {
    'chronologicalRangeSelected': function(newVal, oldVal) {
      this.startSearch()
    },
    'aggregations': function(newVal, oldVal) {
      this.$log.debug("updated aggregations on bibKeyWord", this.aggregations);
    },

  },
  mounted:function () {
    this.$log.debug("rangeSlider stated", this.chronologicalDefault);
    this.chronologicalRangeSelected = JSON.parse(JSON.stringify(this.chronologicalDefault))
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
