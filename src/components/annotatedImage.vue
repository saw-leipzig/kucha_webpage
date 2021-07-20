<template>
  <div style='height:100%'>
    <v-tabs
      v-if="annos.length>1"
      v-model="annoImg"
      centered
      slider-color="yellow"
      return-object
      style="rgba(255, 255, 255, 0.2) !important;"
    >
      <v-tab
        v-for="(item, index) in annos"
        :id="item.imageID"
        :key="index"
        @click="setOSDannos(item)"
        style="rgba(255, 255, 255, 0.2) !important;"
      >
            <v-img v-if="checkAnnoPermitted(item)"
                :src="getThumbnail(item)"
              ></v-img>
            <v-icon x-large v-if="!checkAnnoPermitted(item)">mdi-lock</v-icon>
      </v-tab>
    </v-tabs>
    <v-row justify="center" class="mx-5" style='height:550px'>
      <v-col :cols=colsAnnoImg  >
        <v-card :style=" checkAnnoPermitted(annoImage) ? 'height:525px;background-color: rgba(255, 255, 255, 1) !important;' : 'display: none;height:525px;background-color: rgba(255, 255, 255, 1) !important;'">
          <div :id="'openseadragonAnno' + itemId"  style='height:500px'>
          <v-row class="mt-0" :attach="'#openseadragonAnno' + itemId" style='position: relative;z-index: 4'>
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
      <v-col :cols=colsAnnoTree  :ref="'cardAnno' + itemId">
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
</template>
<script>
import {getOSDURL, checkAnnoPermitted} from  "@/utils/helpers"
import * as d3 from "d3";
import OpenSeadragon from 'openseadragon'
import Annotorious from '../../static/openseadragon-annotorious.min.js'

export default {
  name: 'annotatedImage',
  components: {
  },
  props: {
    item: {},
    annos: {
      type: Array
    },
    relatedAnnotations: null,
  },
  data () {
    return {
      showTag:true,
      viewerAnnos: null,
      w3cAnnos: [],
      annotoriousplugin: {},
      icoAnnos: [],
      annoImage:{},
      actControl:"Enable Controlls",
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
    }
  },
  computed: {
    yTag(){
      if (this.$refs['cardAnno' + this.itemId]){
        console.log("hoveredAnno triggered", this.$refs['cardAnno' + this.itemId].getBoundingClientRect());
        return this.$refs['cardAnno' + this.itemId].getBoundingClientRect().y - 10
      } else return 0

    },
    xTag(){
      if (this.$refs['cardAnno' + this.itemId]){
        console.log("hoveredAnno triggered", this.$refs['cardAnno' + this.itemId]);
        return this.$refs['cardAnno' + this.itemId].getBoundingClientRect().x
      } else return 0

    },
    itemId(){
      let res = "test"
      if (this.item.iconographyID){
        res = "iconography" + this.item.iconographyID.toString()
        console.log("IcoID", res);
      } else if (this.item.depictionID){
        res = "depiction" + this.item.depictionID.toString()
        console.log("depictionID", res);
      }
      return res
    },

  },
  methods: {
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
        this.actControl = "Disable Controlls"
      } else {
        this.actControl = "Enable Controlls"
      }
      this.viewerAnnos.setControlsEnabled(!this.viewerAnnos.areControlsEnabled())
      this.viewerAnnos.setMouseNavEnabled(!this.viewerAnnos.isMouseNavEnabled())
    },
    mouseOverNode(item){
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
    },
    mouseLeaveNode(item){
      this.updateSelectedAnnos()
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
    filter () {
      return  (item, search, textKey) => {
        return (item["search"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1 || item["name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1)
      }
    },
    hoveredTags(hoveredAnno){
      console.log("hoveredTags", hoveredAnno);
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
    checkAnnoPermitted(item){
      return checkAnnoPermitted(item)
    },
    initOSDanno(){
      let tilesAnnos = []
      if (this.annos.length > 0){
        tilesAnnos = getOSDURL(this.annos[0])
        this.annoImage = this.annos[0]
        this.viewerAnnos = OpenSeadragon({
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
      console.log("getAnnoByIco for: ", item);
      var annosFound = [];
      for ( var anno of this.relatedAnnotations){
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
    addAnnotation(w3cAnno){
      console.log("addAnnotation:", w3cAnno);
      if (w3cAnno.target){
        if (w3cAnno.target.id === this.annoImage.filename){
          console.log("started add annotation");
          // this.annotoriousplugin.addAnnotation(w3cAnno)
          this.annotoriousplugin.highlightAnnotation(w3cAnno.id)
        }
      }
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
    getIconographyByAnnos(ids){
      console.log("ids:", ids);
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
    setOSDannos(image){
      this.annoImage = image
      this.viewerAnnos.open(getOSDURL(image))
      if (image.filename === "accessNotPermitted.png"){
        this.disableTree();
        console.log("tree disabled:", this.icoAnnos);
      } else {
        this.enableTree();
      }
      this.updateSelectedAnnos()
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
      console.log("started AnnotatedImage");
      console.log("Annotations: ", this.relatedAnnotations);
      console.log("Images:", this.relatedImages);
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
      console.log("Images", this.images);
      console.log('Annos', this.relatedAnnotations);
      if (!this.viewerAnnos){
        this.initOSDanno()
      }
      var allAnnotationEntries = []
      this.w3cAnnos = []
      var geoGenerator = d3.geoPath()
      console.log("relatedAnnotations", this.relatedAnnotations);
      for (var ae of this.relatedAnnotations) {
        console.log("hier: ae", ae);
        var bodies = []
        for (var ie of ae.tags) {
          console.log("hier: ie", ie);
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
            console.log("Body:", body, " for: ", ie);
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
        console.log("w3cAnno", anno);
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
      console.log("allAnnotationEntries", allAnnotationEntries);
      this.icoAnnos = this.getIconographyByAnnos(allAnnotationEntries)
      console.log("icoAnnos:", this.icoAnnos);
      if (this.annos.length > 0){
        this.setOSDannos(this.annos[0])
      }
    },
    choosPicForAnno(icoAnno){
      let anno = this.getAnnoByIcoID(icoAnno)
      let i = 0
      for (let ae of this.annos){
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
    },
    'annoActivated': function(newVal, oldVal) {
      console.log("annoAvtivated changed:", newVal);
    },

  },
  mounted:function () {
    console.log("initNewAnnotatedImage");
    this.initNewAnnotatedImage()
  },
  beforeUpdate:function () {
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
