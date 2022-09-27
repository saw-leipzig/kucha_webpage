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
            <depictionInf v-if="Object.keys(depictionEntry).length>0" :annotations="annotations" :depiction="depictionEntry" v-bind:presentCave="true" :preSelected="[]"></depictionInf>
            <pageNotFound v-if="notFound" ></pageNotFound>
  </v-card>
  </div>

</template>

<script>
import { getItemById } from '@/services/repository'
import depictionInf from '@/components/depictionInf'
import pageNotFound from '@/views/pageNotFound'

export default {

  name: 'depiction',
  components: {
    depictionInf,
    pageNotFound
  },

  data () {
    return {
      depictionEntry:{},
      annotations:[],
      notFound:false,
    }
  },
  computed: {
  },
  methods:{
    getNewDepiction(){
      var params = {}
      params['type'] = "depictionID"
      params['id'] = this.$route.params.id
      getItemById(params)
        .then( res => {
          this.$log.debug("annotoriousID = ", params);
          this.$store.commit('setResults', res.data.hits.hits)
          if (res.data.hits.hits[0]){
            this.notFound = false
            this.depictionEntry = res.data.hits.hits[0]._source
          } else {
            this.notFound = true
          }
        }).catch(function (error) {
          this.$log.debug(error)
        })
    },
    getDepiction() {
      if (this.$route.params.annotoriousID) {
        this.annotations.push(this.$route.params.annotoriousID)
        this.$log.debug("annotation:", this.annotations);
      }
      if (Object.keys(this.$store.state.results).length !== 0){
        var res = this.$store.state.results.find(item => item._source.depictionID === parseInt(this.$route.params.id))
        if (res === undefined){
          this.getNewDepiction()
        } else {
          this.depictionEntry = res._source
        }
      } else {
        this.getNewDepiction()
      }
    }
  },

  mounted:function() {
    this.getDepiction()
    this.$log.debug("mounted");

  },
  beforeUpdated:function() {
    this.getDepiction()
    this.$log.debug("beforeUpdated");

  },
  watch: {
    $route(to, from) {
      this.$log.debug("route changed");
      this.getDepiction()
    }
  }

}
</script>

<style lang="css" >

.v-tab {
  padding: 8px;
  min-width: 20px;
}

.v-treeview-node__content, .v-treeview-node__label {
  flex-shrink: 1;
  line-break: normal;
}
.v-treeview-node__root {
  height: auto;
}
.v-treeview-node {
  min-height: 10px;
}
.v-treeview--dense .v-treeview-node__root
{
  max-height: 100%;
  min-height: 10px;
}
.v-treeview {
  max-height: 100%;
}
</style>
