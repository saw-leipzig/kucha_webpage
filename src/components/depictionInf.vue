<template>
    <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
      <v-card-title ><a :href="getDeptictionURL()" style="flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;">{{getDepictionLabel()}}</a> </v-card-title>
      <v-card-actions v-if="pr.relatedAnnotationList.length>0">
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
      <v-expand-transition v-if="pr.relatedAnnotationList.length>0">
        <annotatedImage :highlightedAnnotations="annotations" style="min-height: 60vh;" treeShowOption v-show="showAnno" v-if="depiction.relatedAnnotationList.length>0" :item="pr"  :annos="annos" :relatedAnnotations="pr.relatedAnnotationList" :isVersion="version"/>
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
                Basic Information for Painted Representation {{pr.depictionID}}
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
                  <v-tabs-items class="mx-5" v-model="tab">
                    <v-tab-item
                      v-for="(item_value, item_name, item_key) in depictionInfo"
                      :key="item_key"
                    >
                      <div v-if="item_name=='dating'">
                        <foruminf heading="Related Dating Discussions" :newPosts="false" @getComments="getComments()" :discussions="discussions"></foruminf>
                      </div>
                      <v-list-item two-line v-for="(value, name, index) in item_value" :key=index>
                        <v-list-item-content>
                          <v-list-item-title >{{name}}</v-list-item-title>
                          <div v-if="(name !== 'Wall Location' && name !== 'dating')" style="white-space: pre-line;padding:0px 0px 0px 10px;">{{value}}</div>
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
      <v-card-actions v-if="pr.cave && presentCave">
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

      <v-expand-transition v-if="pr.cave && presentCave">
        <div v-show="showCave">
          <v-divider></v-divider>
              <caveInf class="mx-10" :setWidth="false" :showRelatedDepictions="false" v-if=pr.cave :caveDefault="pr.cave"></caveInf>
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
              <v-alert
                class="mx-5"
                :value="isDrawing"
                color="grey"
                dense
                border="top"
                icon="mdi-alert"
                transition="scale-transition"
                dismissible
              >
                Drawing not to scale; the proportions of the original may not be reproduced accurately.
              </v-alert>

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
      <hideRelatedItems v-if="pr.relatedBibliographyList.length>0" title="Related Annotated Bibliography" :items="pr.relatedBibliographyList"></hideRelatedItems>
      <v-card-actions v-if="versions.length>1">
        <v-btn @click="showVersions = !showVersions"
          color="orange lighten-2"
          text
        >
          Versions
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="showVersions = !showVersions"
        >
          <v-icon>{{ showVersions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition v-if="versions.length>1">
        <div v-show="showVersions">
          <v-divider></v-divider>
           <v-card class="d-flex pa-2 mx-10" style='background-color: rgba(255, 255, 255, 1) !important'>
            <v-combobox
            style="width:50%"
              class="d-flex justify-center align-center "
              v-model="version"
              :items="versions"
              label="Select Version"
              outlined
              dense
              item-text = "date"
              item-value="_id"
            ></v-combobox>
           </v-card>
        </div>
      </v-expand-transition>

    </v-card>
</template>

<script>
import image from '@/views/image'
import caveInf from '@/components/caveInf'
import {checkImgPermitted, setOSDImgOverlayImg, getOSDURL, getCaveLabel, getWallTreeByIDs, getDepictionLabel} from  "@/utils/helpers"
import {getVersionsOfEntry, getVersionOfEntry, getWallTreeByTimestamp, getCommentsByItems} from '@/services/repository'
import OpenSeadragon from 'openseadragon'
import annotatedImage from '@/components/annotatedImage'
import Foruminf from '../components/foruminf.vue'

export default {

  name: 'depictionInf',
  components: {
    caveInf,
    image,
    annotatedImage,
    Foruminf
  },
  props: {
    depiction: {},
    presentCave:true,
    annotations:[]
  },

  data () {
    return {
      pr:{},
      isDrawing:false,
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
      isAllowedPic:true,
      version:null,
      versions:['current'],
      showVersions: false,
      walllTree: [],
      walls:[],
      discussions: [],
    }
  },
  computed:{
    depictionInfo(){
      var depictionInf = {}
      var mainInf = {}
      if (this.pr.shortName){
        mainInf['Short Name'] = this.pr.shortName
      }
      if (this.pr.expedition){
        mainInf['Acquired by expredition'] = this.pr.expedition.name
      }
      if (this.pr.vendor){
        mainInf['Vendor'] = this.pr.vendor.vendorName
      }
      if (this.pr.purchaseDate){
        mainInf['Date purchased'] = this.pr.purchaseDate
      }
      if (this.pr.location){
        mainInf['Current Location'] = this.pr.location.name
      }
      if (this.pr.inventoryNumber){
        mainInf['Inventory Number'] = this.pr.inventoryNumber
      }
      if (Object.keys(mainInf).length > 0){
        depictionInf['Main'] = mainInf
      }
      var wallLocation = {}
      console.log("wallIDs", this.pr.wallIDs);
      if (this.pr.wallIDs){
        wallLocation["Wall Location"] = this.walls
      }
      if (this.pr.positionNotes){
        wallLocation["Position Notes"] = this.pr.positionNotes
      }
      if (Object.keys(wallLocation).length > 0){
        depictionInf["Wall"] = wallLocation
      }
      var depictionDes = {}
      if (this.pr.width){
        depictionDes["Width"] = this.pr.width
      }
      if (this.pr.height){
        depictionDes["Height"] = this.pr.height
      }
      if (this.pr.style){
        depictionDes["Style"] = this.pr.style.styleName
      }
      if (this.pr.modeOfRepresentation){
        depictionDes["Mode of Representation"] = this.pr.modeOfRepresentation.name
      }
      if (this.pr.backgroundColour){
        depictionDes["Background Colour"] = this.pr.backgroundColour
      }
      if (this.pr.inscriptions){
        depictionDes["Inscriptions"] = this.pr.inscriptions
      }
      if (this.pr.separateAksaras){
        depictionDes["Separate Akṣaras"] = this.pr.separateAksaras
      }
      if (this.pr.dating){
        depictionDes["Dating"] = this.pr.dating
      }
      if (this.pr.description){
        depictionDes["Description"] = this.pr.description
      }
      if (this.pr.generalRemarks){
        depictionDes["General Remarks"] = this.pr.generalRemarks
      }
      if (this.pr.otherSuggestedIdentifications){
        depictionDes["Other Suggested Identifications"] = this.pr.otherSuggestedIdentifications
      }
      if (Object.keys(depictionDes).length > 0){
        depictionInf["Description"] = depictionDes
      }
      if (this.discussions.length > 0){
        depictionInf['dating'] = ''
      }
      return depictionInf
    }
  },
  methods: {
    getComments(){
      getCommentsByItems(this.pr.cave ? [this.pr.cave.caveID] : [], [this.pr.depictionID], [], [])
        .then( res => {
          console.log("recieved discussions.", res.data.hits.hits)
          this.discussions = res.data.hits.hits
        }).catch(function (error) {
          console.log(error)
          return null
        })
    },
    initWalls(){
      if (this.version.date.toString().includes('current')){
        this.walls = getWallTreeByIDs(this.pr.wallIDs, this.$store.state.wallLocation)
      } else {
        this.walls = getWallTreeByIDs(this.pr.wallIDs, this.wallTree)
      }

    },
    checkImgPermitted(image){
      if (image){
        return checkImgPermitted(image)
      } else {
        return false
      }
    },
    getDeptictionURL(){
      if (this.pr){
        if (Object.keys(this.pr).length > 0){
          return "/pr/" + this.pr.depictionID
        }
      }
      return "/pr/"
    },

    getDepictionLabel(){
      if (this.pr){
        if (Object.keys(this.pr).length > 0){
          return getDepictionLabel(this.pr)
        }
      }
      return ""

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
        this.setOSDImgOverlayImg()
        this.viewerImg.addControl(infoButtonImg.element, { anchor: OpenSeadragon.ControlAnchor.TOP_LEFT });
      }
    },
    initNewDepiction(){
      if (this.pr){
        this.pr = this.depiction
        console.log("started Depiction");
        console.log("Depiction: ", this.pr);
        getVersionsOfEntry(this.pr)
          .then( res => {
            console.log("recieved versions.", res)
            this.versions = res.data.hits.hits
            for (let v of this.versions){
              v.date = new Date(v._source.timestamp)
            }
            this.versions[this.versions.length - 1].date = this.versions[this.versions.length - 1].date + " - (current)"
            this.version = this.versions[this.versions.length - 1]
          }).catch(function (error) {
            console.log(error)
            return null
          })
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
          if (this.image.imageTypeID === 5){
            this.isDrawing = true
          } else {
            this.isDrawing = false
          }
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
        return "of cave " + getCaveLabel(entry)
      } else {
        return "";
      }
    },
    setOSDImgOverlayImg(){
      setOSDImgOverlayImg(this.image, this.viewerImg)
    },
    setOSDimages(image){
      this.image = image
      if (this.image.imageTypeID === 5){
        this.isDrawing = true
      } else {
        this.isDrawing = false
      }
      this.viewerImg.open(getOSDURL(image))
      this.setOSDImgOverlayImg()
    },
    fillPicsContainer(){
      this.annos = []
      this.images = []
      for (var img of this.pr.relatedImages){
        if (this.pr.relatedAnnotationList.find(element => element.image === img.filename)) {
          this.annos.push(img)
          this.images.push(img)
        } else {
          this.images.push(img)
        }
      }
      this.annos.sort(function(a, b){return b.accessLevel - a.accessLevel})
    },
  },
  watch: {
    depiction(newVal, oldVal){
      console.log("pr changed");
      this.initNewDepiction()
    },
    version(newVal, oldVal){
      if (newVal != null){
        getVersionOfEntry(newVal._id)
          .then( res => {
            this.pr = res.data._source.content
          }).catch(function (error) {
            console.log(error)
            return null
          })
      }
      if (newVal.date.toString().includes('current')){
        this.wallTree = this.$store.state.wallLocation
        console.log("this.wallTree", this.wallTree);
        this.initWalls()
      } else {
        getWallTreeByTimestamp(this.version._source.timestamp)
          .then( res => {
            console.log("recieved versions of wall.", res.data.hits.hits[0]._source.content.wallTree)
            this.wallTree = res.data.hits.hits[0]._source.content.wallTree
            this.initWalls()
          }).catch(function (error) {
            console.log(error)
            return null
          })
      }

    }
  },
  mounted:function () {
    this.initNewDepiction()
    this.getComments()
  },
  beforeMount:function(){
    this.pr = this.depiction
    if (this.$store.state.wallLocation.length === 0){
      this.$store.dispatch('getWallLocation')
    } else {
      this.walllocation = this.$store.state.wallLocation
    }
  }
}
</script>
<style lang="css" scoped>
.v-treeview {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 100% !important;
}
</style>
