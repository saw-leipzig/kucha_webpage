<template>
<div style="width:100%">
    <iconographyInf v-if="Object.keys(iconography).length>0" :iconography="iconography" :typical="idealTypical"></iconographyInf>
    <pageNotFound v-if="notFound" ></pageNotFound>
</div>
</template>
<script>
import {getItemById} from '@/services/repository'
import iconographyInf from '@/components/iconographyInf'
import pageNotFound from '@/views/pageNotFound'

export default {
  name: 'iconography',
  components: {
    iconographyInf,
    pageNotFound,
  },

  data () {
    return {
      error:false,
      iconography: {},
      idealTypical: undefined,
      notFound:false,
    }
  },
  computed: {
  },
  methods: {
    getNewIconogrphy(){
      console.log("cave in stored results not found, starting new search");
      var params = {}
      params['type'] = "iconographyID"
      params['id'] = this.$route.params.id
      getItemById(params)
        .then( res => {
          console.log("results", res.data.hits.hits)
          if (res.data.hits.hits[0]){
            this.notFound = false
            this.$store.commit('setResults', res.data.hits.hits)
            for (let hit of res.data.hits.hits) {
              if (hit.typicalID){
                console.log("found typical!", hit);
                this.idealTypical = hit._source
              } else {
                this.iconography = hit._source
              }
            }
          } else {
            this.notFound = true
          }
        }).catch(function (error) {
          console.log(error)
          this.notFound = true
        })
      return null
    },
    getIconography(){
      if (Object.keys(this.$store.state.results).length !== 0){
        var res = this.$store.state.results.find(item => ((item._source.iconographyID === parseInt(this.$route.params.id)) && (item._source.typicalID === undefined)))
        console.log("res after finding in results:", res);
        if (res !== undefined){
          console.log("reutrning stored result");
          this.iconography = res._source
          var resTypical = this.$store.state.results.find(item => ((item._source.iconographyID === parseInt(this.$route.params.id)) && (item._source.typicalID)))
          if (resTypical !== undefined){
            console.log();
            this.idealTypical = resTypical._source
          }
        } else {
          this.getNewIconogrphy()
        }
      } else {
        this.getNewIconogrphy()
      }
    },
  },
  watch: {
    $route(to, from) {
      console.log("route changed");
      this.getIconography()
    }
  },
  mounted:function () {
    console.log("setting error false");
    this.error = false;
    this.getIconography();
  },
  updated() {
    console.log("setting error false");
    this.error = false;
    this.getIconography();
  },
}
</script>

<style lang="css" >
</style>
