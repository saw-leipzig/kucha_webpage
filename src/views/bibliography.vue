<template>
  <div style="width:100%">
  <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
    <v-breadcrumbs
      :items="$store.state.breadcrumb"
    >
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :href="item.href"
          :disabled="item.disabled"
        >
          <span style="color: black;">
            {{item.text}}
          </span>
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <bibliographyInf v-if="Object.keys(bibliography).length > 0" :bibliographyDefault="bibliography" ></bibliographyInf>
    <pageNotFound v-if="notFound" ></pageNotFound>
  </v-card>
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
      this.$log.debug("cave in stored results not found, starting new search");
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
      this.$log.debug("initiate getting bibEntry");
      if (Object.keys(this.$store.state.results).length !== 0){
        var res = this.$store.state.results.find(item => item._source.annotatedBibliographyID === parseInt(this.$route.params.id))
        this.$log.debug("res after finding in results:", res);
        if (res !== undefined){
          this.$log.debug("reutrning stored result");
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
      this.$log.debug("route changed");
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
