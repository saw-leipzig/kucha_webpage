<template>

    <div>

      <v-card-title>{{getDepictionLabel()}} </v-card-title>
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
              <v-img
                :src="getThumbnail(item)"
              ></v-img>
            </v-tab>
          </v-tabs>
          <v-container style='height:550'>
            <v-card style='height:550px'>
              <div id="openseadragonAnno" style='height:500px'>
                <v-row attach="#openseadragonAnno" style='position: relative;z-index: 4'>
                  <v-bottom-sheet
                    v-model="sheet"
                    inset
                    hide-overlay
                    attach="#openseadragonAnno"
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
                          outlined
                        >
                          <v-btn
                          attach="#openseadragonAnno"
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
                        attach="#openseadragonAnno"
                        class="text-center"
                        height="340px"
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
                        <v-treeview selection-type="leaf" :filter="filter" :search="search" return-object v-model="annoSelected" rounded  selectable hoverable open-all :items="this.icoAnnos" dense >
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
          </v-container>
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

          <v-card-text>
            <v-container>
              <v-card>
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
            </v-container>
          </v-card-text>
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
            <v-container>
              <caveInf v-if=depiction.cave :cave="depiction.cave"></caveInf>
            </v-container>
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
                    <v-img
                        :src="getThumbnail(item)"
                      ></v-img>
              </v-tab>
            </v-tabs>
            <v-container style='height:550'>
              <v-card style='height:550px'>

                <div id="openseadragonImg" style='height:500px'></div>
              </v-card>
            </v-container>
            </div>
      </v-expand-transition>
      <hideRelatedItems v-if="depiction.relatedBibliographyList.length>0" title="Related Annotated Bibliography" :items="depiction.relatedBibliographyList"></hideRelatedItems>
</div>
</template>

<script>
import image from '@/views/image'
import caveInf from '@/components/caveInf'
import {getCaveLabel, getWallTreeByIDs, getDepictionLabel} from  "@/utils/helpers"
import * as d3 from "d3";
import OpenSeadragon from '../../static/openseadragon/openseadragon.min.js'
import Annotorious from '../../static/openseadragon/openseadragon-annotorious.min.js'

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
    console.log("depiction", this.depiction);
    return {
      tab:[],
      search: null,
      showDescription: false,
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
      annoSelectedWithParents:[],
      selectType:"leaf",
      idName:"iconographyID",
      dialog:false,
      sheet:false,
      actControl:"Enable Controll",
    }
  },
  computed:{
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
    getDepictionLabel(){
      return getDepictionLabel(this.depiction, this.$store.state.dic.wallLocation);
    },
    initOSDimg(){
      let tilesImg = []
      console.log("Initializing Images: ", this.images);
      if (this.images.length > 0){
        console.log("images available, initiate OSDIMG");
        tilesImg = this.getOSDURL(this.images[0])
        this.image = this.images[0]
        this.viewerImg = OpenSeadragon({
          id: "openseadragonImg",
          prefixUrl: '/static/',
          tileSources: tilesImg,
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
        tilesAnnos = this.getOSDURL(this.annos[0])
        this.annoImage = this.annos[0]
        this.viewerAnnos = OpenSeadragon({
          id: "openseadragonAnno",
          prefixUrl: '/static/',
          tileSources: tilesAnnos,
          showRotationControl: true,
          showFlipControl: true,
          maxZoomLevel: 100,
          minZoomLevel: 0.001,
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
        config["tagVocabulary"] = [];
        config["tree"] = [];
        config["image"] = this.viewerAnnos;
        this.annotoriousplugin = Annotorious(this.viewerAnnos, config)
        this.viewerAnnos.setControlsEnabled(false);
        this.viewerAnnos.setMouseNavEnabled(false);
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
    initNewDepiction(){
      if (this.depiction){
        console.log("started Depiction");
        console.log("Depiction: ", this.depiction);
        console.log("Annos:", this.annos);
        console.log("Images:", this.images);
        OpenSeadragon.setString('Tooltips.SelectionToggle', 'Selection Demo');
        OpenSeadragon.setString('Tooltips.SelectionConfirm', 'Ok');
        OpenSeadragon.setString('Tooltips.ImageTools', 'Image tools');
        OpenSeadragon.setString('Tool.brightness', 'Brightness');
        OpenSeadragon.setString('Tool.contrast', 'Contrast');
        OpenSeadragon.setString('Tool.thresholding', 'Thresholding');
        OpenSeadragon.setString('Tool.invert', 'Invert');
        OpenSeadragon.setString('Tool.gamma', 'Gamma');
        OpenSeadragon.setString('Tool.greyscale', 'Greyscale');
        OpenSeadragon.setString('Tool.reset', 'Reset');
        OpenSeadragon.setString('Tooltips.HorizontalGuide', 'Add Horizontal Guide');
        OpenSeadragon.setString('Tooltips.VerticalGuide', 'Add Vertical Guide');
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
        if (this.images.length > 0){
          this.setOSDimages(this.images[0])
        }
        if (this.annos.length > 0){
          this.setOSDannos(this.annos[0])
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
        this.icoAnnos = this.getIconographyByAnnos(allAnnotationEntries)
        console.log("icoAnnos:", this.icoAnnos);
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
      return "http://127.0.0.1:8182/iiif/2/kucha%2Fimages%2F" + image.filename + "/full/!80,80/0/default.jpg"
    },
    getOSDURLs(images){
      let tiles = []
      for (let ie of images) {
        tiles.push("http://127.0.0.1:8182/iiif/2/kucha%2Fimages%2F" + ie.filename + "/info.json")
      }
      return tiles
    },
    getOSDURL(image){
      let tiles = []
      tiles.push("http://127.0.0.1:8182/iiif/2/kucha%2Fimages%2F" + image.filename + "/info.json")
      return tiles
    },
    mouseOver: function(){
      this.showDescription = !this.showDescription
    },
    getCaveLabel(entry){
      if (entry !== undefined){
        return "of cave " + getCaveLabel(entry)
      } else {
        return "";
      }
    },
    setOSDImgOverlayImg(){
      var elm = document.createElement("dl");
      elm.id = "html-overlay"
      var titleHd = document.createElement("dt");
      titleHd.innerHTML = "Title:"
      var title = document.createElement("dd");
      title.innerHTML = this.image.title
      var copyrightHd = document.createElement("dt");
      copyrightHd.innerHTML = "Copyright:"
      var copyright = document.createElement("dd");
      copyright.innerHTML = this.image.copyright
      elm.appendChild(titleHd)
      elm.appendChild(title)
      elm.appendChild(copyrightHd)
      elm.appendChild(copyright)
      if (this.viewerImg.getOverlayById("html-overlay") === null) {
        var textPoint = new OpenSeadragon.Point(1.01, 0);
        this.viewerImg.addOverlay(elm, textPoint)
      } else {
        this.viewerImg.clearOverlays()
      }
    },
    setOSDImgOverlayAnno(){
      var elmAnno = document.createElement("dl");
      elmAnno.id = "html-overlay-anno"
      var titleHd = document.createElement("dt");
      titleHd.innerHTML = "Title:"
      var title = document.createElement("dd");
      title.innerHTML = this.annoImage.title
      var copyrightHd = document.createElement("dt");
      copyrightHd.innerHTML = "Copyright:"
      var copyright = document.createElement("dd");
      copyright.innerHTML = this.annoImage.copyright
      elmAnno.appendChild(titleHd)
      elmAnno.appendChild(title)
      elmAnno.appendChild(copyrightHd)
      elmAnno.appendChild(copyright)

      if (this.viewerAnnos.getOverlayById("html-overlay-anno") === null){
        var textPoint = new OpenSeadragon.Point(1.01, 0);
        this.viewerAnnos.addOverlay(elmAnno, textPoint)
      } else {
        this.viewerAnnos.clearOverlays()
      }
    },
    setOSDimages(image){
      this.image = image
      console.log("change to ", this.getOSDURL(image));
      this.viewerImg.open(this.getOSDURL(image))
    },
    setOSDannos(image){
      this.annoImage = image
      console.log("change to ", this.getOSDURL(image));
      this.viewerAnnos.open(this.getOSDURL(image))
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
      var annosFound = [];
      for ( var anno of this.depiction.relatedAnnotationList){
        for ( var ie of anno.tags){
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
      if (w3cAnno.target.id === this.annoImage.filename){
        console.log("started add annotation");
        this.annotoriousplugin.addAnnotation(w3cAnno)
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
      this.annotoriousplugin.setAnnotations([])
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
      console.log("updated Selected Annos", newVal);
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
  created:function(){
    this.fillPicsContainer();
  }

}
</script>
<style lang="css" scoped>
</style>
