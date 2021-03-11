<template>
    <iconographyInf v-if=iconography :iconography="iconography"></iconographyInf>
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
    }
  },
  computed: {
  },
  methods: {
    iconography(){
      var res = this.$store.state.results.find(item => item._source.iconographyID === parseInt(this.$route.params.id))
      console.log("res after finding in results:", res);
      if (res !== undefined){
        console.log("reutrning stored result");
        return res._source
      } else {
        console.log("cave in stored results not found, starting new search");
        var params = {}
        params['type'] = "iconographyID"
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
