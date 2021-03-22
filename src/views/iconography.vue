<template>
    <iconographyInf v-if="Object.keys(iconography).length>0" :iconography="iconography"></iconographyInf>
</template>
<script>
import {getItemById} from '@/services/repository'
import iconographyInf from '@/components/iconographyInf'

export default {
  name: 'iconography',
  components: {
    iconographyInf,
  },

  data () {
    return {
      error:false,
      iconography: {}
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
          console.log("results", res)
          if (res.data.hits.hits.length > 0){
            this.$store.commit('setResults', res.data.hits.hits)
            this.iconography = res.data.hits.hits[0]._source
          } else {
            this.error = true
          }
        }).catch(function (error) {
          console.log(error)
          this.error = true
        })
      return null
    },
    getIconography(){
      if (Object.keys(this.$store.state.results).length !== 0){
        var res = this.$store.state.results.find(item => item._source.iconographyID === parseInt(this.$route.params.id))
        console.log("res after finding in results:", res);
        if (res !== undefined){
          console.log("reutrning stored result");
          this.iconography = res._source
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
