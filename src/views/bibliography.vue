<template>
  <div>
    <bibliographyInf v-if="Object.keys(bibliography).length > 0" :bibliographyDefault="bibliography" ></bibliographyInf>
  </div>
</template>
<script>
import {getItemById} from '@/services/repository'
import bibliographyInf from '@/components/bibliographyInf'

export default {
  name: 'bibliography',
  components: {
    bibliographyInf,
  },

  data () {
    return {
      error:false,
      bibliography:{}
    }
  },
  computed: {
  },
  methods: {
    getNewBibliography(){
      console.log("cave in stored results not found, starting new search");
      var params = {}
      params['type'] = "annotatedBibliographyID"
      params['id'] = this.$route.params.id
      getItemById(params)
        .then( res => {
          console.log("results", res)
          if (res.data.hits.hits.length > 0){
            this.$store.commit('setResults', res.data.hits.hits)
            this.bibliography = res.data.hits.hits[0]._source
          } else {
            this.error = true
          }
        }).catch(function (error) {
          console.log(error)
          this.error = true
        })
    },
    getBibliography(){
      console.log("initiate getting bibEntry");
      if (Object.keys(this.$store.state.results).length !== 0){
        var res = this.$store.state.results.find(item => item._source.annotatedBibliographyID === parseInt(this.$route.params.id))
        console.log("res after finding in results:", res);
        if (res !== undefined){
          console.log("reutrning stored result");
          this.bibliography = res._source
        } else {
          this.getNewBibliography()
        }
      } else {
        this.getNewBibliography()
      }
    },
  },
  watch: {
    $route(to, from) {
      console.log("route changed");
      this.getBibliography()
    }
  },
  mounted:function () {
    console.log("setting error false");
    this.error = false;
    this.getBibliography()
  },
  beforeUpdate:function () {

  }
}
</script>

<style lang="css" >
</style>
