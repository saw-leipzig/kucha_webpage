<template>
  <div :style="'display:flex!important;flex-direction:column;'">
    <v-tabs ref="tabs"
      v-if="annos.length > 1"
      v-model="annoImg"
      centered
      light
      slider-color="yellow"
      return-object
      style="rgba(255, 255, 255, 0.2) !important;flex:0"
    >
      <v-tab
        v-for="(item, index) in annos"
        :id="item.imageID"
        :key="index"
        @click="setOSDannos(item)"
        style="rgba(255, 255, 255, 0.2) !important;"
      >
            <v-img v-if="getAccessLevel(item) === 2"
                :src="getThumbnail(item)"
              ></v-img>
            <v-icon x-large v-if="getAccessLevel(item) < 2">mdi-lock</v-icon>
      </v-tab>
    </v-tabs>
    <v-checkbox v-if="treeShowOption && deviceType() !== 'mobile'" dense class="mx-5 py-0 my-0" hide-details label="Hide tree."  v-model="dontShowTree"></v-checkbox>
    <v-row justify="center" class="mx-1" :style="'flex:1;'">
      <v-col class="d-flex flex-column align-stretch" style="flex:1" :cols="getCols('AnnoImg')">
        <v-tooltip v-if="showTag" :position-y="yTag" :position-x="xTag" right v-model="showTag" >
          <span >{{hoveredTags(hoveredAnno)}}</span>
        </v-tooltip>
        <v-card id="osdCard" v-show="getAccessLevel(annoImage) === 2" height="100%" class="py-0 d-flex flex-column align-stretch" :style="getAccessLevel(annoImage) === 2 ? '' : 'display: none!important'" >
          <div
            ref="mouseWheelOverlay"
            id="instructions"
              :absolute="true"
              :value="mouseWheelOverlay"
              opacity="0.8"
              class="hidden"
            >
              <h3>Press ctrl or use two fingers to navigate on the image!</h3>
          </div>
          <div class="my-1 d-flex flex-column align-stretch" ref="osdDiv" :id="'openseadragonAnno' + itemId" style="height:100%;width:100%;">
          <v-row no-gutters height="6%" ref="button" class="mt-1" :attach="'#openseadragonAnno' + itemId" style='position: relative;z-index: 4;margin:auto!important'>
            <v-dialog
              v-model="selectOrCopyDialog"
              persistent
              max-width="290"
            >
              <v-card>
                <v-card-title class="text-h5">
                  Select Action
                </v-card-title>
                <v-radio-group
                  v-model="selectOrCopy"
                >
                  <v-radio
                    label="Copy Annotation-URL"
                    value="copy"
                  ></v-radio>
                  <v-radio
                    label="Select Iconogrphic Elements of Annotation"
                    value="select"
                  ></v-radio>
                </v-radio-group>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="selectOrCopyDialog = false"
                  >
                    Cancle
                  </v-btn>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="doSelectOrCopy"
                  >
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-bottom-sheet
              v-model="sheet"
              inset
              hide-overlay
              :attach="'#openseadragonAnno' + itemId"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-row
                no-gutters
                >
                  <v-col
                  style="text-align: center;"
                  cols="12"
                  >
                    <v-btn
                    small
                    v-if="(isFullScreen || (deviceType() === 'mobile')) && treeShowOption"
                    class="text-xs-center"
                    :attach="'#openseadragonAnno' + itemId"
                      color="orange"
                      dark
                      v-bind="attrs"
                      v-on="on">
                      {{getLabelOpenAnnotations(attrs)}}
                    </v-btn>
                    <v-btn
                      small
                      dark
                      v-if="(isTouchDevice) && treeShowOption"
                      color="orange"
                      v-on:click="switchAnnoImageControl()"
                    >
                      {{actControl}}
                    </v-btn>
                  </v-col>
                  </v-row>
              </template>
                <v-sheet
                  :attach="'#openseadragonAnno' + itemId"
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
                    multiple-active
                    :active="annoActivated"
                  >
                    <template class="v-treeview-node__label" slot="label" slot-scope="{ item }">
                      <a v-on:click="clickAnno(item)" v-on:mouseover="mouseOverNode(item)"
                      v-on:mouseleave="mouseLeaveNode(item)"><div class="v-treeview-node__label">{{ item.name }}</div></a> <a :href="getIconographyLink(item)">[go to]</a>
                    </template>
                  </v-treeview>
                </v-lazy>
            </v-sheet>
          </v-bottom-sheet>
          </v-row>
          </div>
        <v-alert
            class="mx-1"
            :value="isDrawing"
            color="grey"
            dense
            border="top"
            icon="mdi-alert"
            transition="scale-transition"
            dismissible
            style="font-size:10px;line-height:1;"
          >
            Drawing not to scale; the proportions of the original may not be reproduced accurately.
        </v-alert>
        </v-card>
        <v-card height="100%" class="d-flex flex-column align-stretch" :style="getAccessLevel(annoImage) === 2 ? 'display: none!important' : ''">
          <v-card-title class="justify-center pt-15 font-weight-bold text-h5" style="word-break: break-word;">
            {{getAnnoTitle(annoImage)}}
          </v-card-title>
          <v-card-text  v-if="getAccessLevel(annoImage) === 1" class="pa-10">
            Annotations are based on an Image from:<p>
            {{annoImage.copyright}}
            </p>
            <p>For further information, please contact <a href= "mailto:kucha@saw-leipzig.de">the project</a></p>
          </v-card-text>
          <v-card-text  v-if="getAccessLevel(annoImage) === 0" class="pa-10">
            No image available!
            <p>For further information, please contact <a href= "mailto:kucha@saw-leipzig.de">the project</a></p>
          </v-card-text>
        </v-card>

      </v-col>
      <v-col :style="setHeight"
              v-if="!dontShowTree && deviceType() !== 'mobile'"
              :order="left ? 1 : 3" :cols="getCols('AnnoTree')"  :ref="'cardAnno' + itemId" style="max-height: 70vh;">
        <v-card
          style='overflow-y: scroll;
            overflow-x: hidden;
            flex: 1 1 0;'>
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
              selection-type="independent"
              :filter="filter"
              :search="search"
              return-object
              v-model="annoSelected"
              rounded
              selectable
              hoverable
              open-all
              multiple-active
              :active="annoActivated"
              :items="this.icoAnnos"
              dense>
              <template class="v-treeview-node__label" slot="label" slot-scope="{ item }">
                <div style="display: flex;">
                <div class="v-treeview-node__label"> <span v-on:mouseover="mouseOverNode(item)" v-on:click="clickAnno(item)"
                  v-on:mouseleave="mouseLeaveNode(item)">{{ item.name }}</span> <a style="min-width: 54px;" :href="getIconographyLink(item)">[go to]</a> </div>
                </div>
              </template>
            </v-treeview>
          </v-lazy>
        </v-card>
      </v-col>
      </v-row>
    </div>
</template>
<script>
import {getOSDURL, getIconographyByAnnos, setOSDImgOverlayImg, getIconographyByAnnosInGivenTree, deviceType} from  "@/utils/helpers"
import {getIconogrpaphyByTimestamp} from '@/services/repository'
import * as d3 from "d3";
import OpenSeadragon from 'openseadragon'
import '../../static/openseadragon-viewerinputhook.js'
import Annotorious from '../../static/openseadragon-annotorious.min.js'
import SelectorPack from '../../static/annotorious-selector-pack.min.js'
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'annotatedImage',
  components: {
  },
  props: {
    isVersion:{
      type: Object,
      default: function(){
        return {
          "date": "current"
        }
      }
    },
    showControls: {
      type: Boolean,
      default: true
    },
    item: {},
    annos: {
      type: Array
    },
    left: {
      type: Boolean,
      default: false
    },
    isZoom: {
      type: Boolean,
      default: false
    },
    hideTree: {
      type: Boolean,
      default: false
    },
    preSelected: {
      type: Array,
      default: function () {
        return []
      },
    },
    treeShowOption: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    presentationMode: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    relativeHeight: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    highlightedAnnotations: {
      type: Array,
      default: function () {
        return []
      }
    },
    relatedAnnotations: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      selectOrCopy: "copy",
      selectOrCopyDialog: false,
      isDrawing: false,
      dontShowTree: true,
      showTag:false,
      viewerAnnos: null,
      w3cAnnos: [],
      annotoriousplugin: {},
      icoAnnos: [],
      annoImage:{},
      actControl:"Explore",
      isFullScreen: false,
      annoSelected: [],
      annoActivated: [],
      search: null,
      annoArrow: false,
      annoImg: null,
      colsAnnoImg:8,
      colsAnnoTree:4,
      hoveredAnno:{},
      sheet:false,
      uniqueID: uuidv4(),
      selectedAnnotation: null,
      mouseWheelOverlay: false,
      isMounted: false,
      clientX: 0,
      clientY: 0

    }
  },
  computed: {
    isTouchDevice() {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
    },

    setHeight(){
      if (this.relativeHeight){
        return this.$vuetify.breakpoint.smAndDown ? 'height:100%;display: flex;' : 'flex:1;display: flex;'
      } else {
        return this.$vuetify.breakpoint.smAndDown ? 'height:100%;display: flex;' : 'flex:1;display: flex;'
      }
    },
    yTag(){
      if (this.dontShowTree){
        // this.$log.debug("hoveredAnno triggered", this.$refs['osdDiv'].getBoundingClientRect());
        if (this.$refs['osdDiv']){
          // this.$log.debug("hoveredAnno triggered", this.$refs['osdDiv'].getBoundingClientRect());
          return this.$refs['osdDiv'].getBoundingClientRect().y
        }
      } else {
        if (this.$refs['cardAnno' + this.itemId]){
          // this.$log.debug("hoveredAnno triggered", this.$refs['cardAnno' + this.itemId].getBoundingClientRect());
          return this.$refs['cardAnno' + this.itemId].getBoundingClientRect().y - 10
        }
      }
      return 0
    },
    xTag(){
      if (this.dontShowTree){
        if (this.$refs['osdDiv']){
          // this.$log.debug("hoveredAnno triggered", this.$refs['osdDiv']);
          return this.$refs['osdDiv'].getBoundingClientRect().x
        }
      } else {
        if (this.$refs['cardAnno' + this.itemId]){
          // this.$log.debug("hoveredAnno triggered", this.$refs['cardAnno' + this.itemId]);
          return this.$refs['cardAnno' + this.itemId].getBoundingClientRect().x
        }
      }
      return 0
    },
    itemId(){
      return this.uniqueID
    },
    filter () {
      return  (item, search, textKey) => {
        if (item.search) {
          // .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          return (item["search"].toLowerCase().normalize("NFD").indexOf(search) > -1 || item["name"].toLowerCase().normalize("NFD").indexOf(search) > -1)
        } else {
          return (item["name"].toLowerCase().normalize("NFD").indexOf(search) > -1)
        }
      }
    },
  },
  methods: {
    findElementinTree(element, tree){
      if (element.iconographyID === tree.iconographyID){
        return tree
      } else {
        for (let child of tree.children){
          let res = this.findElementinTree(element, child)
          if (res !== null){
            return res
          }
        }
        return null
      }
    },
    getIconographyLink(item){
      return window.location.origin  + "/iconography/" + item.id
    },
    clickAnno(item){
      let found = false
      let filteredAnnos = []
      for (let anno of this.annoSelected){
        if (anno.id === item.id){
          found = true
        } else {
          filteredAnnos.push(anno)
        }
      }
      if (found) {
        this.annoSelected = filteredAnnos
      } else {
        this.annoSelected.push(item)
      }
    },
    getLabelOpenAnnotations(attrs){
      if (attrs["aria-expanded"] !== "true"){
        return "Open Annotations"
      } else {
        return "Close Annotations"
      }
    },
    handleClick(event){
      this.$log.debug("click!", event);
      if (event.pointerType === "touch"){
        this.$log.debug("is touch");
      }
    },
    handleTouchStart(event){
      this.clientX = event.changedTouches[0].pageX;
      this.clientY = event.changedTouches[0].screenY;
    },
    handleTouch(event){
      if (this.isTouchDevice && this.actControl === "Explore"){
        const top = this.clientY - event.changedTouches[0].screenY
        window.scrollBy(0, top)
        this.clientX = event.changedTouches[0].screenX;
        this.clientY = event.changedTouches[0].screenY;
      }
    },
    handleScroll(event) {
      if (event.ctrlKey){
        event.preventDefault()
        this.viewerAnnos.setControlsEnabled(true)
        this.viewerAnnos.setMouseNavEnabled(true)
      } else {
        this.viewerAnnos.setControlsEnabled(false)
        this.viewerAnnos.setMouseNavEnabled(false)
        this.mouseWheelOverlay = true
        let _self = this
        setTimeout(function(){ _self.mouseWheelOverlay = false}, 2000);
      }
    },
    handleMove(event) {
      if (event.pointerType === "touch"){
        this.$log.debug("touching");
        event.preventDefaultAction = true
        this.viewerAnnos.setControlsEnabled(false)
        this.viewerAnnos.setMouseNavEnabled(false)
        this.mouseWheelOverlay = true
        let _self = this
        setTimeout(function(){ _self.mouseWheelOverlay = false}, 2000);
      } else if (event.buttons > 0){
        this.$log.debug("click-moving");
        if (event.originalEvent.ctrlKey){
          event.originalEvent.preventDefault()
          this.viewerAnnos.setControlsEnabled(true)
          this.viewerAnnos.setMouseNavEnabled(true)
        } else {
          this.viewerAnnos.setControlsEnabled(false)
          this.viewerAnnos.setMouseNavEnabled(false)
          this.mouseWheelOverlay = true
          let _self = this
          setTimeout(function(){ _self.mouseWheelOverlay = false}, 2000);
        }
      }
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(
        function() {
          /* clipboard successfully set */
        },
        function() {
          /* clipboard write failed */
        }
      )
    },
    doSelectOrCopy(){
      this.selectOrCopyDialog = false;
      if (this.selectOrCopy === "copy"){
        if (this.item.depictionID){
          this.copyToClipboard(window.location.origin + "/pr/" + this.item.depictionID + "/annotation/" + this.selectedAnnotation.id.replace("#", ""))
        } else {
          this.copyToClipboard(window.location.origin  + "/iconography/" + this.item.ornamentID + "/annotation/" + this.selectedAnnotation.id.replace("#", ""))
        }
      } else {
        // this.$log.debug("selection", evt);
        let found = false
        for (let anno of this.selectedAnnotation.body){
          const selectedIco = this.annoSelected.find(el => el.iconographyID === anno.id)
          // this.$log.debug("selectedIco", selectedIco);
          if (selectedIco !== undefined){
            found = true
            const index = this.annoSelected.indexOf(selectedIco);
            if (index > -1) {
              this.annoSelected.splice(index, 1);
            }
            // this.$log.debug("_self.annoSelected", _self.annoSelected);
          }
        }
        if (found){
          this.updateSelectedAnnos()
        } else {
          let annos = [];
          for (let anno of this.selectedAnnotation.body){
            if (Array.isArray(this.icoAnnos)){
              for (let ico of this.icoAnnos){
                let res = this.getIco(ico, anno.id)
                if (res !== null){
                  annos.push(res)
                  break
                }
              }
            } else {
              let res = this.getIco(this.icoAnnos, anno.id)
              if (res !== null){
                annos.push(res)
              }
            }
          }
          for (let anno of annos){
            if (this.annoSelected.find(el => el.iconographyID === anno.iconographyID) === undefined){
              this.annoSelected.push(anno)
            }
          }
          this.updateSelectedAnnos()
          // this.$log.debug("annotation selected: ", _self.annoSelected)
        }
      }
    },
    getCols(col){
      if (this.$vuetify.breakpoint.mdAndDown){
        return "12"
      } else if (this.dontShowTree) {
        return "12"
      } else {
        if (col === "AnnoImg"){
          return this.colsAnnoImg
        } else {
          return this.colsAnnoTree
        }
      }
    },
    getMainHeight(){
      if (this.$refs.tabs){
        return this.height - this.$refs.tabs.$el.clientHeight
      } else {
        return this.height
      }
    },
    getAccessLevel(item){
      if (item){
        if (item.accessLevel){
          return item.accessLevel
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    getAnnoTitle(item){
      return this.getAccessLevel(item) === 1 ?  "Access to the picture is restricted due to copyright reasons." : "Picture is not avilable."
    },
    mouseEnterAnnotation(annotation, evt){
      this.$log.debug("mouseenterannotation", event);
      if (!this.isTouchDevice || (this.isTouchDevice && this.actControl === "Navigate")){
        annotation.motivation = "highlight"
        this.annotoriousplugin.format(annotation)
        let annos = []
        for (let anno of annotation.body){
          if (Array.isArray(this.icoAnnos)){
            for (let ico of this.icoAnnos){
              let res = this.getIco(ico, anno.id)
              if (res !== null){
                annos.push(res)
                // this.$log.debug("adding annos:", res);
                break
              }
            }
          } else {
            let res = this.getIco(this.icoAnnos, anno.id)
            if (res !== null){
              annos.push(res)
            }
          }
        }
        for (let anno of annos){
          this.annoActivated.push(anno)
        }
        this.hoveredAnno = annotation
        this.showTag = true
        // this.updateSelectedAnnos()
        setTimeout(function(){ this.showTag = false}, 5000);
      }
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
    switchAnnoImageControl(){
      if (this.actControl !== "Navigate"){
        this.actControl = "Navigate"
        this.viewerAnnos.setControlsEnabled(true)
        this.viewerAnnos.setMouseNavEnabled(true)
      } else {
        this.actControl = "Explore"
        this.viewerAnnos.setControlsEnabled(false)
        this.viewerAnnos.setMouseNavEnabled(false)
      }
    },
    mouseOverNode(item){
      if (!item.locked){
        var foundAnnos = this.getAnnoByIcoID(item)
        this.choosPicForAnno(item)
        for (var anno of foundAnnos){
          var dummy = this.annotoriousplugin.getAnnotations().find(element => element.id === anno.annotoriousID)
          if (dummy){
            if (!Array.isArray(dummy)){
              dummy.motivation = "highlight"
              this.annotoriousplugin.format(dummy)
            } else {
              for (var w3c of dummy){
                w3c.motivation = "highlight"
                this.annotoriousplugin.format(w3c)
              }
            }
          }
        }
        this.viewerAnnos.forceRedraw()
      }
    },
    mouseLeaveNode(item){
      this.updateSelectedAnnos()
    },
    setAnnotationsForImage(){
      let annotations = []
      if (this.getAccessLevel(this.annoImage) > 1){
        for (let anno of this.w3cAnnos){
          if (anno) {
            if (this.annoImage.filename === anno.target.id){
              annotations.push(anno)
            }
          }
        }
      }
      this.annotoriousplugin.setAnnotations(annotations)
    },
    updateSelectedAnnos(){
      if (this.getAccessLevel(this.annoImage) > 1){
        let annotations = this.annotoriousplugin.getAnnotations()
        for (let anno of annotations){
          anno.motivation = "hide"
          for (var body of anno.body){
            for (var icoAnno of this.annoSelected) {
              if (body.id === icoAnno.iconographyID){
                anno.motivation = "highlight"
              }
            }
          }
          if (this.hoveredAnno !== null && this.getAccessLevel(this.annoImage) === 2){
            if (anno.id === this.hoveredAnno.id){
              anno.motivation = "highlight"
            }
          }
          if (this.highlightedAnnotations && this.getAccessLevel(this.annoImage) === 2){
            for (const annotoriousID of this.highlightedAnnotations){
              if (anno.id === "#" + annotoriousID){
                anno.motivation = "highlight"
              }
            }
          }
          this.annotoriousplugin.format(anno)
        }
      }
    },
    hoveredTags(hoveredAnno){
      // this.$log.debug("hoveredTags", hoveredAnno);
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
    getThumbnail(image){
      return process.env.VUE_APP_IIIFAPI + "/iiif/2/kucha%2Fimages%2F" + image.filename + "/full/!80,80/0/default.jpg"
    },
    setOSDImgOverlayAnno(){
      setOSDImgOverlayImg(this.annoImage, this.viewerAnnos)
    },
    deviceType() {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
      } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        this.$log.debug("mobile device");
        return "mobile";
      }
      return "desktop"
    },
    initOSDanno(){
      let tilesAnnos = []
      if (this.annos.length > 0){
        tilesAnnos = getOSDURL(this.annos[0])
        this.annoImage = this.annos[0]
        let options = {
          id: 'openseadragonAnno' + this.itemId,
          prefixUrl: '/static/',
          tileSources: tilesAnnos,
          showRotationControl: true,
          showFlipControl: true,
          maxZoomLevel: 100,
          visibilityRatio: 1.0,
          defaultZoomLevel: 0,
          minZoomLevel: 0.001,
          // ajaxWithCredentials: true,
          loadTilesWithAjax: true,
          // tileRequestHeaders: {"SessionID": ""},
          // ajaxHeaders: {"SessionID": ""},
        }
        if (!this.showControls){
          options['showNavigationControl'] = false
        }

        this.viewerAnnos = OpenSeadragon(options)
        this.viewerAnnos.setControlsEnabled(true)
        if (this.getAccessLevel(this.annoImage) === 2) {
          // this.$refs['osdDiv'].onwheel = this.handleScroll;
          // this.$refs['osdDiv'].touchmove = this.handleTouch;
        }
        const canvases = document.getElementsByClassName('openseadragon-canvas')
        for (const canvas of canvases)  {
          canvas.style.touchAction = 'pan-y'
          this.$log.debug("canvas.style", canvas.style);
          this.viewerAnnos.addViewerInputHook({ hooks: [
            {tracker: 'viewer',
              handler: 'scrollHandler',
              hookHandler: function (event) {
                this.$log.debug("scrollHandler", canvas);
                if (!_self.isFullScreen && !event.originalEvent.ctrlKey) {
                  event.preventDefaultAction = true;
                  event.stopHandlers = true;
                  // display meta key warning
                  _self.$refs.mouseWheelOverlay.className = 'visible'
                  setTimeout(function(){
                    _self.$refs.mouseWheelOverlay.className = 'hidden'
                    _self.mouseWheelOverlay = false
                  }, 2000);
                } else {
                  _self.$refs.mouseWheelOverlay.className = 'hidden'
                  _self.mouseWheelOverlay = false
                }
                return true;
              }},
          ]});

          // Handle drag scroll.
          // Only works if touch-action: pan-y else scroll event doesn't propigate to documen
          this.viewerAnnos.addViewerInputHook({ hooks: [
            {tracker: 'viewer',
              handler: 'dragHandler',
              hookHandler: function (event) {
              // if mobile disable drag event
              // pinch event handles panning with 2 fingers
                this.$log.debug("dragHandler", event);
                if (!_self.isFullScreen && deviceType() === "mobile" && _self.actControl === "Explore") {
                  this.$log.debug("overlay true", event);
                  _self.$refs.mouseWheelOverlay.className = 'visible'
                  _self.mouseWheelOverlay = true
                  event.stopPropagation = true
                  event.stopHandlers = true;
                  setTimeout(function(){
                    _self.$refs.mouseWheelOverlay.className = 'hidden'
                    _self.mouseWheelOverlay = true
                  }, 2000);
                } else {
                  _self.$refs.mouseWheelOverlay.className = 'hidden'
                  _self.mouseWheelOverlay = false
                }
                return true;
              }},
          ]});

          // Finally, remove the instructions on any pinch event.
          // This covers both mouse and touch devices
          this.viewerAnnos.addViewerInputHook({ hooks: [
            {tracker: 'viewer',
              handler: 'pinchHandler',
              hookHandler: function (event) {
                this.$log.debug("pinchHandler", event);
                if (_self.$refs.mouseWheelOverlay.className === 'visible') {
                  _self.$refs.mouseWheelOverlay.className = 'hidden';
                  _self.mouseWheelOverlay = false
                }
                return true;
              }},
          ]});
        }
        // Handle desktop scroll

        if (this.showControls){
          let infoButtonAnno = new OpenSeadragon.Button({
            tooltip: 'Shows Information to the right of the Image',
            srcRest: '/static/info_rest.png',
            srcGroup: '/static/info_grouphover.png',
            srcHover: '/static/info_hover.png',
            srcDown: '/static/info_pressed.png',
            onClick: this.setOSDImgOverlayAnno
          })
          this.viewerAnnos.addControl(infoButtonAnno.element, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
        }
        var MyHighlightFormatter = function(annotation) {
          if (annotation.motivation === "highlight"){
            return {
              'style': 'stroke-width:0px;stroke: gold;  fill: rgba(0, 128, 0,0.55);vector-effect: none;'
            }
          } else {
            return {
              'style': 'stroke-width:0px!important;  fill: rgba(0, 128, 0,0);vector-effect: none;'
            }
          }
        }
        // var MyHighlightFormatter = function(annotation) {
        //   if (annotation.motivation === "highlight"){
        //     return "highlight"
        //   } else {
        //     return "hide"
        //   }
        // }
        var config = {};
        config["readOnly"] = true;
        config["widgets"] = ['COMMENT', { widget: 'TAG', vocabulary: [], showDelete: false }]
        config["image"] = this.viewerAnnos;
        config["formatter"] = [MyHighlightFormatter];
        this.annotoriousplugin = Annotorious(this.viewerAnnos, config)
        SelectorPack(this.annotoriousplugin);
        this.viewerAnnos.setControlsEnabled(true);
        this.viewerAnnos.setMouseNavEnabled(true);
        var _self = this;
        // eslint-disable-next-line
        // new OpenSeadragon.MouseTracker({
        //   element: _self.viewerAnnos.canvas,
        //   // moveHandler: _self.handleMove,
        //   // clickHandler: _self.clickHandler
        //   scrollHandler: function (event) {
        //     this.$log.debug("scrollHandler", event);
        //     if (!_self.viewerAnnos.isFullPage() && !event.originalEvent.ctrlKey) {
        //       event.preventDefaultAction = true;
        //       event.stopHandlers = true;
        //       // display meta key warning
        //       _self.mouseWheelOverlay = true
        //       setTimeout(function(){ _self.mouseWheelOverlay = false}, 2000);
        //     } else {
        //       this.mouseWheelOverlay = false
        //     }
        //     return true;
        //   },
        //   dragHandler: function (event) {
        //     // if mobile disable drag event
        //     // pinch event handles panning with 2 fingers
        //     if (!_self.viewerAnnos.isFullPage() && navigator.userAgentData.mobile) {
        //       this.$log.debug("dragHandler", navigator.userAgentData.mobile);
        //       event.preventDefaultAction = true;
        //       event.stopHandlers = true;
        //       // this.mouseWheelOverlay = true
        //       let _self = this
        //       setTimeout(function(){ _self.mouseWheelOverlay = false}, 2000);
        //     } else {
        //       this.mouseWheelOverlay = false
        //     }
        //     return true;
        //   }
        // })
        // this.viewerAnnos.addHandler('open', function(target) {
        //   this.$log.debug("blibb, tile drawn");
        //   _self.viewerAnnos.getBounds()
        //   let annos = _self.annotoriousplugin.getAnnotations()
        //   this.$log.debug("blibb annos are:", annos);
        //   if (annos.length > 0){
        //     _self.annotoriousplugin.fitBounds(annos)
        //   }
        // })
        _self = this
        this.annotoriousplugin.disableEditor = true
        this.annotoriousplugin.on('mouseEnterAnnotation', function(annotation, event) {
          _self.mouseEnterAnnotation(annotation, event)
        });

        this.annotoriousplugin.on('mouseLeaveAnnotation', function(annotation, evt) {
          if (!_self.isTouchDevice || (_self.isTouchDevice && _self.actControl === "Navigate")){
            _self.annoActivated = []
            _self.showTag = false
            _self.hoveredAnno = null
            _self.updateSelectedAnnos()
          }
        });

        this.annotoriousplugin.on('cancelSelected', function(annotation, evt) {
          // this.$log.debug("deselection", evt);
        });
        this.annotoriousplugin.on('clickAnnotation', function(annotation, evt) {
          if (!_self.isTouchDevice || (_self.isTouchDevice && _self.actControl === "Navigate")){
            this.$log.debug("is navigate!");
            if (annotation.id !== _self.hoveredAnno.id){
              _self.mouseEnterAnnotation(annotation, evt)
            } else {
              if (!_self.mouseWheelOverlay){
                _self.selectedAnnotation = annotation
                _self.selectOrCopyDialog = true
              }
            }
          }
          setTimeout(function(){ _self.annotoriousplugin.selectAnnotation();}, 1000);
        });

        this.viewerAnnos.addHandler("open", function (data) {
          if (_self.$refs.osdDiv !== undefined){
            if (_self.$refs.osdDiv.clientHeight > 0){
              // this.$log.debug("osdDiv", _self.$refs.osdDiv);
              _self.goHome(true)
            }
          }
        });
        this.viewerAnnos.addHandler("tile-loaded", function (data) {
          // _self.viewerAnnos.viewport.goHome(true)
        });
        const annotationLayers = document.getElementsByClassName('a9s-annotationlayer')
        for (const canvas of annotationLayers){
          canvas.style.touchAction = 'pan-y'
          canvas.addEventListener('touchstart', this.handleTouchStart);
          canvas.addEventListener('touchmove', this.handleTouch);
        }
        document.getElementById('openseadragonAnno' + this.itemId).addEventListener('fullscreenchange', (event) => {
          if (document.fullscreenElement) {
            _self.isFullScreen = true
          } else {
            _self.isFullScreen = false
            _self.sheet = false
          }
        });
        this.viewerAnnos.addHandler("pre-full-page", function (data) {
          data.preventDefaultAction = true;
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
    getItemID(){
      if (this.item.ornamentID){
        return "ornament_" + this.item.ornamentID
      }
      if (this.item.depictionID){
        return "depiction" + this.item.depictionID
      }
      if (this.item.iconographyID){
        return "iconography" + this.item.iconographyID
      }
    },
    disableTree() {
      for (let rootItem of this.icoAnnos){
        rootItem.locked = true
      }
    },
    disableUnavailableInTree() {
      for (let rootItem of this.icoAnnos){
        this.disableUnavailable(rootItem)
      }
    },
    disableUnavailable(element){
      let locked = true
      for (let child of element.children){
        let res = this.disableUnavailable(child)
        if (!res){
          locked = res
        }
      }
      let foundPic = false
      for (let w3c of element.w3cAnno){
        for (let pic of this.annos){
          if (pic.filename === w3c.target.id){
            foundPic = true
          }
        }
      }
      if (!foundPic && locked){
        element.locked = true
      } else {
        element.locked = false
      }
      return element.locked
    },
    enableTree() {
      for (let rootItem of this.icoAnnos){
        rootItem.locked = false
      }
    },
    getAnnoByIcoID(item){
      var annosFound = [];
      for ( var anno of this.relatedAnnotations){
        for ( var ie of anno.tags){
          if (ie.iconographyID === item.iconographyID){
            annosFound.push(anno)
          }
        }
      }
      if (item.children){
        if (item.children.length > 0){
          for (var child of item.children){
            var result = []
            result = this.getAnnoByIcoID(child)
            if (result.length > 0){
              annosFound = annosFound.concat(result)
            }
          }
        }
      }
      return annosFound
    },
    hideAnnotation(w3cAnnoID){
      var annoToHide = this.annotoriousplugin.getAnnotationById(w3cAnnoID)
      if (annoToHide) {
        annoToHide['motivation'] = "hide"
        this.annotoriousplugin.format(annoToHide)
      }
    },
    addAnnotation(w3cAnno){
      var annoToHighlight = this.annotoriousplugin.getAnnotationById(w3cAnno)
      if (annoToHighlight) {
        annoToHighlight["motivation"] = "highlight"
        this.annotoriousplugin.format(annoToHighlight)
      }
      // if (w3cAnno.target){
      //   if (w3cAnno.target.id === this.annoImage.filename){
      //     this.$log.debug("this.annotoriousplugin", w3cAnno, this.annotoriousplugin.getAnnotationById(w3cAnno));
      //     this.annotoriousplugin.getAnnotationById(w3cAnno)['motivation'] = "highlight"
      //   }
      // }
    },
    setOSDannos(image){
      if (this.getAccessLevel(this.annoImage) < 2){
        this.disableUnavailableInTree();
      } else {
        this.enableTree();
      }
      this.annoImage = image
      if (this.annoImage.imageTypeID === 5){
        if (this.showControls){
          this.isDrawing = true
        } else {
          this.isDrawing = false
        }
      } else {
        this.isDrawing = false
      }
      this.viewerAnnos.open(getOSDURL(image))
      this.viewerAnnos.viewport.goHome(true)
      this.setAnnotationsForImage()
      this.updateSelectedAnnos()
    },
    getIco(element, id){
      if (element.iconographyID === id){
        let ico = JSON.parse(JSON.stringify(element))
        ico.children = []
        return ico
      } else {
        for (let child of element.children){
          // this.$log.debug("elementId:", element.iconographyID, "got to child:", child.iconographyID);
          let res = this.getIco(child, id)
          if (res !== null){
            return res
          }
        }
        return null
      }
    },
    putW3cInAnnos(anno){
      for (let rootItem of this.icoAnnos){
        this.findInTree(rootItem, anno)
      }
    },
    findInTree(element, w3cAnno){
      for (let body  of w3cAnno.body){
        if (body.id === element.iconographyID){
          element.w3cAnno.push(w3cAnno)
        }
      }
      for (let child of element.children){
        this.findInTree(child, w3cAnno)
      }
    },
    initNewAnnotatedImage(doW3c){
      if (doW3c){
        var allAnnotationEntries = []
        this.w3cAnnos = []
        var geoGenerator = d3.geoPath()
        for (var ae of this.relatedAnnotations) {
          var bodies = []
          for (var ie of ae.tags) {
            if (!allAnnotationEntries.includes(ie)) {
              allAnnotationEntries.push(ie.iconographyID);
              var body = {};
              body["type"] = "TextualBody";
              if (ie.name){
                body["value"] = ie.name;
              } else {
                body["value"] = ie.text;
              }
              body["id"] = ie.iconographyID;
              body["image"] = ae.image;
              bodies.push(body);
            }
          }
          var anno = {};
          anno["@context"] = "http://www.w3.org/ns/anno.jsonld";
          anno["id"] = ae.annotoriousID;
          anno["type"] = "Annotation";
          anno["motivation"] = "highlight"
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
        if (this.isVersion){
          if (this.isVersion.date.toString().includes('current')){
            this.$log.debug("1. possibility");
            this.icoAnnos = getIconographyByAnnos(allAnnotationEntries)
          } else {
            getIconogrpaphyByTimestamp(this.isVersion._source.timestamp)
              .then( res => {
                this.$log.debug("recieved versions of iconography.", res.data.hits.hits[0]._source.content.iconography)
                this.$log.debug("2. possibility");
                this.icoAnnos = getIconographyByAnnosInGivenTree(allAnnotationEntries, res.data.hits.hits[0]._source.content.iconography)
              }).catch(function (error) {
                this.$log.debug(error)
                return null
              })
            this.$log.debug("3. possibility");
            this.icoAnnos = getIconographyByAnnos(allAnnotationEntries)

          }
        } else {
          this.$log.debug("4. possibility");
          this.icoAnnos = getIconographyByAnnos(allAnnotationEntries)
        }
        this.$log.debug("icoannos:", this.icoAnnos);
        for (let w3cAnno of this.w3cAnnos){
          this.putW3cInAnnos(w3cAnno)
        }

      }
      this.disableUnavailableInTree()
      if (this.annos.length > 0){
        OpenSeadragon.setString('Tooltips.SelectionT@focus="$event.target.select()"oggle', 'Selection Demo');
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
        if (this.viewerAnnos === null){
          this.initOSDanno()
        }
        this.annoSelected = []
        if (this.preSelected){
          for (let annoSelected of this.preSelected){
            for (let treeElement of this.icoAnnos){
              let res = this.findElementinTree(annoSelected, treeElement)
              if (res !== null){
                this.annoSelected.push(res)
                break
              }
            }
          }
        }
        //  this.annoSelected = this.preSelected
        if (this.getAccessLevel(this.annoImage) > -1){
          this.setOSDannos(this.annos[0])
        }
        if (Object.keys(this.annotoriousplugin).length > 0){
          let shownAnnos = []
          for (let anno of this.w3cAnnos){
            if (this.annoImage.filename === anno.target.id){
              shownAnnos.push(anno)
            }
          }
          this.annotoriousplugin.setAnnotations(shownAnnos)
        }
      }
    },
    hideTag(){
      this.showTag = false
    },
    goHome(direct){
      this.$log.debug("start goHome", direct);
      const _self = this
      if (direct){
        this.$log.debug("direct goHome");
        setTimeout(function(){ _self.viewerAnnos.viewport.goHome() }, 50);
      }
      if (this.isZoom){
        let annos = []
        for (const anno of _self.annotoriousplugin.getAnnotations()){
          if (this.annoImage.filename === anno.target.id) {
            annos.push(anno)
          }
        }
        if (annos.length > 0){
          setTimeout(function(){ _self.annotoriousplugin.fitBounds(annos, false)}, 50);
        } else {
          setTimeout(function(){ _self.viewerAnnos.viewport.goHome() }, 50);
        }
      }
    },
    choosPicForAnno(icoAnno){
      if (this.annos.length > 0){
        let anno = this.getAnnoByIcoID(icoAnno)
        let annoImages = []
        for (let a of anno){
          if (!annoImages.includes(a.image)) {
            annoImages.push(a.image);
          }
        }
        const freepics = this.annos.filter(word => word.accessLevel === 2);
        let annosInPic
        if (!this.annoImage || this.annoImage.accessLevel < 2){
          annosInPic = []
        } else {
          annosInPic = anno.filter(anno => anno.image  === this.annoImage.filename);
        }
        if (annosInPic.length === 0){
          if (anno.length > 0){
            let relevantFreePics = freepics.filter(img => annoImages.includes(img.filename))[0]
            this.$log.debug("relevantFreePics", relevantFreePics);
            if (relevantFreePics) {
              this.setOSDannos(relevantFreePics)
            } else {
              this.setOSDannos(this.annos.filter(img => annoImages.includes(img.filename))[0])
            }
          }
        }
        this.updateSelectedAnnos()

      }
    },
    selectChildren(parent){
      for (let child of parent.children){
        this.selectChildren(child)
        this.annoSelected.push(child)
      }
    },
    deselectChildren(parent){
      for (let child of parent.children){
        this.deselectChildren(child)
        const index = this.annoSelected.indexOf(child);
        if (index > -1) {
          this.annoSelected.splice(index, 1);
        }
      }
    }
  },
  watch: {
    'annoSelected': function(newVal, oldVal) {
      let newlySelected = newVal
        .filter(x => !oldVal.includes(x))
      for (let nselected of newlySelected){
        this.selectChildren(nselected)
      }
      let newlyDeselected = oldVal
        .filter(x => !newVal.includes(x))
      for (let ndeselected of newlyDeselected){
        this.deselectChildren(ndeselected)
      }
      if (this.isMounted){
        if (this.annos.length > 1){
          let difference = newVal
            .filter(x => !oldVal.includes(x))
            .concat(oldVal.filter(x => !newVal.includes(x)));
          for (var icoAnno of difference) {
            this.choosPicForAnno(icoAnno)
          }
        }
        this.updateSelectedAnnos()
      }
    },
    'anno': function (newVal, oldVal) {
      if (this.isMounted){
        const _self = this
        setTimeout(function(){ _self.viewerAnnos.viewport.goHome() }, 50);
        this.updateSelectedAnnos()
        this.goHome()
      }
    },
    'relatedAnnotations':function (newVal, oldVal) {
      if (this.isMounted){
        if (Object.keys(this.annotoriousplugin).length > 0){
          this.annotoriousplugin.clearAnnotations();
        }
        this.initNewAnnotatedImage(true)
        this.updateSelectedAnnos()
      }
    },
    'hideTree':function (newVal, oldVal) {
      if (newVal){
        this.dontShowTree = true
      } else {
        this.dontShowTree = false
      }
    },
    'item': function (newVal, oldVal) {
    },
    'annoActivated': function(newVal, oldVal) {
      if (this.isMounted){
        this.updateSelectedAnnos()
      }
    },
    'dontShowTree': function(newVal, oldVal) {
      if (this.isMounted){
        if (Object.keys(this.annotoriousplugin).length > 0){
          let _self = this
          setTimeout(function(){ _self.viewerAnnos.viewport.goHome() }, 50);
        }
      }
    },
    'annos': function(newVal, oldVal) {
      if (this.isMounted){
        this.initNewAnnotatedImage(false)
      }
    },
    'preSelected': function(newVal, oldVal) {
      // if (this.isMounted){
      //   if (this.item.depictionID){
      //     let icos = []
      //     for (let ico of newVal){
      //       icos.push(ico.iconographyID)
      //     }
      //     this.$log.debug("preSelected changed,", this.item.depictionID);
      //   }
      // }
    },
  },
  created () {
  },
  beforeDestroyed () {
    if (this.getAccessLevel(this.annoImage) === 2) {
      // this.$refs['osdDiv'].removeEventListener('wheel', this.handleScroll);
    }
  },
  mounted:function () {
    this.$log.debug("istouchdevice: ", this.isTouchDevice);
    this.isMounted = true
    if (this.treeShowOption){
      this.dontShowTree = true
    }
    if (this.hideTree){
      this.dontShowTree = true
    } else {
      this.dontShowTree = false
    }
    this.updateSelectedAnnos()
    this.initNewAnnotatedImage(true)
    const _self = this
    if (this.viewerAnnos){
      setTimeout(function(){
        _self.viewerAnnos.viewport.goHome(true)
      }, 500);
    }
  },
  beforeDestroy:function () {
  }
}
</script>

<style lang="css" >
.theme--light.v-tabs > .v-tabs-bar {
  background-color: rgba(255, 255, 255, 0.0) !important;
}
.a9s-outer {
  transition: fill 1s, stroke-width 0.7s;
  stroke: #fff000;
  fill: rgba(0, 128, 0,0.55);
  stroke-width:0px;
  display: inline !important;
}
.a9s-inner {
  transition: fill 1s, stroke-width 0.7s;
  stroke: #fff000;
  fill: rgba(0, 128, 0,0);
  stroke-width:0px;
  display: inline !important;
}
.hidden {
  visibility: hidden;
}

.visible {
  visibility: visible;
}
#instructions {
  pointer-events: none!important;
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  font-size: 16px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.a9s-annotation.highlight .a9s-inner {
  transition: fill 1s, stroke-width 0.7s;
  stroke: #fff000;
  fill: rgba(0, 128, 0,0.55)!important;
  stroke-width:0px!important;
}

.a9s-annotation.highlight .a9s-outer:hover {
  transition: fill 1s, stroke-width 0.7s;
  stroke-width:0px;
  fill: rgba(255, 255, 255, 0);
}
.a9s-annotation.highlight .a9s-outer {
  transition: fill 1s, stroke-width 0.7s;
  stroke: #fff000;
  fill: rgba(0, 128, 0,0);
  stroke-width:0px;
}
.a9s-annotation.hide .a9s-outer {
  transition: fill 1s, stroke-width 0.7s;
  stroke: #fff000;
  fill: rgba(0, 128, 0,0);
  stroke-width:0px;
}

.a9s-annotation.hide .a9s-outer:hover {
  transition: fill 1s, stroke-width 0.7s;
  stroke-width:0px;
  fill: rgba(255, 255, 255, 0);
}
.a9s-annotation.hide .a9s-inner {
  transition: fill 1s, stroke-width 0.7s;
  fill: rgba(255, 255, 255, 0);
  stroke-width:0px;
}

.a9s-annotation.hide .a9s-inner:hover {
  stroke: #fff000;
  vector-effect: none;
  fill: rgba(0, 128, 0,0);
  stroke-width:0px;
  transition: fill 1s, stroke-width 0.7s;
}
</style>
