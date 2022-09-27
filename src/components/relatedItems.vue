<template>
<div>
    <v-expansion-panels Focusable popout multiple>
        <v-expansion-panel
        v-for="(item,i) in relatedItems"
        :key="i"
        >
        <v-expansion-panel-header>
          <v-row >
            <v-col>
              <div  v-html="getTitle(item)"></div>
            </v-col>
            <v-col v-if="item.depictionID" cols=2>
              <v-img height="50px!important" style="opacity:1" :src="getThumbNail(item)" @click.stop="navigation = !navigation" position="left" contain></v-img>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <depictionInf v-if="item.depictionID" :depiction="item" :presentCave="presentCave" :preSelected="preselectedAnnotations"></depictionInf>
            <caveInf v-if="item.caveID" :caveDefault="item" ></caveInf>
            <bibliographyInf v-if="item.annotatedBibliographyID" :bibliographyDefault="item" ></bibliographyInf>
            <iconographyInf v-if="item.iconographyID" :iconography="item" ></iconographyInf>
        </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</div>
</template>
<script>
import {getBibTitle, getCaveLabel, getDepictionLabel} from  "@/utils/helpers"
import caveInf from '@/components/caveInf'
import depictionInf from '@/components/depictionInf'
import iconographyInf from '@/components/iconographyInf'
import bibliographyInf from '@/components/bibliographyInf'

export default {
  name: 'relatedItems',
  props: {
    relatedItems: {},
    presentCave:{
      type: Boolean,
      default: false
    },
    preselectedAnnotations:{
      type: Array,
      default: function(){
        return {}
      }
    }
  },
  components: {
    "depictionInf":depictionInf,
    iconographyInf,
    bibliographyInf,
    caveInf,
  },

  data () {
    return {
      showAddInf: false,
      showAnno: false,
      tab:[],
      viewerImg:{}
    }
  },
  computed: {
  },
  methods: {
    getThumbNail(item){
      if (item.depictionID) {
        let masterImage = null
        for (const image of item.relatedImages){
          if (image.imageID === item.masterImageID){
            masterImage = image
          }
        }
        if (masterImage !== null){
          if (masterImage.filename !== "accessNotPermitted.png"){
            return process.env.VUE_APP_IIIFAPI + "/iiif/2/kucha%2Fimages%2F" + masterImage.filename + "/full/!150,150/0/default.jpg"
          } else {
            return null
          }
        } else {
          return null
        }
      } else {
        return null
      }
    },

    getTitle(item){
      // this.$log.debug(item);
      if (item.depictionID) {
        return getDepictionLabel(item)
      } else if (item.caveID) {
        return "cave " + getCaveLabel(item)
      } else if (item.iconographyID) {
        return "Iconography Entry " + item.iconographyID + " (" + item.text + ")"
      } else if (item.annotatedBibliographyID) {
        return getBibTitle(item)
      } else {
        return "unknown item"
      }
    }
  },
  mounted:function () {
    this.$log.debug("iconography is:", this.iconography);
  },
}
</script>

<style lang="css" scoped>

.v-list-item__title{
  margin-bottom: 5px;
}
.v-tab {
  padding: 8px;
  min-width: 20px;
}
</style>
