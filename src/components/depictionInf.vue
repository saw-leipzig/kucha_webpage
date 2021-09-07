<template>
    <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
      <v-card-title ><a :href="getDeptictionURL()" style="flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;">{{getDepictionLabel()}}</a> </v-card-title>
      <v-card-actions v-if="depiction.relatedAnnotationList.length>0">
        <v-btn
          @click="showAnno = !showAnno"
          color="orange lighten-2"
          text
        >
          Annotations
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="showAnno = !showAnno"
        >
          <v-icon>{{ showAnno ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>
      <v-expand-transition v-if="depiction.relatedAnnotationList.length>0">
        <annotatedImage style="min-height:500px" v-show="showAnno" v-if="depiction.relatedAnnotationList.length>0" :item="depiction"  :annos="annos" :relatedAnnotations="depiction.relatedAnnotationList"/>
      </v-expand-transition>

      <v-card-actions v-if="Object.keys(depictionInfo).length>0" >
        <v-btn
          @click="mouseOver"
          color="orange lighten-2"
          text
        >
          Details
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="showDescription = !showDescription"
        >
          <v-icon>{{ showDescription ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition v-if="Object.keys(depictionInfo).length>0">
        <div v-show="showDescription">
          <v-divider></v-divider>
            <v-card class="mx-10" style="background-color: rgba(255, 255, 255, 1) !important">
              <v-card-title>
                Basic Information for Painted Representation {{depiction.depictionID}}
              </v-card-title>
              <v-tabs
              v-model="tab"

              >
                <v-tab
                  v-for="(item_value, item_name, item_key) in depictionInfo"
                  :key="item_key"
                >
                  {{ item_name }}
                </v-tab>
              </v-tabs>

                <v-card flat>
                  <v-tabs-items v-model="tab">
                    <v-tab-item
                      v-for="(item_value, item_name, item_key) in depictionInfo"
                      :key="item_key"
                    >
                      <v-list-item two-line v-for="(value, name, index) in item_value" :key=index>
                        <v-list-item-content>
                          <v-list-item-title >{{name}}</v-list-item-title>
                          <div v-if="name !== 'Wall Location'" style="white-space: pre-line;padding:0px 0px 0px 10px;">{{value}}</div>
                          <v-treeview
                              v-if="name === 'Wall Location'"
                              :items="value"
                          ></v-treeview>
                        </v-list-item-content>
                      </v-list-item>
                    </v-tab-item>
                  </v-tabs-items>
                </v-card>


            </v-card>
        </div>
      </v-expand-transition>
      <v-card-actions v-if="depiction.cave && presentCave">
        <v-btn @click="showCave = !showCave"
          color="orange lighten-2"
          text
        >
          Cave
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="showCave = !showCave"
        >
          <v-icon>{{ showCave ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition v-if="depiction.cave && presentCave">
        <div v-show="showCave">
          <v-divider></v-divider>
              <caveInf class="mx-10" v-if=depiction.cave :cave="depiction.cave"></caveInf>
        </div>
      </v-expand-transition>

      <v-card-actions v-if="images.length>0">
        <v-btn
          @click="showImage = !showImage"
          color="orange lighten-2"
          text
        >
          Related Images
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="showImage = !showImage"
        >
          <v-icon>{{ showImage ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>

            <div v-show="showImage" style='height:650px'>
              <v-card class="mx-10" style='height:550px;background-color: rgba(255, 255, 255, 1) !important'>
            <v-tabs
            v-if="images.length"
              slider-color="yellow"
              centered
            >
              <v-tab
                v-for="(item, index) in images"
                :key="index"
                @click="setOSDimages(item)"
            >
            <v-img v-if="checkImgPermitted(item)" :src="getThumbnail(item)"></v-img>
            <v-icon x-large v-if="!checkImgPermitted(item)">mdi-lock</v-icon>
              </v-tab>
            </v-tabs>
              <div id="openseadragonImg" ref="test" :style=" checkImgPermitted(image) ? 'height:525px;background-color: rgba(255, 255, 255, 1) !important;' : 'display: none;height:525px;background-color: rgba(255, 255, 255, 1) !important;'"></div>
              <v-card :style=" !checkImgPermitted(image) ? 'height:525px;background-color: rgba(255, 255, 255, 1) !important;' : 'display: none;height:525px;background-color: rgba(255, 255, 255, 1) !important;'">
                <v-card-title class="justify-center pt-15 font-weight-bold text-h5" style="word-break: break-all;">
                  Access to this picture is restricted due to copyright reasons.
                </v-card-title>
                <v-card-text class="pa-10">
                  The is Image from:<p>
                  {{image.copyright}}
                  </p>
                  <p>For further information, please contact <a href= "mailto:kucha@saw-leipzig.de">the project</a></p>
                </v-card-text>
              </v-card>
              </v-card>
            </div>
      </v-expand-transition>
      <hideRelatedItems v-if="depiction.relatedBibliographyList.length>0" title="Related Annotated Bibliography" :items="depiction.relatedBibliographyList"></hideRelatedItems>
    </v-card>
</template>

<script>
import image from '@/views/image'
import caveInf from '@/components/caveInf'
import {checkImgPermitted, setOSDImgOverlayImg, getOSDURL, getCaveLabel, getWallTreeByIDs, getDepictionLabel} from  "@/utils/helpers"
import OpenSeadragon from 'openseadragon'
import annotatedImage from '@/components/annotatedImage'

export default {

  name: 'depictionInf',
  components: {
    caveInf,
    image,
    annotatedImage
  },
  props: {
    depiction: {},
    presentCave:true
  },

  data () {
    return {
      showAnno:true,
      tab:[],
      showDescription: false,
      image:{},
      showCave: false,
      showImage: false,
      hideAnno:false,
      tabImg: null,
      annos : [],
      images : [],
      viewerImg :null,
      viwerAnnos:null,
      annoPermanentSelected: [],
      selectType:"leaf",
      idName:"iconographyID",
      dialog:false,
      isAllowedPic:true
    }
  },
  computed:{
    iconography () {
      return this.$store.state.dic.iconography
    },
    depictionInfo(){
      var depictionInf = {}
      var mainInf = {}
      if (this.depiction.shortName){
        mainInf['Short Name'] = this.depiction.shortName
      }
      if (this.depiction.expedition){
        mainInf['Acquired by expredition'] = this.depiction.expedition.name
      }
      if (this.depiction.vendor){
        mainInf['Vendor'] = this.depiction.vendor.vendorName
      }
      if (this.depiction.purchaseDate){
        mainInf['Date purchased'] = this.depiction.purchaseDate
      }
      if (this.depiction.location){
        mainInf['Current Location'] = this.depiction.location.name
      }
      if (this.depiction.inventoryNumber){
        mainInf['Inventory Number'] = this.depiction.inventoryNumber
      }
      if (Object.keys(mainInf).length > 0){
        depictionInf['Main'] = mainInf
      }
      var wallLocation = {}
      console.log("wallIDs", this.depiction.wallIDs);
      if (this.depiction.wallIDs){
        var walls = getWallTreeByIDs(this.depiction.wallIDs, this.$store.state.dic.wallLocation)
        if (Object.keys(walls).length > 0){
          wallLocation["Wall Location"] = walls
        }
      }
      if (this.depiction.positionNotes){
        wallLocation["Position Notes"] = this.depiction.positionNotes
      }
      if (Object.keys(wallLocation).length > 0){
        depictionInf["Wall"] = wallLocation
      }
      var depictionDes = {}
      if (this.depiction.width){
        depictionDes["Width"] = this.depiction.width
      }
      if (this.depiction.height){
        depictionDes["Height"] = this.depiction.height
      }
      if (this.depiction.style){
        depictionDes["Style"] = this.depiction.style.styleName
      }
      if (this.depiction.modeOfRepresentation){
        depictionDes["Mode of Preservation"] = this.depiction.modeOfRepresentation.name
      }
      if (this.depiction.backgroundColour){
        depictionDes["Background Colour"] = this.depiction.backgroundColour
      }
      if (this.depiction.inscriptions){
        depictionDes["Inscriptions"] = this.depiction.inscriptions
      }
      if (this.depiction.separateAksaras){
        depictionDes["Separate Akṣaras"] = this.depiction.separateAksaras
      }
      if (this.depiction.dating){
        depictionDes["Dating"] = this.depiction.dating
      }
      if (this.depiction.description){
        depictionDes["Description"] = this.depiction.description
      }
      if (this.depiction.generalRemarks){
        depictionDes["General Remarks"] = this.depiction.generalRemarks
      }
      if (this.depiction.otherSuggestedIdentifications){
        depictionDes["Other Suggested Identifications"] = this.depiction.otherSuggestedIdentifications
      }
      if (Object.keys(depictionDes).length > 0){
        depictionInf["Description"] = depictionDes
      }
      return depictionInf
    }
  },
  methods: {
    checkImgPermitted(image){
      if (image){
        return checkImgPermitted(image)
      } else {
        return false
      }
    },
    getDeptictionURL(){
      return "/pr/" + this.depiction.depictionID
    },

    getDepictionLabel(){
      return getDepictionLabel(this.depiction, this.$store.state.dic.wallLocation);
    },
    initOSDimg(){
      let tilesImg = []
      console.log("Initializing Images: ", this.image);
      if (this.images){
        console.log("images available, initiate OSDIMG", this.$refs);
        tilesImg = getOSDURL(this.image)
        this.viewerImg = OpenSeadragon({
          id: "openseadragonImg",
          prefixUrl: '/static/',
          tileSources: tilesImg,
          ajaxWithCredentials: true,
          loadTilesWithAjax: true,
          tileRequestHeaders: {"SessionID": ""},
          ajaxHeaders: {"SessionID": ""},

        })

        let infoButtonImg = new OpenSeadragon.Button({
          tooltip: 'Shows Information to the right of the Image',
          srcRest: '/static/info_rest.png',
          srcGroup: '/static/info_grouphover.png',
          srcHover: '/static/info_hover.png',
          srcDown: '/static/info_pressed.png',
          onClick: this.setOSDImgOverlayImg
        })
        this.viewerImg.addControl(infoButtonImg.element, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
      }
    },
    initNewDepiction(){
      if (this.depiction){
        console.log("started Depiction");
        console.log("Depiction: ", this.depiction);
        OpenSeadragon.setString('Tooltips.SelectionToggle', 'Selection Demo');
        OpenSeadragon.setString('Tooltips.SelectionConfirm', 'Ok');
        OpenSeadragon.setString('Tooltips.HorizontalGuide', 'Add Horizontal Guide');
        OpenSeadragon.setString('Tooltips.VerticalGuide', 'Add Vertical Guide');
        OpenSeadragon.setString('Tooltips.ImageTools', 'Image tools');
        OpenSeadragon.setString('Tool.brightness', 'Brightness');
        OpenSeadragon.setString('Tool.contrast', 'Contrast');
        OpenSeadragon.setString('Tool.thresholding', 'Thresholding');
        OpenSeadragon.setString('Tool.invert', 'Invert');
        OpenSeadragon.setString('Tool.gamma', 'Gamma');
        OpenSeadragon.setString('Tool.greyscale', 'Greyscale');
        OpenSeadragon.setString('Tool.reset', 'Reset');
        OpenSeadragon.setString('Tool.rotate', 'Rotate');
        OpenSeadragon.setString('Tool.close', 'Close');
        this.fillPicsContainer()
        console.log("Annos:", this.annos);
        console.log("Images:", this.images);
        if (this.images.length > 0){
          this.image = this.images[0]
          console.log("first image", this.image);
          if (!this.viewerImg){
            this.initOSDimg()
          }
        }
      }
    },
    test(item){
      console.log("clicked: ", item);
      console.log("annoSelected: ", this.annoSelected);
    },
    getThumbnail(image){
      return process.env.VUE_APP_IIIFAPI + "/iiif/2/kucha%2Fimages%2F" + image.filename + "/full/!80,80/0/default.jpg"
    },
    mouseOver: function(){
      this.showDescription = !this.showDescription
    },
    getCaveLabel(entry){
      if (entry !== undefined){
        return "of cave " + getCaveLabel(entry, this.$store.state.dic.sites, this.$store.state.dic.districts, this.$store.state.dic.region)
      } else {
        return "";
      }
    },
    setOSDImgOverlayImg(){
      setOSDImgOverlayImg(this.image, this.viewerImg)
    },
    setOSDimages(image){
      this.image = image
      console.log("change to ", getOSDURL(image));
      this.viewerImg.open(getOSDURL(image))
    },
    fillPicsContainer(){
      this.annos = []
      this.images = []
      for (var img of this.depiction.relatedImages){
        if (this.depiction.relatedAnnotationList.find(element => element.image === img.filename)) {
          this.annos.push(img)
        } else {
          this.images.push(img)
        }
      }
    },
  },
  watch: {
    depiction(newVal, oldVal){
      console.log("depiction changes");
      this.initNewDepiction()
    }
  },
  mounted:function () {
    console.log("Depiction mounted");
    this.initNewDepiction()
  },

}
</script>
<style lang="css" scoped>
.v-treeview {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 100% !important;
}
</style>
