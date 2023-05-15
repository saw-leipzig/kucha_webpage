<template>
<div style="width:100%;height:100%;opacity:1;">

<v-card class="justify-center"  style="top: 30vh;" color="white" >
    <v-row class="mx-3">
      <v-col v-if="!$vuetify.breakpoint.smAndDown" cols="3" style="opacity:1;padding-bottom: 0px !important;" >
        <v-img style="opacity:1" src="../static/kucha-logo 02.png" @click.stop="navigation = !navigation" height="100%" position="left" contain></v-img>
      </v-col>
      <v-col :cols="!$vuetify.breakpoint.smAndDown ? 9 : 12">
        <v-row class="py-5 justify-center" align="center" style="height:50%;">
          <v-card-title v-if="!$vuetify.breakpoint.smAndDown" :class="getHeading" style="color:#80581D">Buddhist Murals of Kucha <br> on the Northern Silk Road</v-card-title>
          <v-col v-if="$vuetify.breakpoint.smAndDown" align-self-center shrink >
          <v-img class="mx-1"  style="opacity:1" src="../static/kucha-logo 02.png" @click.stop="navigation = !navigation" height="100%" position="left" contain></v-img>
          </v-col>
        </v-row>
        <v-row class="justify-center" align="center" >
        <v-alert
          v-model="alert"
          close-text="Close Alert"
          color="red accent-4"
          dark
          dismissible
        >
          You encountered Problems while loading the Database. Please reload. If this alert is still shown, please contact: kuchaadmin@saw-leipzig.de
        </v-alert>
            <va-global-search v-if="!alert" :xlarge="true"></va-global-search>
        </v-row>
        <v-row class="justify-center" align="center" :style="$vuetify.breakpoint.smAndDown ? 'width:100%;bottom:10px' : 'width:70%;margin: auto;bottom:10px'" >
          <v-col cols="6">
            <v-btn class="px-5 my-5 "
              dense block color="primary"
              to="/tour"
            >
               {{$vuetify.breakpoint.smAndDown? "Tour" : "Virtual Tour"}}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn class="px-5 my-5 "
              dense block color="primary"
              to="/about"
            >
               {{$vuetify.breakpoint.smAndDown? "Help" : "Instruction Video"}}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

</v-card>

</div>
</template>

<script>
import GlobalSearch  from '@/components/GlobalSearch';
import { searchRoot } from '@/services/repository'


export default {
  name: 'Home',
  components: {
    'va-global-search': GlobalSearch,
  },
  data(){
    return {
      alert: false,
    }
  },
  methods: {

  },
  computed: {
    getHeading(){
      if (this.$vuetify.breakpointxs){
        return "h6"
      } else if (this.$vuetify.breakpointsm){
        return "h6"
      } else if (this.$vuetify.breakpointmd){
        return "h1"
      } else if (this.$vuetify.breakpointlg){
        return "h1"
      } else if (this.$vuetify.breakpointxl){
        return "h1"
      } else {
        return "h2"
      }
    }
  },
  mounted:function() {
    var params = {}
    params["searchtext"] = ""
    params["batchStart"] = 0
    this.loading = true
    const _self = this
    searchRoot(params, this.$store.state.mapping)
      .then( res => {
        if (res.data.hits.total.value === 0){
          this.$log.debug("res", res);
        }
      }).catch(function (error) {
        _self.$log.debug(error)
        _self.alert = true;
        return null
      })
  }
// dense block color="rgba(152, 189, 160,1)"
// to="/tour"
// style="border: 1px solid rgba(134, 88, 66,1);"
}

</script>
<style lang="css" scoped>

.statistic-card {
  height: 50%;
}
.v-sheet.v-card {
  background-color: rgba(255, 255, 255, 0.4) !important;
}
.v-card__title{
  word-break: break-word;
}
.flex{
  height:100%
}


/*.mobileExtraSmall  .statistic-card {
  height: 150px;
}*/

</style>
