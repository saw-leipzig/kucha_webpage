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
      <v-col order="2"  :cols="dontShowTree ? 12 : colsAnnoImg"  :style="'flex:1;'">
        <v-tooltip v-if="showTag" :position-y="yTag" :position-x="xTag" right v-model="showTag" >
          <span >{{hoveredTags(hoveredAnno)}}</span>
        </v-tooltip>
        <v-card height="100%" :style="getAccessLevel(annoImage) === 2 ? 'flex-direction: column;background-color: rgba(255, 255, 255, 1) !important;display:flex' : 'display: none;background-color: rgba(255, 255, 255, 1) !important;'">
          <div class="mt-5" ref="osdDiv"  :id="'openseadragonAnno' + itemId"  style='margin:0;padding:0;height:100%;'>
          <v-row height="100%" class="mt-0" :attach="'#openseadragonAnno' + itemId" style='position: relative;z-index: 4'>
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
                    outlined
                  >
                  </v-col>
                  <v-col
                  v-if="isFullScreen"
                    outlined
                  >
                    <v-btn
                    :attach="'#openseadragonAnno' + itemId"
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
        <v-card :style=" getAccessLevel(annoImage) < 2 ? 'overflow-y: scroll;background-color: rgba(255, 255, 255, 1) !important;' : 'display: none;height:525px;background-color: rgba(255, 255, 255, 1) !important;'">
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
      <v-col style="display: flex;
              flex-direction: column;"
              v-if="!dontShowTree"
              :order="left ? 1 : 3" :cols=colsAnnoTree  :ref="'cardAnno' + itemId">
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
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'annotatedImage',
  components: {
  },
  props: {
    item: {},
    annos: {
      type: Array
    },
    left: {
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
    height: {
      type: String,
      default: function () {
        return "550"
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
      if (this.getAccessLevel(this.annoImage) > 1){
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
        // console.log("UpdateSelectedAnnos triggered");
        // this.annotoriousplugin.setAnnotations([])
        for (let anno of this.w3cAnnos){
          if (!this.dontShowTree){
            this.annotoriousplugin.hideAnnotation(anno.id)
          } else {
            if (anno) {
              if (this.annoImage.filename !== anno.body.image){
                this.annotoriousplugin.hideAnnotation(anno.id)
              }
            }
          }
        }
        // console.log("annoSelected", this.annoSelected);
        for (var icoAnno of this.annoSelected) {
          // console.log("found Annotated Iconography: ", icoAnno);
          for (var anno of this.getAnnoByIcoID(icoAnno)) {
            // console.log("Found related Anno:", anno);
            var dummy = this.w3cAnnos.find(element => element.id === anno.annotoriousID)
            // console.log("found relatred w3cAnno:", dummy);
            if (!Array.isArray(dummy)){
              this.addAnnotation(dummy)
            } else {
              for (var w3c of dummy){
                this.addAnnotation(w3c)
              }
            }
          }
        }
        // console.log("hoveredAnno:", this.hoveredAnno);
        if (this.hoveredAnno !== null && this.getAccessLevel(this.annoImage) === 2){
          // console.log("found hovered Anno", this.hoveredAnno);
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
          _self.updateSelectedAnnos()
        });

        this.annotoriousplugin.on('mouseLeaveAnnotation', function(annotation, evt) {
          _self.annoActivated = []
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
        this.viewerAnnos.addHandler("full-page", function (data) {
          // console.log("fullscreen trigggered");
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
          // console.log("fullscreen trigggered");
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
    addAnnotation(w3cAnno){
      // console.log("addAnnotation:", w3cAnno);
      if (w3cAnno.target){
        if (w3cAnno.target.id === this.annoImage.filename){
          // console.log("started add annotation");
          // this.annotoriousplugin.addAnnotation(w3cAnno)
          this.annotoriousplugin.highlightAnnotation(w3cAnno.id)
        }
      }
    },
    setOSDannos(image){
      if (this.getAccessLevel(this.annoImage) < 2){
        this.disableTree();
        // console.log("tree disabled:", this.icoAnnos);
      } else {
        this.enableTree();
        this.annoImage = image
        this.viewerAnnos.open(getOSDURL(image))
        this.updateSelectedAnnos()
      }
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
    initNewAnnotatedImage(){
      if (this.annos.length > 0){
        // console.log("started AnnotatedImage for item: " + this.itemId);
        // console.log("Annotations: ", this.relatedAnnotations);
        // console.log("Images:", this.relatedImages);
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
        // console.log("Images", this.images);
        // console.log('Annos', this.annos);
        if (this.viewerAnnos === null){
          this.initOSDanno()
          // console.log("viewerAnnos is", this.viewerAnnos);
        }
        var allAnnotationEntries = []
        this.w3cAnnos = []
        var geoGenerator = d3.geoPath()
        // console.log("relatedAnnotations", this.relatedAnnotations);
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
              // console.log("Body:", body, " for: ", ie);
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
        if (Object.keys(this.annotoriousplugin).length > 0){
          for (let anno of this.w3cAnnos){
            // console.log(anno);
            if (this.annoImage.filename !== anno.body.image){
              this.annotoriousplugin.addAnnotation(anno)
            }
          }
          if (!this.dontShowTree){
            for (let anno of this.w3cAnnos){
              this.annotoriousplugin.hideAnnotation(anno.id)
            }
          }
          // console.log("all Annotations:", this.annotoriousplugin.getAnnotations());
        }
        // console.log("allAnnotationEntries", allAnnotationEntries);
        this.icoAnnos = getIconographyByAnnos(allAnnotationEntries)
        // console.log("icoAnnos:", this.icoAnnos);
        // console.log("preselected", this.preSelected);
        this.annoSelected = this.preSelected
        if (this.getAccessLevel(this.annoImage) > -1){
          this.setOSDannos(this.annos[0])
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
        // let xMax = 0
        // let xMin = 0
        // let yMax = 0
        // let yMin = 0
        for (const anno of _self.annotoriousplugin.getAnnotations()){
          // console.log("comparying for ", this.getItemID(), " anno: ", anno.target.id, this.annoImage.filename);
          if (this.annoImage.filename === anno.target.id) {
            annos.push(anno)
            // console.log("anno for Fokus in item: ", this.getItemID(), anno.target.id);
            // var commands = anno.target.selector.value.slice(14, anno.target.selector.value.length - 15).split(/(?=[LMCZ])/);
            // var pointArrays = commands.map(function(d){
            //   var pointsArray = d.slice(1, d.length).split(',');
            //   var pairsArray = [];
            //   for (var i = 0; i < pointsArray.length; i += 2){
            //     pairsArray.push([+pointsArray[i], +pointsArray[i + 1]]);
            //   }
            //   if (xMax === 0){
            //     xMax = pairsArray[0][0]
            //   } else if (xMax < pairsArray[0][0]){
            //     xMax = pairsArray[0][0]
            //   }
            //   if (xMin === 0){
            //     xMin = pairsArray[0][0]
            //   } else if (xMin > pairsArray[0][0]){
            //     xMin = pairsArray[0][0]
            //   }
            //   if (yMax === 0){
            //     yMax = pairsArray[0][1]
            //   } else if (yMax < pairsArray[0][1]){
            //     yMax = pairsArray[0][1]
            //   }
            //   if (yMin === 0){
            //     yMin = pairsArray[0][1]
            //   } else if (yMin > pairsArray[0][1]){
            //     yMin = pairsArray[0][1]
            //   }
            //   return pairsArray;
            // });
            // const rect = this.viewerAnnos.viewport.imageToViewportRectangle(xMin, yMin, xMax - xMin, yMax - yMin);
            // this.viewerAnnos.viewport.fitBounds(rect, false);
            // console.log("annos for Fokus are:", pointArrays);
            // console.log("annos for Window is for Fokus are:", rect, xMin, xMin, yMax, yMin);
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
      // console.log("annoSelected Changed");
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
      // console.log("related Annotations changed for:", this.item.depictionID, newVal, this.annotoriousplugin);
      if (Object.keys(this.annotoriousplugin).length > 0){
        this.annotoriousplugin.clearAnnotations();
      }
      this.initNewAnnotatedImage()
    },
    'hideTree':function (newVal, oldVal) {
      if (newVal){
        this.dontShowTree = true
      } else {
        this.dontShowTree = false
      }

    },
    'item': function (newVal, oldVal) {
      // console.log("changed item:", this.item, this.annos, this.ann);
    },
    'annoActivated': function(newVal, oldVal) {
      // console.log("annoAvtivated changed:", newVal);
      this.updateSelectedAnnos()
    },
    'dontShowTree': function(newVal, oldVal) {
      if (this.annotoriousplugin){
        let _self = this
        setTimeout(function(){ _self.viewerAnnos.viewport.goHome() }, 50);
      }
    },
    'annos': function(newVal, oldVal) {
      // console.log("annos changed:", newVal);
      this.initNewAnnotatedImage()
    },

  },
  mounted:function () {
    if (this.item.depictionID){
      // console.log("initNewAnnotatedImage", this.item.depictionID, this.relatedAnnotations);
    }
    this.initNewAnnotatedImage()
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
