<template>
  <v-card ref="card" raised width="98%"  height="100%" class="d-flex align-stretch"
  style="margin: auto;
          display: flex;
          align-items: stretch;
          flex-direction: column;
          flex-wrap: wrap;
          align-content: stretch;">
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
    <v-card-title ref="cardTitle" :class="$vuetify.breakpoint.smAndDown ? 'h4 justify-center' : 'h1 justify-center'">
      Buddhist Murals of Kucha - Virtual Tour
    </v-card-title>
    <v-carousel
    ref="carousel"
    progress
    hide-delimiters
      :continuous="false"
      :show-arrows="true"
      light
      class="d-flex align-stretch"
      :touchless="true"
      v-model="currentIndexIdealTypical"
      style="justify-content: space-evenly;"
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
        style="flex:1 !important;"
      >
       <v-card ref="IdealTypicalCard" raised width="98%" :height="checkLandscape? '100%':'100%'"
       style="margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;"
        class="pb-2"
        >
         <v-card-title ref="icoTitle" v-if="!$vuetify.breakpoint.smAndDown">
            <a :href="getIcoURL(idealTypical)" style="word-break: break-word!important;flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;padding-bottom: 0px !important;">{{idealTypical.text}}</a>
         </v-card-title>
        <v-card-text v-if="!$vuetify.breakpoint.smAndDown"  class="mb-3" ref="IdealTypicalDescription" style="max-height: 100px;overflow-y: auto;"> {{idealTypical.oe.description}} </v-card-text>
        <v-menu rounded="Removed" content-class="description" offset-y flat v-if="$vuetify.breakpoint.smAndDown" >
          <template v-slot:activator="{ on, attrs }">
            <v-list
              rounded flat outlined light class="my-0 py-0"
            >
            <v-list-item
              v-bind="attrs"
              v-on="on"
              rounded
              class="d-flex justify-center my-0 text-center allign-center">
                  {{idealTypical.text}}
              <v-icon> {{ attrs["aria-expanded"] === "true" ? 'mdi-chevron-up' : 'mdi-chevron-down' }} </v-icon>
            </v-list-item>
            </v-list>
          </template>
              <v-card outlined style="background-color: rgb(255, 255, 255,1) !important;" class="pb-2 rounded-lg rounded-t-0" >
                <v-card-text style="max-height:60vh; ;overflow-y: auto;">
                  {{idealTypical.oe.description}} <a :href="getIcoURL(idealTypical)" >Click here to find out more.</a>
                </v-card-text>
              </v-card>
        </v-menu>
         <v-row style="flex:1;max-height:100%" no-gutters >
          <v-col :cols="(!checkLandscape() || idealTypical.relatedDepictions.length===0) ? 12 : 6" no-gutters :style="checkLandscape() ? 'min-height: 50%;flex:1;display: flex;flex-direction: column;':'max-height: 50%;;flex:1;display: flex;flex-direction: column;'">
            <annotatedImage hideTree relativeHeight isZoom ref="idealTypicalImage" style="flex:1" :showControls = "false" :treeShowOption="$vuetify.breakpoint.smAndDown ? false : true" :item="idealTypical"  :annos="idealTypical.oe.images" :preSelected="getPreselected(idealTypical)" :relatedAnnotations="idealTypical.oe.relatedAnnotationList"/>
          </v-col>
          <v-col v-touch="{left: () => decreaseDepictionCount(),right: () => increaseDepictionCount()}" :cols="!checkLandscape() ? 12 : 6" v-if="idealTypical.relatedDepictions.length>0" style="display: flex!important;flex-direction: column;">
            <v-row no-gutters align="center" class="d-flex align-stretch" >
              <v-col cols="1" v-if="idealTypical.relatedDepictions.length>1" class="d-flex align-center">
                  <v-btn
                    class="d-flex align-content-space-around flex-wrap"
                    color="green darken-2"
                    style="z-index:10;left:20px;top:55px;"
                    icon
                    @click="decreaseDepictionCount"
                  >
                    <v-icon> mdi-chevron-left </v-icon>
                  </v-btn>
              </v-col>
              <v-col :cols="idealTypical.relatedDepictions.length>1 ? 10 : 12" class="my-1 d-flex align-stretch">
                <v-slide-x-transition>
                  <v-card v-if="showDepictionImage" class="pb-0" style="display: flex; flex-direction: column;width:100%;z-index:1;" elevation="0">
                    <a :href="getDeptictionURL(getrelatedDepiction)"> <v-card-text  class="font-weight-bold my-0"  ref="depictionTitle" :style="$vuetify.breakpoint.smAndDown ? 'color:black;font-size: .7rem;line-height: 1rem;word-break: break-word;display: block; word-break: break-words;' : 'color:black;word-break: break-word;display: block; word-break: break-words;'"><p class="mb-0" v-line-clamp="3" v-html="getExampleLabel(getrelatedDepiction)"></p></v-card-text></a>
                    <annotatedImage isZoom :treeShowOption="false" hideTree :style="checkLandscape()? 'flex:1 1 100%':'min-height:50%;flex:1 1 80%'" :showControls = "false" v-if="showDepictions" ref="depictionCarousel" :item="getrelatedDepiction"  :annos="getAnnos(getrelatedDepiction)" :preSelected="getPreselectedDepiction" :relatedAnnotations="getrelatedDepiction.relatedAnnotationList"/>
                  </v-card>
                </v-slide-x-transition>
              </v-col>
              <v-col cols="1" v-if="idealTypical.relatedDepictions.length>1" class="d-flex align-center">
                  <v-btn
                    class="d-flex align-content-space-around flex-wrap"
                    style="right:20px;top:55px;z-index:10;"
                    color="green darken-2"
                    icon
                    @click="increaseDepictionCount"
                  >
                    <v-icon> mdi-chevron-right </v-icon>
                  </v-btn>
              </v-col>
            </v-row>
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
      showDepictionImage:true,
      landscape:0,
    }
  },
  computed:{
    getPreselectedDepiction(){
      this.$log.debug("getPreselectedDepiction called",  this.idealTypicals[this.currentIndexIdealTypical].iconographyID);
      let icoIDs = [this.idealTypicals[this.currentIndexIdealTypical].iconographyID]
      const icos = getIconographyByAnnos(icoIDs)
      let icosFlat = []
      for (let ico of icos){
        icosFlat = icosFlat.concat(this.flatIconography(ico))
      }
      return icosFlat
    },
    getrelatedDepiction(){
      return this.idealTypicals[this.currentIndexIdealTypical].relatedDepictions[this.currentIndexDepiction]
    },
  },
  methods: {
    checkLandscape(){
      const ratio = this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height
      if (this.landscape !== ratio){
        this.landscape = ratio
        const _self = this
        if (_self.$refs.idealTypicalImage){
          setTimeout(function(){ _self.$refs.idealTypicalImage[0].goHome(true)}, 2000);
          setTimeout(function(){ _self.$refs.depictionCarousel[_self.currentIndexDepiction].goHome(true)}, 2000);
        }

      }
      return ratio
    },
    increaseDepictionCount(){
      this.showDepictionImage = !this.showDepictionImage
      if (this.idealTypicals[this.currentIndexIdealTypical].relatedDepictions.length > 1) {
        if (this.currentIndexDepiction < this.idealTypicals[this.currentIndexIdealTypical].relatedDepictions.length - 1){
          this.currentIndexDepiction += 1
        } else {
          this.currentIndexDepiction = 0
        }
      } else {
        return 0
      }
      const _self = this
      setTimeout(function(){ _self.showDepictionImage = !_self.showDepictionImage }, 600);
    },
    decreaseDepictionCount(){
      this.showDepictionImage = !this.showDepictionImage
      if (this.idealTypicals[this.currentIndexIdealTypical].relatedDepictions.length > 1) {
        if (this.currentIndexDepiction > 0 ){
          this.currentIndexDepiction -= 1
        } else {
          this.currentIndexDepiction = this.idealTypicals[this.currentIndexIdealTypical].relatedDepictions.length - 1
        }
      } else {
        return 0
      }
      const _self = this
      setTimeout(function(){ _self.showDepictionImage = !_self.showDepictionImage }, 600);
    },
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
          return "Example from " + this.getCaveLabel(depiction.cave) +  " <br> " + this.getWallLabel(depiction) + " (Painted Representation " + depiction.depictionID + ")"

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
      this.currentIndexDepiction = 0
    },
  },
  mounted:function () {
    // this.nextDepiction()
    const _self = this
    setTimeout(function(){
      _self.$log.debug(_self.$refs.carousel);
      _self.$vuetify.goTo(_self.$refs.carousel)
    }, 2000);
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
  .description{
    -webkit-box-shadow: none;
    box-shadow: none;
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
