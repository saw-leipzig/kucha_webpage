<template>

  <div>
            <depictionInf v-if="Object.keys(depictionEntry).length>0" :annotations="annotations" :depiction="depictionEntry" v-bind:presentCave="true"></depictionInf>
  </div>

</template>

<script>
import { getItemById } from '@/services/repository'
import depictionInf from '@/components/depictionInf'

export default {

  name: 'depiction',
  components: {
    depictionInf
  },

  data () {
    return {
      depictionEntry:{},
      annotations:[]
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
          console.log("annotoriousID = ", params);
          this.$store.commit('setResults', res.data.hits.hits)
          this.depictionEntry = res.data.hits.hits[0]._source
        }).catch(function (error) {
          console.log(error)
        })
    },
    getDepiction() {
      if (this.$route.params.annotoriousID) {
        this.annotations.push(this.$route.params.annotoriousID)
        console.log("annotation:", this.annotations);
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
    console.log("mounted");

  },
  beforeUpdated:function() {
    this.getDepiction()
    console.log("beforeUpdated");

  },
  watch: {
    $route(to, from) {
      console.log("route changed");
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
