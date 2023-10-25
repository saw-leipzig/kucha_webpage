<template>
  <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
     <v-card-title class="text-h4" raised width="98%" style="margin: auto;padding-bottom: 15px;">The URL is not Valid</v-card-title>
    <v-card-text>The Page you are requesting could not be found. Please check, if there is a spelling error in the URL.</v-card-text>
    <v-img  class="fill-height" height="50vh" contain src="/static/PageNotFound.jpg"></v-img>
    <v-card-text v-html="'Source: The story about the king Pradipapradyota. Once a caravan lost its way and the king helped them by lighting the way with his kindled hands. See: <a href=https://kuchatest.saw-leipzig.de/pr/946/>https://kucha.saw-leipzig.de/pr/946/</a>'"></v-card-text>
  </v-card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import Embed from 'v-video-embed'

export default {
  name: 'About',
  components: {
    'apexchart': VueApexCharts,
    'embed': Embed
  },
  props: {
    source: String,
  },
  data () {
    return {
      annoStats: {},
      kuchaStats:{},
      bibStats:{}
    }
  },
  computed:{
  },
  methods: {

  },
  mounted:function () {

  },
}

</script>

<style></style>
