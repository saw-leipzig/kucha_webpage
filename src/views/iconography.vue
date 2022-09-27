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
    <iconographyInf v-if="Object.keys(iconography).length>0" :iconography="iconography" :typical="idealTypical"></iconographyInf>
    <pageNotFound v-if="notFound" ></pageNotFound>
  </v-card>
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
      this.$log.debug("cave in stored results not found, starting new search");
      var params = {}
      params['type'] = "iconographyID"
      params['id'] = this.$route.params.id
      getItemById(params)
        .then( res => {
          this.$log.debug("results", res.data.hits.hits)
          if (res.data.hits.hits[0]){
            this.notFound = false
            this.$store.commit('setResults', res.data.hits.hits)
            for (let hit of res.data.hits.hits) {
              if (hit.typicalID){
                this.$log.debug("found typical!", hit);
                this.idealTypical = hit._source
              } else {
                this.iconography = hit._source
              }
            }
          } else {
            this.notFound = true
          }
        }).catch(function (error) {
          this.$log.debug(error)
          this.notFound = true
        })
      return null
    },
    getIconography(){
      if (Object.keys(this.$store.state.results).length !== 0){
        var res = this.$store.state.results.find(item => ((item._source.iconographyID === parseInt(this.$route.params.id)) && (item._source.typicalID === undefined)))
        this.$log.debug("res after finding in results:", res);
        if (res !== undefined){
          this.$log.debug("reutrning stored result");
          this.iconography = res._source
          var resTypical = this.$store.state.results.find(item => ((item._source.iconographyID === parseInt(this.$route.params.id)) && (item._source.typicalID)))
          if (resTypical !== undefined){
            this.$log.debug();
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
      this.$log.debug("route changed");
      this.getIconography()
    }
  },
  mounted:function () {
    this.$log.debug("setting error false");
    this.error = false;
    this.getIconography();
  },
  updated() {
    this.$log.debug("setting error false");
    this.error = false;
    this.getIconography();
  },
}
</script>

<style lang="css" >
</style>
