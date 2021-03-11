<template>
  <div>
    <bibliographyInf v-if=bibliography :bibliography="bibliography"></bibliographyInf>
    <hideRelatedItems v-if="relatedDepictions.length>0" title="Related Painted Representations" :items="relatedDepictions"></hideRelatedItems>
  </div>
</template>
<script>
import {getItemById, getDepictionByBibliography} from '@/services/repository'
import bibliographyInf from '@/components/bibliographyInf'

export default {
  name: 'bibliography',
  components: {
    bibliographyInf,
  },

  data () {
    return {
      error:false,
      relatedDepictions:[],
    }
  },
  computed: {
  },
  methods: {
    bibliography(){
      this.getRelatedDepictions()
      var res = this.$store.state.results.find(item => item._source.annotatedBibliographyID === parseInt(this.$route.params.id))
      console.log("res after finding in results:", res);
      if (res !== undefined){
        console.log("reutrning stored result");
        return res._source
      } else {
        console.log("cave in stored results not found, starting new search");
        var params = {}
        params['type'] = "annotatedBibliographyID"
        params['id'] = this.$route.params.id
        getItemById(params)
          .then( res => {
            console.log("results", res)
            if (res.data.hits.hits.length > 0){
              this.$store.commit('setResults', res.data.hits.hits)
            } else {
              this.error = true
            }
          }).catch(function (error) {
            console.log(error)
            this.error = true
          })
        return null
      }
    },
    getRelatedDepictions(){
      var params = {}
      params.annotatedBibliographyID = [parseInt(this.$route.params.id)]
      getDepictionByBibliography(params)
        .then( res => {
          var newDepictions = []
          for (var entry of res.data.hits.hits){
            newDepictions.push(entry._source)
          }
          this.relatedDepictions = newDepictions
          console.log("new Depictions:", newDepictions);
        }).catch(function (error) {
          console.log(error)
        })
    },
  },
  watch: {
  },
  mounted:function () {
    console.log("setting error false");
    this.error = false;
  },
  beforeUpdate:function () {

  }
}
</script>

<style lang="css" >
</style>
