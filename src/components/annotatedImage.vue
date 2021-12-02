<template>
  <div :style="'display:flex;flex-direction:column;'">
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
    <v-checkbox v-if="treeShowOption" dense class="mx-5 py-0 my-0" hide-details label="Hide tree."  v-model="dontShowTree"></v-checkbox>
    <v-row justify="center" class="mx-5" :style="'flex:1;'">
      <v-col order="2"  :cols="getCols('AnnoImg')"  :style="setHeight">
        <v-tooltip v-if="showTag" :position-y="yTag" :position-x="xTag" right v-model="showTag" >
          <span >{{hoveredTags(hoveredAnno)}}</span>
        </v-tooltip>
        <v-card height="100%" width="100%" :style="getAccessLevel(annoImage) === 2 ? 'flex-direction: column;background-color: rgba(255, 255, 255, 1) !important;display:flex' : 'display: none;background-color: rgba(255, 255, 255, 1) !important;'">
          <div class="mt-5" ref="osdDiv"  :id="'openseadragonAnno' + itemId"  style='margin:0;padding:0;height:100%;'>
          <v-row height="100%" class="mt-0 mx-0" :attach="'#openseadragonAnno' + itemId" style='position: relative;z-index: 4'>
            <v-bottom-sheet
              v-model="sheet"
              inset
              hide-overlay
              :attach="'#openseadragonAnno' + itemId"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-row
                  allign="start"
                >
                  <v-col
                  style="text-align: center;"
                  v-if="isFullScreen"
                  cols="6"
                  >
                    <v-btn
                    class="text-xs-center"
                    :attach="'#openseadragonAnno' + itemId"
                      color="orange"
                      dark
                      v-bind="attrs"
                      v-on="on">
                      Open Annotations
                    </v-btn>
                  </v-col>
                  <v-col v-if="showControls" :cols="isFullScreen? '6' : '12'" style="text-align: center;">
                    <v-btn
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
        <v-card height="100%" :style=" getAccessLevel(annoImage) < 2 ? 'overflow-y: scroll;background-color: rgba(255, 255, 255, 1) !important;' : 'display: none;height:525px;background-color: rgba(255, 255, 255, 1) !important;'">
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
              v-if="!dontShowTree"
              :order="left ? 1 : 3" :cols="getCols('AnnoTree')"  :ref="'cardAnno' + itemId">
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
              selection-type="leaf"
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
                <a v-on:mouseover="mouseOverNode(item)"
                  v-on:mouseleave="mouseLeaveNode(item)"><div class="v-treeview-node__label">{{ item.name }}</div></a>
              </template>
            </v-treeview>
          </v-lazy>
        </v-card>
      </v-col>
      </v-row>
    </div>
</template>
<script>
import {getOSDURL, getIconographyByAnnos, setOSDImgOverlayImg} from  "@/utils/helpers"
import * as d3 from "d3";
import OpenSeadragon from 'openseadragon'
import Annotorious from '../../static/openseadragon-annotorious.min.js'
import SelectorPack from '../../static/annotorious-selector-pack.min.js'
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'annotatedImage',
  components: {
  },
  props: {
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
    relativeHeight: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    relatedAnnotations: null,
  },
  data () {
    return {
      dontShowTree: true,
      showTag:false,
      viewerAnnos: null,
      w3cAnnos: [],
      annotoriousplugin: {},
      icoAnnos: [],
      annoImage:{},
      actControl:"Enable Controls",
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
      uniqueID: uuidv4()

    }
  },
  computed: {
    setHeight(){
      if (this.relativeHeight){
        return this.$vuetify.breakpoint.smAndDown ? 'height:100%;display: flex;' : 'height:100&;flex:1;display: flex;'
      } else {
        return this.$vuetify.breakpoint.smAndDown ? 'height:70vh;display: flex;' : 'height:70vh;flex:1;display: flex;'
      }
    },
    yTag(){
      if (this.dontShowTree){
        // console.log("hoveredAnno triggered", this.$refs['osdDiv'].getBoundingClientRect());
        if (this.$refs['osdDiv']){
          // console.log("hoveredAnno triggered", this.$refs['osdDiv'].getBoundingClientRect());
          return this.$refs['osdDiv'].getBoundingClientRect().y
        }
      } else {
        if (this.$refs['cardAnno' + this.itemId]){
          // console.log("hoveredAnno triggered", this.$refs['cardAnno' + this.itemId].getBoundingClientRect());
          return this.$refs['cardAnno' + this.itemId].getBoundingClientRect().y - 10
        }
      }
      return 0
    },
    xTag(){
      if (this.dontShowTree){
        if (this.$refs['osdDiv']){
          // console.log("hoveredAnno triggered", this.$refs['osdDiv']);
          return this.$refs['osdDiv'].getBoundingClientRect().x
        }
      } else {
        if (this.$refs['cardAnno' + this.itemId]){
          // console.log("hoveredAnno triggered", this.$refs['cardAnno' + this.itemId]);
          return this.$refs['cardAnno' + this.itemId].getBoundingClientRect().x
        }
      }
      return 0
    },
    itemId(){
      return this.uniqueID
    },

  },
  methods: {
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
      if (this.viewerAnnos.areControlsEnabled()){
        this.actControl = "Disable Controls"
      } else {
        this.actControl = "Enable Controls"
      }
      this.viewerAnnos.setControlsEnabled(!this.viewerAnnos.areControlsEnabled())
      this.viewerAnnos.setMouseNavEnabled(!this.viewerAnnos.isMouseNavEnabled())
    },
    mouseOverNode(item){
      if (!item.locked){
        var foundAnnos = this.getAnnoByIcoID(item)
        this.choosPicForAnno(item)
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
      }
    },
    mouseLeaveNode(item){
      this.updateSelectedAnnos()
    },
    updateSelectedAnnos(){
      if (this.getAccessLevel(this.annoImage) > 1){
        for (let anno of this.w3cAnnos){
          if (!this.dontShowTree){
            this.hideAnnotation(anno.id)
          } else {
            if (anno) {
              if (this.annoImage.filename !== anno.body.image){
                this.hideAnnotation(anno.id)
              }
            }
          }
        }
        for (var icoAnno of this.annoSelected) {
          for (var anno of this.getAnnoByIcoID(icoAnno)) {
            var dummy = this.w3cAnnos.find(element => element.id === anno.annotoriousID)
            if (!Array.isArray(dummy)){
              this.addAnnotation(dummy)
            } else {
              for (var w3c of dummy){
                this.addAnnotation(w3c)
              }
            }
          }
        }
        if (this.hoveredAnno !== null && this.getAccessLevel(this.annoImage) === 2){
          this.addAnnotation(this.hoveredAnno)
        }
      }
    },
    filter () {
      return  (item, search, textKey) => {
        return (item["search"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1 || item["name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1)
      }
    },
    hoveredTags(hoveredAnno){
      // console.log("hoveredTags", hoveredAnno);
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
          minZoomLevel: 0.001,
          ajaxWithCredentials: true,
          loadTilesWithAjax: true,
          tileRequestHeaders: {"SessionID": ""},
          ajaxHeaders: {"SessionID": ""},
        }
        if (!this.showControls){
          options['showNavigationControl'] = false
        }
        this.viewerAnnos = OpenSeadragon(options)
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
        var config = {};
        config["readOnly"] = true;
        config["widgets"] = ['COMMENT', { widget: 'TAG', vocabulary: [], showDelete: false }]
        config["image"] = this.viewerAnnos;
        this.annotoriousplugin = Annotorious(this.viewerAnnos, config)
        SelectorPack(this.annotoriousplugin);
        this.viewerAnnos.setControlsEnabled(false);
        this.viewerAnnos.setMouseNavEnabled(false);
        var _self = this;
        // this.viewerAnnos.addHandler('open', function(target) {
        //   console.log("blibb, tile drawn");
        //   _self.viewerAnnos.getBounds()
        //   let annos = _self.annotoriousplugin.getAnnotations()
        //   console.log("blibb annos are:", annos);
        //   if (annos.length > 0){
        //     _self.annotoriousplugin.fitBounds(annos)
        //   }
        // })

        this.annotoriousplugin.disableEditor = true
        this.annotoriousplugin.on('mouseEnterAnnotation', function(annotation, event) {
          let annos = []
          for (let anno of annotation.body){
            if (Array.isArray(_self.icoAnnos)){
              for (let ico of _self.icoAnnos){
                let res = _self.getIco(ico, anno.id)
                if (res !== null){
                  annos.push(res)
                  // console.log("adding annos:", res);
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
          _self.showTag = true
          _self.updateSelectedAnnos()
          _self.goHome()
        });

        this.annotoriousplugin.on('mouseLeaveAnnotation', function(annotation, evt) {
          _self.annoActivated = []
          _self.showTag = false
          _self.hoveredAnno = null
          _self.updateSelectedAnnos()
        });
        this.annotoriousplugin.on('cancelSelected', function(annotation, evt) {
          // console.log("deselection", evt);
        });
        this.annotoriousplugin.on('selectAnnotation', function(annotation, evt) {
          // console.log("selection", evt);
          let found = false
          for (let anno of annotation.body){
            const selectedIco = _self.annoSelected.find(el => el.iconographyID === anno.id)
            // console.log("selectedIco", selectedIco);
            if (selectedIco !== undefined){
              found = true
              const index = _self.annoSelected.indexOf(selectedIco);
              if (index > -1) {
                _self.annoSelected.splice(index, 1);
              }
              // console.log("_self.annoSelected", _self.annoSelected);
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
            // console.log("annotation selected: ", _self.annoSelected)
          }
        });
        _self = this
        this.viewerAnnos.addHandler("open", function (data) {
          if (_self.$refs.osdDiv !== undefined){
            if (_self.$refs.osdDiv.clientHeight > 0){
              // console.log("osdDiv", _self.$refs.osdDiv);
              _self.goHome()
            }
          }
        });
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
      const style = {
        style:{
          outer: {
            "fill": "rgba(0, 128, 0,0)",
            "stroke-width":"0px",
            "transition": "fill 1s,stroke-width 0.7s"
          },
          inner: {
            "stroke-width": "0px",
            "transition": "stroke-width 0.7s"
          }
        }
      }
      this.annotoriousplugin.setAnnotationStyle(w3cAnnoID, style)
    },
    addAnnotation(w3cAnno){
      console.log("addannotation started");
      if (w3cAnno.target){
        if (w3cAnno.target.id === this.annoImage.filename){
          const style = {
            style:{
              outer: {
                "vector-effect": "none",
                "stroke": "#fff",
                "fill": "rgba(0, 128, 0,0.55)",
                "stroke-width":"1px",
                "transition": "fill 1s, stroke-width 0.7s"
              },
              inner: {
                "vector-effect": "none",
                "stroke": "#fff",
                "stroke-width": "1px",
                "transition": "stroke-width 0.7s"
              }
            }
          }
          this.annotoriousplugin.setAnnotationStyle(w3cAnno.id, style)
        }
      }
    },
    setOSDannos(image){
      if (this.getAccessLevel(this.annoImage) < 2){
        this.disableUnavailableInTree();
      } else {
        this.enableTree();
      }
      this.annoImage = image
      this.viewerAnnos.open(getOSDURL(image))
      this.updateSelectedAnnos()
      this.goHome()
    },
    getIco(element, id){
      if (element.iconographyID === id){
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
        this.icoAnnos = getIconographyByAnnos(allAnnotationEntries)
        for (let w3cAnno of this.w3cAnnos){
          this.putW3cInAnnos(w3cAnno)
        }

      }
      this.disableUnavailableInTree()
      if (this.annos.length > 0){
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
        if (this.viewerAnnos === null){
          this.initOSDanno()
        }
        this.annoSelected = this.preSelected
        if (this.getAccessLevel(this.annoImage) > -1){
          this.setOSDannos(this.annos[0])
        }
        if (Object.keys(this.annotoriousplugin).length > 0){
          let shownAnnos = []
          for (let anno of this.w3cAnnos){
            console.log("annotation:", this.annoImage.filename);
            console.log("annoImage is:", anno.target.id);
            if (this.annoImage.filename === anno.target.id){
              shownAnnos.push(anno)
            }
          }
          console.log("added Annotations:", shownAnnos);
          this.annotoriousplugin.setAnnotations(shownAnnos)
          if (!this.dontShowTree){
            for (let anno of this.w3cAnnos){
              this.hideAnnotation(anno.id)
            }
          }
        }
      }
    },
    hideTag(){
      this.showTag = false
    },
    goHome(){
      if (this.isZoom){
        const _self = this
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
      let anno = this.getAnnoByIcoID(icoAnno)
      let i = 0
      const freeAnnos = this.annos.filter(word => word.accessLevel === 2);

      for (let ae of freeAnnos){
        if (ae.filename === anno[0].image){
          if (this.annoImg !== i){
            this.annoImg = i
            this.setOSDannos(ae)
          }
          break
        } else {
          i = i + 1
        }
      }
      this.updateSelectedAnnos()
    }
  },
  watch: {
    'annoSelected': function(newVal, oldVal) {
      if (this.annos.length > 1){
        let difference = newVal
          .filter(x => !oldVal.includes(x))
          .concat(oldVal.filter(x => !newVal.includes(x)));
        for (var icoAnno of difference) {
          this.choosPicForAnno(icoAnno)
        }
      }
      this.updateSelectedAnnos()
    },
    'anno': function (newVal, oldVal) {
      const _self = this
      setTimeout(function(){ _self.viewerAnnos.viewport.goHome() }, 50);
    },
    'relatedAnnotations':function (newVal, oldVal) {
      if (Object.keys(this.annotoriousplugin).length > 0){
        this.annotoriousplugin.clearAnnotations();
      }
      this.initNewAnnotatedImage(true)
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
      this.updateSelectedAnnos()
    },
    'dontShowTree': function(newVal, oldVal) {
      if (Object.keys(this.annotoriousplugin).length > 0){
        let _self = this
        setTimeout(function(){ _self.viewerAnnos.viewport.goHome() }, 50);
      }
    },
    'annos': function(newVal, oldVal) {
      this.initNewAnnotatedImage(false)
    },
  },
  mounted:function () {
    if (this.item.depictionID){
    }
    this.initNewAnnotatedImage(true)
    if (this.treeShowOption){
      this.dontShowTree = true
    }
    if (this.hideTree){
      this.dontShowTree = true
    } else {
      this.dontShowTree = false
    }
  },
  beforeDestroy:function () {
  },
  created:function(){
  }
}
</script>

<style lang="css" >
.theme--light.v-tabs > .v-tabs-bar {
  background-color: rgba(255, 255, 255, 0.0) !important;
}
</style>
