<template>
<div>
    <caveInf :showRelatedDepictions="true" v-if=cave :cave="cave"></caveInf>
</div>
</template>
<script>
import { getItemById } from '@/services/repository'
import caveInf from '@/components/caveInf'
import depictionInf from '@/components/depictionInf'

export default {
  name: 'cave',
  components: {
    caveInf,
    depictionInf,
  },

  data () {
    return {
      cave: {},
      showRelatedItems:false
    }
  },
  computed: {
  },
  methods: {
    getNewItem(){
      console.log("cave in stored results not found, starting new search");
      var params = {}
      params['type'] = "caveID"
      params['id'] = this.$route.params.id
      getItemById(params)
        .then( res => {
          console.log("results", res)
          if (res.data.hits.hits.length > 0){
            this.$store.commit('setResults', res.data.hits.hits)
            this.getCave()
          } else {
            this.error = true
          }
        }).catch(function (error) {
          console.log(error)
          this.error = true
        })
      return null
    },
    getCave(){
      if (Object.keys(this.$store.state.results).length !== 0){
        var res = this.$store.state.results.find(item => item._source.caveID === parseInt(this.$route.params.id))
        console.log("res after finding in results:", res);
        if (res !== undefined){
          console.log("reutrning stored result");
          this.cave = res._source
        } else {
          this.getNewItem()
        }
      } else {
        this.getNewItem()
      }
    },
  },
  watch: {
    $route(to, from) {
      console.log("route changed");
      this.getCave()
    }
  },
  mounted:function () {
    console.log("setting error false");
    this.error = false;
    this.getCave()
  },
  beforeUpdate:function () {

  }
}
</script>

<style lang="css" >
</style>
