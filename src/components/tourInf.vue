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
      v-model="currentIndexIdealTypical"
      style="flex: 1 !important;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;"
      @change="changed(currentIndexIdealTypical)"
      @onload="changed(0)"
    >
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
        v-if="idealTypical"
        >
         <v-card-title v-if="!$vuetify.breakpoint.smAndDown">
            <a :href="getIcoURL(idealTypical)" style="word-break: break-word!important;flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;">{{getIconographyByID(idealTypical).name}}</a>
         </v-card-title>
        <v-card-text v-if="!$vuetify.breakpoint.smAndDown"  class="mb-3" ref="IdealTypicalDescription" style="max-height: 100px;overflow-y: auto;"> {{idealTypical.description}} </v-card-text>
        <v-expansion-panels flat v-if="$vuetify.breakpoint.smAndDown">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-card-title>{{getIconographyByID(idealTypical).name}}</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <a :href="getIcoURL(idealTypical)" style="word-break: break-word!important;flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;">{{idealTypical.description}}</a>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
         <v-row style="flex:1" no-gutters >
          <v-col no-gutters :style="checkLandscape ? 'min-height: 70vh;flex:1;display: flex;flex-direction: column;':'min-height: 50%;flex:1;display: flex;flex-direction: column;'">
            <annotatedImage relativeHeight isZoom ref="idealTypicalImage" hideTree style="flex:1" :showControls = "false" :treeShowOption="$vuetify.breakpoint.smAndDown ? false : true" v-show="true" :item="idealTypical"  :annos="idealTypical.images" :preSelected="getPreselected(idealTypical)" :relatedAnnotations="idealTypical.relatedAnnotationList"/>
          </v-col>
          <v-col :cols="!checkLandscape ? 12 : 6" v-if="hasRelatedDepictions(idealTypical.iconographyID)" style="display: flex!important;flex-direction: column;">
            <v-carousel
              :continuous="true"
              :show-arrows="false"
              :hide-delimiters= "false"
              light
              cycle
              interval = 9000
              hide-delimiter-background
              v-model="currentIndexDepiction"
              style="display:flex!important;flex:1"
              @change="changedDepiction()"
            >
              <v-carousel-item
                :href="getDeptictionURL(depiction)"
                v-for="(depiction, x) in getRelatedDepictions(idealTypicals[currentIndexIdealTypical].iconographyID)"
                :key="x"
                style="flex: 1;"
              >
            <v-card style="display: flex;
              flex-direction: column;width:100%">
              <v-card-text class="font-weight-bold"  ref="depictionTitle" :style="$vuetify.breakpoint.smAndDown ? 'font-size: .7rem;line-height: 1rem;word-break: break-word;display: block; word-break: break-words;' : 'word-break: break-word;display: block; word-break: break-words;'" v-html="getExampleLabel(depiction)"></v-card-text>
              <annotatedImage isZoom :style="checkLandscape? 'min-height:50%;flex:1 1 100%':'min-height:100%;flex:1 1 100%'" :showControls = "false" v-if="showDepictions" ref="depictionCarousel" hideTree v-show="true" :item="depiction"  :annos="getAnnos(depiction)" :preSelected="getPreselectedDepiction(idealTypical.iconographyID)" :relatedAnnotations="depiction.relatedAnnotationList"/>
            </v-card>
              </v-carousel-item>
            </v-carousel>
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
import { getDepictionByAnnotation } from '@/services/repository'
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
      relatedDepictions: {},
      currentIndexIdealTypical:0,
      currentIndexDepiction:0,
      showDepictions:true,
    }
  },
  computed:{
    checkLandscape(){
      console.log("is Landscape:", this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height);
      return this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height
    },
  },
  methods: {
    changedDepiction(){
      // console.log("changedDepiction", this.$refs.depictionCarousel);
      for (const depiction of this.$refs.depictionCarousel){
        depiction.hideTag()
      }
    },
    changed(item){
    },
    getContentHeight(){
      let h = 600
      if (this.$refs.card){
        h = (this.$refs.card.$el.clientHeight - this.$refs.cardTitle.clientHeight) / 100 * 99
      }
      console.log("getContentHeight returning:", h);
      return h
    },
    getExampleLabel(depiction){
      if (depiction){
        if (!this.$vuetify.breakpoint.smAndDown){
          return "Example from " + this.getCaveLabel(depiction.cave) +  " " + this.getWallLabel(depiction) + " (Painted Representation " + depiction.depictionID + ")</a>"

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
    hasRelatedDepictions(idealTypical){
      if (idealTypical){
        let depictions = this.getRelatedDepictions(idealTypical)
        if (depictions){
          if (depictions.length > 0){
            return true
          }
        }
      }
      return false
    },
    getDeptictionURL(depiction){
      return "/pr/" + depiction.depictionID
    },
    getRelatedDepictions(icoID){
      let depictions = []
      if (this.relatedDepictions){
        depictions = this.relatedDepictions[icoID]
      }
      return depictions
    },
    getPreselected(item){
      let icoIDs = []
      for (const entry of item.relatedAnnotationList){
        for (const tag of entry.tags){
          icoIDs.push(tag.iconographyID)
        }
      }
      const icos = getIconographyByAnnos(icoIDs)
      return icos
    },
    getIcoURL(ico){
      return "/iconography/" + ico.iconographyID
    },
    getPreselectedDepiction(icoID){
      let icoIDs = [icoID]
      const icos = getIconographyByAnnos(icoIDs)
      return icos
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
    setRelatedDepictions(idealTypical){
      var params = {}
      this.relatedDepictions = null
      params.iconographyID = [idealTypical.iconographyID]
      // console.log("params of getDepictions", params);
      getDepictionByAnnotation(params)
        .then( res => {
          var newDepictions = []
          for ( var entry of res.data.hits.hits){
            if (this.getAnnos(entry._source).length > 0){
              let newAnnos = []
              for (let anno of entry._source.relatedAnnotationList){
                let found = false
                for (let tag of anno.tags){
                  if (tag.iconographyID === idealTypical.iconographyID){
                    const img = entry._source.relatedImages.find(element => element.filename === anno.image)
                    if (img) {
                      if (img.accessLevel === 2){
                        found = true
                      }
                    }
                  }
                }
                if (found) {
                  newAnnos.push(anno)
                }
              }
              if (newAnnos.length > 0){
                entry._source.relatedAnnotationList = newAnnos
                newDepictions.push(entry._source)
              }
            }
          }
          let dummy = Object.assign({}, this.relatedDepictions)
          dummy[idealTypical.iconographyID] = newDepictions
          this.relatedDepictions = dummy
          // Vue.set(this.relatedDepictions, idealTypical.iconographyID, newDepictions)
        }).catch(function (error) {
          console.log(error)
        })
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
      for (const idealTypical of this.idealTypicals){
        this.setRelatedDepictions(idealTypical)
      }
    },
    'currentIndexIdealTypical': function(newVal, oldVal) {
      // this.changedIdealTypical(newVal)
    },
    'currentIndexDepiction': function(newVal, oldVal) {
      // console.log("currentIndexDepiction:", this.$refs.depictionCarousel[this.currentIndexDepiction]);
      // console.log("currentIndexDepiction:", this.currentIndexDepiction);
      // this.$refs.depictionCarousel[this.currentIndexDepiction].initNewAnnotatedImage()
    },
  },
  mounted:function () {
    // console.log("content", this.$refs.card);
    // console.log("tourInf idealTypicals", this.idealTypicals);
    // this.changedIdealTypical(0)
    for (const idealTypical of this.idealTypicals){
      this.setRelatedDepictions(idealTypical)
    }
    setTimeout(() => {
      console.log("this.$refs.carousel.$children[0].$el", this.$refs.IdealTypicalCard);
      this.$refs.IdealTypicalCard[0].$el.scrollIntoView(true)
    }, 1000);
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
