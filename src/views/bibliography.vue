<template>
  <div style="width:100%">
    <bibliographyInf v-if="Object.keys(bibliography).length > 0" :bibliographyDefault="bibliography" ></bibliographyInf>
    <pageNotFound v-if="notFound" ></pageNotFound>
  </div>
</template>
<script>
import {getItemById} from '@/services/repository'
import bibliographyInf from '@/components/bibliographyInf'
import pageNotFound from '@/views/pageNotFound'

export default {
  name: 'bibliography',
  components: {
    bibliographyInf,
    pageNotFound,
  },

  data () {
    return {
      notFound:false,
      bibliography:{},
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
          if (res.data.hits.hits[0]){
            this.notFound = false
            this.$store.commit('setResults', res.data.hits.hits)
            this.bibliography = res.data.hits.hits[0]._source
          } else {
            this.notFound = true
          }
        }).catch(function (error) {
          console.log(error)
          this.notFound = true
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
    this.page = false;
    this.getBibliography()
  },
  beforeUpdate:function () {

  }
}
</script>

<style lang="css" >
</style>
