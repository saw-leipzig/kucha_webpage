<template>

    <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
      <v-card-title ><a :href="getDeptictionURL()" style="flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;">{{getDepictionLabel()}}</a> </v-card-title>
      <v-card-actions v-if="annos.length>0">
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
      <v-expand-transition v-if="annos.length>0">
        <div v-show="showAnno" style='height:100%'>
          <v-tabs
            v-if="annos.length>1"
            v-model="annoImg"
            centered
            slider-color="yellow"
          >
            <v-tab
              v-for="(item, index) in annos"
              :key="index"
              @click="setOSDannos(item)"
            >
            <v-img v-if="checkImgPermitted"
                :src="getThumbnail(item)"
              ></v-img>
            <v-icon v-if="!checkImgPermitted">mdi-lock</v-icon>
            </v-tab>
          </v-tabs>
          <v-row justify="center" class="mx-5" style='height:550px'>
            <v-col :cols=colsAnnoImg  >
              <v-card :style=" checkAnnoPermitted(annoImage) ? 'height:525px;background-color: rgba(255, 255, 255, 1) !important;' : 'display: none;height:525px;background-color: rgba(255, 255, 255, 1) !important;'">
                <div :id="'openseadragonAnnoDepiction' + depiction.depictionID"  style='height:500px'>
                <v-row class="mt-0" :attach="'#openseadragonAnnoDepiction' + depiction.depictionID" style='position: relative;z-index: 4'>
                  <v-bottom-sheet
                    v-model="sheet"
                    inset
                    hide-overlay
                    :attach="'#openseadragonAnnoDepiction' + depiction.depictionID"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-row
                        allign="start"
                      >
                        <v-col
                          outlined
                        >
                        </v-col>
                        <v-col
                        v-if="isFullScreen"
                          outlined
                        >
                          <v-btn
                          :attach="'#openseadragonAnnoDepiction' + depiction.depictionID"
                            color="orange"
                            dark
                            v-bind="attrs"
                            v-on="on">
                            Open Annotations
                          </v-btn>
                        </v-col>
                        <v-col>
                          <v-btn
                            color="orange"
                            dark
                            v-on:click="switchAnnoImageControl()"
                          >
                            {{actControl}}
                          </v-btn>
                        </v-col>
                        <v-col
                          outlined
                        >
                        </v-col>
                       </v-row>
                    </template>
                      <v-sheet
                        :attach="'#openseadragonAnnoDepiction' + depiction.depictionID"
                        class="text-center"
                        height="340px"
                        style="overflow-y: scroll;"
                      >
                        <v-text-field
                          v-model="search"
                          label="Search Iconography Tree"
                          hide-details
                          clearable
                          clear-icon="mdi-close-circle-outline" ></v-text-field>
                        <v-lazy
                          transition="scroll-x-reverse-transition"
                        >
                        <v-treeview
                          selection-type="leaf"
                          :filter="filter"
                          :search="search"
                          return-object
                          v-model="annoSelected"
                          rounded
                          selectable
                          hoverable
                          open-all
                          :items="this.icoAnnos"
                          dense
                          activatable
                          multiple-active
                          :active="annoActivated"
                        >
                          <template class="v-treeview-node__label" slot="label" slot-scope="{ item }">
                            <a v-on:click="test(item)" v-on:mouseover="mouseOverNode(item)"
                            v-on:mouseleave="mouseLeaveNode(item)"><div class="v-treeview-node__label">{{ item.name }}</div></a>
                          </template>
                        </v-treeview>
                      </v-lazy>
                  </v-sheet>
                </v-bottom-sheet>
                </v-row>
                </div>
             </v-card>
             <v-card :style=" !checkAnnoPermitted(annoImage) ? 'overflow-y: scroll;height:525px;background-color: rgba(255, 255, 255, 1) !important;' : 'display: none;height:525px;background-color: rgba(255, 255, 255, 1) !important;'">
               <v-card-title class="justify-center pt-15 font-weight-bold text-h5" style="word-break: break-word;">
                 Access to the picture is restricted due to copyright reasons.
               </v-card-title>
               <v-card-text class="pa-10">
                 Annotations are based on an Image from:<p>
                 {{annoImage.copyright}}
                 </p>
                 <p>For further information, please contact <a href= "mailto:kucha@saw-leipzig.de">the project</a></p>
               </v-card-text>
             </v-card>

            </v-col>
            <v-col :cols=colsAnnoTree  :ref="'cardAnnoDepiction' + depiction.depictionID">
              <v-tooltip :position-y="yTag" :position-x="xTag" right v-if="!(hoveredTags(hoveredAnno) === '')" v-model="showTag" >
                <span >{{hoveredTags(hoveredAnno)}}</span>
              </v-tooltip>
              <v-card
                style='height:525px;overflow-y: scroll;overflow-x: hidden;'>
                <v-row>
                  <v-col cols=1>
                    <v-btn icon @click="changeSize()" dense block color="black"><v-icon>{{ annoArrow ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon></v-btn>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="search"
                      label="Search Iconography Tree"
                      hide-details
                      clearable
                      clear-icon="mdi-close-circle-outline" ></v-text-field>
                  </v-col>
                </v-row>
                <v-lazy
                  transition="scroll-x-reverse-transition"
                >
                  <v-treeview
                    item-disabled="locked"
                    selection-type="leaf"
                    :filter="filter"
                    :search="search"
                    return-object
                    v-model="annoSelected"
                    rounded
                    selectable
                    hoverable
                    open-all
                    activatable
                    multiple-active
                    :active="annoActivated"
                    :items="this.icoAnnos"
                    dense>
                    <template class="v-treeview-node__label" slot="label" slot-scope="{ item }">
                      <a v-on:click="test(item)" v-on:mouseover="mouseOverNode(item)"
                        v-on:mouseleave="mouseLeaveNode(item)"><div class="v-treeview-node__label">{{ item.name }}</div></a>
                    </template>
                  </v-treeview>
                </v-lazy>
              </v-card>
            </v-col>
           </v-row>
         </div>
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

      <v-expand-transition v-if="images.length>0">

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
            <v-img v-if="checkImgPermitted(item)"
                :src="getThumbnail(item)"
              ></v-img>
            <v-icon x-large v-if="!checkImgPermitted(item)">mdi-lock</v-icon>
              </v-tab>
            </v-tabs>
              <div id="openseadragonImg" :style=" checkImgPermitted(image) ? 'height:525px;background-color: rgba(255, 255, 255, 1) !important;' : 'display: none;height:525px;background-color: rgba(255, 255, 255, 1) !important;'"></div>
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
import {checkImgPermitted, checkAnnoPermitted, setOSDImgOverlayImg, getOSDURL, getCaveLabel, getWallTreeByIDs, getDepictionLabel} from  "@/utils/helpers"
import * as d3 from "d3";
import OpenSeadragon from 'openseadragon'
import Annotorious from '../../static/openseadragon-annotorious.min.js'

export default {

  name: 'depictionInf',
  components: {
    caveInf,
    image,
  },
  props: {
    depiction: {},
    presentCave:true
  },

  data () {
    return {
      tab:[],
      search: null,
      showDescription: false,
      showTag:true,
      annoImage:{},
      image:{},
      annotoriousplugin: {},
      showCave: false,
      showImage: false,
      showAnno:true,
      hideAnno:false,
      tabImg: null,
      annoImg: null,
      icoAnnos: [],
      w3cAnnos:[],
      annos : [],
      images : [],
      viewerImg :null,
      viwerAnnos:null,
      annoSelected: [],
      annoActivated: [],
      annoPermanentSelected: [],
      selectType:"leaf",
      idName:"iconographyID",
      dialog:false,
      sheet:false,
      actControl:"Enable Controlls",
      isFullScreen: false,
      hoveredAnno:{},
      colsAnnoImg:8,
      colsAnnoTree:4,
      annoArrow: false
    }
  },
  computed:{
    yTag(){
      if (this.$refs['cardAnnoDepiction' + this.depiction.depictionID]){
        console.log("hoveredAnno triggered", this.$refs['cardAnnoDepiction' + this.depiction.depictionID].getBoundingClientRect());
        return this.$refs['cardAnnoDepiction' + this.depiction.depictionID].getBoundingClientRect().y - 10
      } else return 0

    },
    xTag(){
      if (this.$refs['cardAnnoDepiction' + this.depiction.depictionID]){
        console.log("hoveredAnno triggered", this.$refs['cardAnnoDepiction' + this.depiction.depictionID]);
        return this.$refs['cardAnnoDepiction' + this.depiction.depictionID].getBoundingClientRect().x
      } else return 0

    },
    filter () {
      return  (item, search, textKey) => {
        return (item["search"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1 || item["name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1)
      }
    },
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
    hoveredTags(hoveredAnno){
      let tags = ""
      if (hoveredAnno){
        if (hoveredAnno.body){
          for (let tag of hoveredAnno.body){
            if (tags === ""){
              tags = tag.value
            } else {
              tags += "/" + tag.value
            }
          }
        }
      }
      return tags
    },
    checkAnnoPermitted(item){
      return checkAnnoPermitted(item)
    },
    checkImgPermitted(item){
      return checkImgPermitted(item)
    },
    changeSize(){
      if (this.annoArrow){
        this.colsAnnoImg = 8
        this.colsAnnoTree = 4
        this.annoArrow = false
      } else {
        this.colsAnnoImg = 6
        this.colsAnnoTree = 6
        this.annoArrow = true
      }
    },
    getDeptictionURL(){
      return "/depiction/" + this.depiction.depictionID
    },
    disableTree() {
      for (let rootItem of this.icoAnnos){
        rootItem.locked = true
      }
    },
    enableTree() {
      for (let rootItem of this.icoAnnos){
        rootItem.locked = false
      }
    },

    getDepictionLabel(){
      return getDepictionLabel(this.depiction, this.$store.state.dic.wallLocation);
    },
    initOSDimg(){
      let tilesImg = []
      console.log("Initializing Images: ", this.images);
      if (this.images.length > 0){
        console.log("images available, initiate OSDIMG");
        tilesImg = getOSDURL(this.images[0])
        this.image = this.images[0]
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
    initOSDanno(){
      let tilesAnnos = []
      if (this.annos.length > 0){
        tilesAnnos = getOSDURL(this.annos[0])
        this.annoImage = this.annos[0]
        this.viewerAnnos = OpenSeadragon({
          id: 'openseadragonAnnoDepiction' + this.depiction.depictionID,
          prefixUrl: '/static/',
          tileSources: tilesAnnos,
          showRotationControl: true,
          showFlipControl: true,
          maxZoomLevel: 100,
          minZoomLevel: 0.001,
          ajaxWithCredentials: true,
          loadTilesWithAjax: true,
          tileRequestHeaders: {"SessionID": ""},
          ajaxHeaders: {"SessionID": ""},
        })
        let infoButtonAnno = new OpenSeadragon.Button({
          tooltip: 'Shows Information to the right of the Image',
          srcRest: '/static/info_rest.png',
          srcGroup: '/static/info_grouphover.png',
          srcHover: '/static/info_hover.png',
          srcDown: '/static/info_pressed.png',
          onClick: this.setOSDImgOverlayAnno
        })
        this.viewerAnnos.addControl(infoButtonAnno.element, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
        var config = {};
        config["readOnly"] = true;
        config["widgets"] = ['COMMENT', { widget: 'TAG', vocabulary: [], showDelete: false }]
        config["image"] = this.viewerAnnos;
        this.annotoriousplugin = Annotorious(this.viewerAnnos, config)
        this.viewerAnnos.setControlsEnabled(false);
        this.viewerAnnos.setMouseNavEnabled(false);
        var _self = this;
        this.annotoriousplugin.disableEditor = true
        this.annotoriousplugin.on('mouseEnterAnnotation', function(annotation, event) {
          let annos = []
          for (let anno of annotation.body){
            if (Array.isArray(_self.icoAnnos)){
              for (let ico of _self.icoAnnos){
                let res = _self.getIco(ico, anno.id)
                if (res !== null){
                  annos.push(res)
                  console.log("adding annos:", res);
                  break
                }
              }
            } else {
              let res = _self.getIco(_self.icoAnnos, anno.id)
              if (res !== null){
                annos.push(res)
              }
            }
          }
          for (let anno of annos){
            _self.annoActivated.push(anno)
          }
          _self.hoveredAnno = annotation
          _self.updateSelectedAnnos()
        });

        this.annotoriousplugin.on('mouseLeaveAnnotation', function(annotation, evt) {
          _self.annoActivated = []
          _self.hoveredAnno = null
          _self.updateSelectedAnnos()
        });
        this.annotoriousplugin.on('cancelSelected', function(annotation, evt) {
          console.log("deselection", evt);
        });
        this.annotoriousplugin.on('selectAnnotation', function(annotation, evt) {
          console.log("selection", evt);
          let found = false
          for (let anno of annotation.body){
            const selectedIco = _self.annoSelected.find(el => el.iconographyID === anno.id)
            console.log("selectedIco", selectedIco);
            if (selectedIco !== undefined){
              found = true
              const index = _self.annoSelected.indexOf(selectedIco);
              if (index > -1) {
                _self.annoSelected.splice(index, 1);
              }
              console.log("_self.annoSelected", _self.annoSelected);
            }
          }
          if (found){
            _self.updateSelectedAnnos()
          } else {
            let annos = [];
            for (let anno of annotation.body){
              if (Array.isArray(_self.icoAnnos)){
                for (let ico of _self.icoAnnos){
                  let res = _self.getIco(ico, anno.id)
                  if (res !== null){
                    annos.push(res)
                    break
                  }
                }
              } else {
                let res = _self.getIco(_self.icoAnnos, anno.id)
                if (res !== null){
                  annos.push(res)
                }
              }
            }
            for (let anno of annos){
              if (_self.annoSelected.find(el => el.iconographyID === anno.iconographyID) === undefined){
                _self.annoSelected.push(anno)
              }
            }
            _self.updateSelectedAnnos()
            console.log("annotation selected: ", _self.annoSelected)
          }
        });
        this.viewerAnnos.addHandler("full-page", function (data) {
          console.log("fullscreen trigggered");
        });
        document.getElementById('openseadragonAnnoDepiction' + this.depiction.depictionID).addEventListener('fullscreenchange', (event) => {
          if (document.fullscreenElement) {
            _self.isFullScreen = true
          } else {
            _self.isFullScreen = false
            _self.sheet = false
          }
        });
        this.viewerAnnos.addHandler("pre-full-page", function (data) {
          data.preventDefaultAction = true;
          console.log("fullscreen trigggered");
          // _self.isFullScreen = !_self.isFullScreen
          if (data.eventSource.element.requestFullscreen) {
            data.eventSource.element.requestFullscreen();
          } else if (data.eventSource.element.mozRequestFullScreen) {
            data.eventSource.element.mozRequestFullScreen();
          } else if (data.eventSource.element.webkitRequestFullscreen) {
            data.eventSource.element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          } else if (data.eventSource.element.msRequestFullscreen) {
            data.eventSource.element.msRequestFullscreen();
          } else if (data.eventSource.element.webkitEnterFullScreen) {
            data.eventSource.element.webkitEnterFullScreen(Element.ALLOW_KEYBOARD_INPUT);
          } else {
            var el = document.documentElement;
            el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        });
      }
    },
    fillPicsContainer(){
      this.annos = []
      this.images = []
      for (var img of this.depiction.relatedImages){
        if (this.depiction.relatedAnnotationList.find(element => parseInt(element.image.split(".")[0]) === img.imageID)) {
          this.annos.push(img)
        } else {
          this.images.push(img)
        }
      }
    },
    initNewDepiction(){
      if (this.depiction){
        console.log("started Depiction");
        console.log("Depiction: ", this.depiction);
        console.log("Annos:", this.annos);
        console.log("Images:", this.images);
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
        console.log("Images", this.images);
        console.log('Annos', this.depiction.relatedAnnotationList);
        if (!this.viewerImg){
          this.initOSDimg()
        }
        if (!this.viewerAnnos){
          this.initOSDanno()
        }
        var allAnnotationEntries = []
        this.w3cAnnos = []
        var geoGenerator = d3.geoPath()
        for (var ae of this.depiction.relatedAnnotationList) {
          var bodies = []
          for (var ie of ae.tags) {
            if (!allAnnotationEntries.includes(ie)) {
              allAnnotationEntries.push(ie.iconographyID);
              var body = {};
              body["type"] = "TextualBody";
              body["value"] = ie.text;
              body["id"] = ie.iconographyID;
              body["image"] = ae.image;
              bodies.push(body);
            }
          }
          var anno = {};
          anno["@context"] = "http://www.w3.org/ns/anno.jsonld";
          anno["id"] = ae.annotoriousID;
          anno["type"] = "Annotation";
          anno["body"] = bodies;
          var target = {};
          var selector = {};
          selector["type"] = "SvgSelector";
          selector["conformsTo"] = "http://www.w3.org/TR/media-frags/";
          var root = JSON.parse(ae.polygon);
          selector["value"] = "<svg><path d=\"" + geoGenerator(root) + "\"></path></svg>";
          target["selector"] = selector;
          target["id"] = ae.image
          anno["target"] = target;
          this.w3cAnnos.push(anno);
        }
        console.log("w3cAnnos:", this.w3cAnnos);
        if (Object.keys(this.annotoriousplugin).length > 0){
          for (let anno of this.w3cAnnos){
            this.annotoriousplugin.addAnnotation(anno)
          }
          for (let anno of this.w3cAnnos){
            this.annotoriousplugin.hideAnnotation(anno.id)
          }

        }
        this.icoAnnos = this.getIconographyByAnnos(allAnnotationEntries)
        console.log("icoAnnos:", this.icoAnnos);
        if (this.images.length > 0){
          this.setOSDimages(this.images[0])
        }
        if (this.annos.length > 0){
          this.setOSDannos(this.annos[0])
        }
      }
    },
    getChildren(item){
      var result = [item]
      for (var child of item.children){
        result = result.concat(this.getChildren(child))
      }
      return result
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
    getIco(element, id){
      // console.log("elementId:", element.iconographyID, "searchID:", id);
      if (element.iconographyID === id){
        // console.log(" found! elementId:", element.iconographyID, "searchID:", id);
        let ico = JSON.parse(JSON.stringify(element))
        ico.children = []
        return ico
      } else {
        for (let child of element.children){
          // console.log("elementId:", element.iconographyID, "got to child:", child.iconographyID);
          let res = this.getIco(child, id)
          if (res !== null){
            return res
          }
        }
        return null
      }
    },
    setOSDImgOverlayAnno(){
      setOSDImgOverlayImg(this.annoImage, this.viewerAnnos)
    },
    setOSDimages(image){
      this.image = image
      console.log("change to ", getOSDURL(image));
      this.viewerImg.open(getOSDURL(image))
    },

    setOSDannos(image){
      this.annoImage = image
      console.log("change to ", getOSDURL(image));
      this.viewerAnnos.open(getOSDURL(image))
      if (image.filename === "accessNotPermitted.png"){
        this.disableTree();
        console.log("tree disabled:", this.icoAnnos);
      } else {
        this.enableTree();

      }
    },
    searchForAnnosByIcoID(id, annosFound){
      for ( var anno of this.depiction.relatedAnnotationList){
        for ( var ie of anno.tags){
          if (ie.iconographyID === id){
            annosFound.push(anno)
          }
        }
      }
      return annosFound
    },
    getAnnoByIcoID(item){
      console.log("getAnnoByIco for: ", item);
      var annosFound = [];
      for ( var anno of this.depiction.relatedAnnotationList){
        for ( var ie of anno.tags){
          console.log("compare", item.iconographyID, "with", ie.iconographyID);
          if (ie.iconographyID === item.iconographyID){
            annosFound.push(anno)
          }
        }
      }
      if (item.children.length > 0){
        for (var child of item.children){
          var result = []
          result = this.getAnnoByIcoID(child)
          if (result.length > 0){
            annosFound = annosFound.concat(result)
          }
        }
      }
      return annosFound
    },
    switchAnnoImageControl(){
      if (this.viewerAnnos.areControlsEnabled()){
        this.actControl = "Disable Controlls"
      } else {
        this.actControl = "Enable Controlls"
      }
      this.viewerAnnos.setControlsEnabled(!this.viewerAnnos.areControlsEnabled())
      this.viewerAnnos.setMouseNavEnabled(!this.viewerAnnos.isMouseNavEnabled())
    },
    getIconographyByAnnos(ids){
      var returnElement = []
      for (var rootElement of this.$store.state.dic.iconography){
        var dummy = Object.assign({}, rootElement)
        var result = this.searchTree(dummy, ids)
        if (result !== null){
          returnElement.push(result)
        }
      }
      console.log("returnElement", returnElement );
      return returnElement
    },
    addAnnotation(w3cAnno){
      console.log("addAnnotation:", w3cAnno);
      if (w3cAnno.target.id === this.annoImage.filename){
        console.log("started add annotation");
        // this.annotoriousplugin.addAnnotation(w3cAnno)
        this.annotoriousplugin.highlightAnnotation(w3cAnno.id)
      }
    },
    removeAnnotation(w3cAnno){
      if (w3cAnno.target.id === this.annoImage.filename){
        this.annotoriousplugin.dehighlightAnnotation(w3cAnno.id)
        this.annotoriousplugin.removeAnnotation(w3cAnno)
      }
    },
    mouseOverNode(item){
      var foundAnnos = this.getAnnoByIcoID(item)
      for (var anno of foundAnnos){
        var dummy = this.w3cAnnos.find(element => element.id === anno.annotoriousID)
        if (!Array.isArray(dummy)){
          this.addAnnotation(dummy)
        } else {
          for (var w3c of dummy){
            this.addAnnotation(w3c)
          }
        }
      }
    },
    updateSelectedAnnos(){
      console.log("UpdateSelectedAnnos triggered");
      // this.annotoriousplugin.setAnnotations([])
      for (let anno of this.w3cAnnos){
        this.annotoriousplugin.hideAnnotation(anno.id)
      }
      console.log("annoSelected", this.annoSelected);
      for (var icoAnno of this.annoSelected) {
        console.log("found Annotated Iconography: ", icoAnno);
        for (var anno of this.getAnnoByIcoID(icoAnno)) {
          console.log("Found related Anno:", anno);
          var dummy = this.w3cAnnos.find(element => element.id === anno.annotoriousID)
          console.log("found relatred w3cAnno:", dummy);
          if (!Array.isArray(dummy)){
            this.addAnnotation(dummy)
          } else {
            for (var w3c of dummy){
              this.addAnnotation(w3c)
            }
          }
        }
      }
      console.log("hoveredAnno:", this.hoveredAnno);
      if (this.hoveredAnno !== null && this.checkAnnoPermitted(this.annoImage)){
        console.log("found hovered Anno", this.hoveredAnno);
        this.addAnnotation(this.hoveredAnno)
      }
    },
    mouseLeaveNode(item){
      this.updateSelectedAnnos()
    },
    searchTree(element, ids){
      var newChildren = []
      if (element.children !== null){
        for (var child of element.children) {
          var hasChildren = this.searchTree(child, ids);
          if (hasChildren !== null){
            newChildren.push(hasChildren)
          }
        }
      }
      let copy = Object.assign({}, element)
      copy.children = newChildren;
      if ((ids.includes(copy.iconographyID)) || (copy.children.length > 0)){
        copy.id = copy.iconographyID
        return copy
      } else {
        return null
      }
    },
  },
  getElement(element, id){
    if (element.id === id){
      return element
    } else {
      for (var child of element.children){
        var result = this.getElement(child, id)
        if (result !== null){
          return result
        }
      }
      return null
    }
  },
  watch: {
    'annoSelected': function(newVal, oldVal) {
      this.updateSelectedAnnos()
    },
    'annoActivated': function(newVal, oldVal) {
      console.log("annoAvtivated changed:", newVal);
    },
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
