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
    <caveInf :setWidth="true" :showRelatedDepictions="true" v-if="Object.keys(cave).length>0" :caveDefault="cave"></caveInf>
    <pageNotFound v-if="notFound" ></pageNotFound>
  </v-card>
</div>
</template>
<script>
import { getItemById } from '@/services/repository'
import caveInf from '@/components/caveInf'
import depictionInf from '@/components/depictionInf'
import pageNotFound from '@/views/pageNotFound'

export default {
  name: 'cave',
  components: {
    caveInf,
    depictionInf,
    pageNotFound,
  },

  data () {
    return {
      cave: {},
      showRelatedItems:false,
      notFound:false,
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
          if (res.data.hits.hits[0]){
            this.notFound = false
            this.$store.commit('setResults', res.data.hits.hits)
            this.getCave()
          } else {
            this.notFound = true
          }
        }).catch(function (error) {
          console.log(error)
          this.notFound = true
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
    this.notFound = false;
    this.getCave()
  },
  beforeUpdate:function () {

  }
}
</script>

<style lang="css" >
</style>
