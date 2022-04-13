<template>
  <v-card ref="card" raised width="98%"  height="99%"
  style="margin: auto;
          padding-bottom: 15px;
          display: flex;
          align-items: stretch;
          flex-direction: column;
          flex-wrap: wrap;
          align-content: stretch;">
    <v-card-title ref="cardTitle" :class="$vuetify.breakpoint.smAndDown ? 'h4 justify-center' : 'h1 justify-center'">
      Buddhist Murals of Kucha - Virtual Tour
    </v-card-title>
    <v-carousel
    progress
    hide-delimiters
      :continuous="false"
      :show-arrows="true"
      light
      :touchless="false"
      v-model="currentIndexIdealTypical"
      style="flex: 1 !important;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;"
      @change="changed(currentIndexIdealTypical)"
      @onload="changed(0)"
    >
    <template v-slot:prev="{on, attrs }" style="left:-20px">
      <v-btn
        color="green darken-2"

        v-bind="attrs"
        icon
        x-large
        v-on="on"
      >
        <v-icon> mdi-chevron-left </v-icon>
      </v-btn>
    </template>
    <template v-slot:next=" { on, attrs }" style="right:-20px">
      <v-btn

        color="green darken-2"
        v-bind="attrs"
        icon
        x-large
        v-on="on"
      >
        <v-icon> mdi-chevron-right </v-icon>
      </v-btn>
    </template>
      <v-carousel-item
        v-for="(idealTypical, i) in idealTypicals"
        :key="i"
        style="flex:1 !important;padding-bottom: 20px;;"
      >
       <v-card ref="IdealTypicalCard" raised width="98%" height="99%"
       style="margin: auto;
        padding-bottom: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;"
        >
         <v-card-title v-if="!$vuetify.breakpoint.smAndDown">
            <a :href="getIcoURL(idealTypical)" style="word-break: break-word!important;flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;">{{idealTypical.text}}</a>
         </v-card-title>
        <v-card-text v-if="!$vuetify.breakpoint.smAndDown"  class="mb-3" ref="IdealTypicalDescription" style="max-height: 100px;overflow-y: auto;"> {{idealTypical.oe.description}} </v-card-text>
        <v-expansion-panels flat v-if="$vuetify.breakpoint.smAndDown">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-card-title>{{idealTypical.text}}</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <a :href="getIcoURL(idealTypical)" style="word-break: break-word!important;flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;">{{idealTypical.oe.description}}</a>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
         <v-row style="flex:1" no-gutters >
          <v-col :cols="(!checkLandscape || idealTypical.relatedDepictions.length===0) ? 12 : 6" no-gutters :style="checkLandscape ? 'min-height: 70vh;flex:1;display: flex;flex-direction: column;':'min-height: 50%;flex:1;display: flex;flex-direction: column;'">
            <annotatedImage hideTree relativeHeight isZoom ref="idealTypicalImage" style="flex:1" :showControls = "false" :treeShowOption="$vuetify.breakpoint.smAndDown ? false : true" :item="idealTypical"  :annos="idealTypical.oe.images" :preSelected="getPreselected(idealTypical)" :relatedAnnotations="idealTypical.oe.relatedAnnotationList"/>
          </v-col>
          <v-col :cols="!checkLandscape ? 12 : 6" v-if="idealTypical.relatedDepictions.length>0" style="display: flex!important;flex-direction: column;">              <v-slide-group
              :show-arrows="true"
              light
              center-active
              v-model="currentIndexDepiction"
              style="display:flex!important;flex:1"
            >
              <template v-slot:prev="{on, attrs }">
                <v-btn
                  color="green darken-2"
                  style="left:20px;top:55px;"
                  v-bind="attrs"
                  icon
                  v-on="on"
                >
                  <v-icon> mdi-chevron-left </v-icon>
                </v-btn>
              </template>
              <template v-slot:next=" { on , attrs }" >
                <v-btn
                  v-bind="attrs"
                  style="right:20px;top:55px;"
                  color="green darken-2"
                  icon
                  v-on="on"
                >
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
              </template>

                <v-slide-item
                  v-for="(depiction, x) in idealTypicals[currentIndexIdealTypical].relatedDepictions"
                  :key="x"
                  style="flex: 1;"
                >
                <v-lazy
                  v-model="isActive"
                  :options="{
                    threshold: .5
                  }"
                  min-height="200"
                  transition="fade-transition"
                >
                  <v-card style="display: flex;
                    flex-direction: column;width:100%">
                    <a :href="getDeptictionURL(depiction)"> <v-card-text class="font-weight-bold"  ref="depictionTitle" :style="$vuetify.breakpoint.smAndDown ? 'color:black;font-size: .7rem;line-height: 1rem;word-break: break-word;display: block; word-break: break-words;' : 'color:black;word-break: break-word;display: block; word-break: break-words;'" v-html="getExampleLabel(depiction)"></v-card-text></a>
                    <annotatedImage :treeShowOption="false" hideTree isZoom :style="checkLandscape? 'min-height:50%;flex:1 1 100%':'min-height:100%;flex:1 1 100%'" :showControls = "false" v-if="showDepictions" ref="depictionCarousel" :item="depiction"  :annos="getAnnos(depiction)" :preSelected="getPreselectedDepiction(idealTypical.iconographyID)" :relatedAnnotations="depiction.relatedAnnotationList"/>
                  </v-card>
                  </v-lazy>
                </v-slide-item>

            </v-slide-group>
          </v-col>
         </v-row>
      </v-card>
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
// import Vue from 'vue'
import {getIconographyByID, getCaveLabel, getCaveShortLabel, getIconographyByAnnos, getWallLabels} from '@/utils/helpers'
import annotatedImage from '@/components/annotatedImage'
export default {
  name: 'tourInf',
  components: {
    annotatedImage
  },
  props: {
    idealTypicals: {}
  },
  data () {
    return {
      currentIndexIdealTypical:0,
      currentIndexDepiction:0,
      showDepictions:true,
      on:true,
      isActive:false,
    }
  },
  computed:{
    checkLandscape(){
      return this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height
    },
  },
  methods: {
    changed(){
      this.currentIndexDepiction = 0
    },
    changedDepiction(){
      for (const depiction of this.$refs.depictionCarousel){
        depiction.hideTag()
      }
    },
    nextDepiction(){

    },
    getContentHeight(){
      let h = 600
      if (this.$refs.card){
        h = (this.$refs.card.$el.clientHeight - this.$refs.cardTitle.clientHeight) / 100 * 99
      }
      return h
    },
    getExampleLabel(depiction){
      if (depiction){
        if (!this.$vuetify.breakpoint.smAndDown){
          return "Example from " + this.getCaveLabel(depiction.cave) +  " <br> " + this.getWallLabel(depiction) + " (Painted Representation " + depiction.depictionID + ")</a>"

        } else {
          return getCaveShortLabel(depiction.cave) +  ", " + this.getWallLabel(depiction)
        }
      } else {
        return null
      }
    },
    getCaveLabel(entry){
      return getCaveLabel(entry)
    },
    getWallLabel(depiction){
      if (depiction){
        return getWallLabels(depiction, '');
      } else {
        return null
      }
    },

    getDeptictionURL(depiction){
      return "/pr/" + depiction.depictionID
    },

    flatIconography(item){
      let icos = []
      for (var child of item.children){
        icos = icos.concat(this.flatIconography(child))
      }
      let copy = Object.assign({}, item)
      copy.children = []
      icos.push(copy)
      return icos
    },
    getPreselected(item){
      let icoIDs = []
      for (const entry of item.oe.relatedAnnotationList){
        for (const tag of entry.tags){
          icoIDs.push(tag.iconographyID)
        }
      }
      const icos = getIconographyByAnnos(icoIDs)
      let icosFlat = []
      for (let ico of icos){
        icosFlat = icosFlat.concat(this.flatIconography(ico))
      }
      return icosFlat
    },
    getIcoURL(ico){
      return "/iconography/" + ico.iconographyID
    },
    getPreselectedDepiction(icoID){
      let icoIDs = [icoID]
      const icos = getIconographyByAnnos(icoIDs)
      let icosFlat = []
      for (let ico of icos){
        icosFlat = icosFlat.concat(this.flatIconography(ico))
      }
      return icosFlat
    },
    getAnnos(depiction){
      let annos = []
      if (depiction){
        for (var img of depiction.relatedImages){
          if (depiction.relatedAnnotationList.find(element => element.image === img.filename) && img.accessLevel === 2) {
            annos.push(img)
          }
        }
      }
      return annos
    },

    getIconographyByID(item){
      if (item){
        let ico = getIconographyByID(item.iconographyID)
        return ico
      } else {
        return null
      }
    }

  },
  watch: {
    'idealTypicals': function(newVal, oldVal) {
    },
    'currentIndexIdealTypical': function(newVal, oldVal) {
      // this.changedIdealTypical(newVal)
    },
  },
  mounted:function () {
    // this.nextDepiction()
  },
  updated:function () {
  }
}

</script>

<style>
  .v-window {
    display: flex !important;
    flex: 1 1 0%;
    flex-direction: column;
  }
  .v-window__container {
      flex: 1!important;
      display: flex;
      flex-direction: column!important;;
  }
  .v-responsive__content {
    display: flex;
  }
  .v-responsive {
    height: 100%!important;
  }
  .v-card__title {
    padding-bottom: 5px !important;
  }
  .v-carousel .v-window-item {
    flex: 1!important;
}
</style>
