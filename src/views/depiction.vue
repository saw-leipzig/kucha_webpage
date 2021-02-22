<template>

    <v-card fluid=true v-if="result">
      <v-card-title>Painted Representation {{result.depictionID}}  {{getCaveLabel(result.cave)}} </v-card-title>
      <v-card-actions >
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

      <v-expand-transition>
        <div v-show="showDescription">
          <v-divider></v-divider>

          <v-card-text>
            <depictionInf :depiction="result"></depictionInf>
          </v-card-text>
        </div>
      </v-expand-transition>
      <v-card-actions v-if=result.cave>
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

      <v-expand-transition>
        <div v-show="showCave">
          <v-divider></v-divider>
            <v-container>
              <caveInf v-if=result.cave :cave="result.cave"></caveInf>
            </v-container>
        </div>
      </v-expand-transition>
      <v-card-actions v-if="this.annos.length>0">
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

      <v-expand-transition>
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
                <v-row attach="#openseadragonAnno" style='z-index: 999999;position: relative;'>
                  <v-bottom-sheet
                    v-model="sheet"
                    inset
                    hide-overlay
                    attach="#openseadragonAnno"
                    style='zIndex:99999'
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
                            v-on="on"
                          >
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
                      height="200px"
                    >                     
                  <v-lazy
                    transition="scroll-x-reverse-transition"
                  >
                  <v-treeview selection-type="leaf" return-object v-model="annoSelected" rounded  selectable hoverable open-all :items="this.icoAnnos" dense >
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
      <v-card-actions>
        <v-btn
          @click="showImage = !showImage"
          color="orange lighten-2"
          text
        >
          Additional Images
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
            <v-tabs
            v-if="images.length"
              slider-color="yellow"
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
</v-card>
</template>

<script>
import image from '@/views/image'
import { getItemById } from '@/services/repository'
import caveInf from '@/components/caveInf'
import depictionInf from '@/components/depictionInf'
import {getCaveLabel} from  "@/utils/helpers"
import * as d3 from "d3";
export default {

  name: 'depiction',
  components: {
    caveInf,
    image,
    depictionInf
   },

  data () {
    return {
          showDescription: false,
          annoImage:{},
          image:{},
          annotoriousplugin: {},
          showCave: false,
          showImage: false,
          showAnno:false,
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
          actControl:"Enable Controll"
  }
  },
  computed: {
    result () {

      var res = this.$store.state.results.find(item => item._source.depictionID===parseInt(this.$route.params.id))
      if (res===undefined){
        var params={}
        params['type']="depictionID"
        params['id']=this.$route.params.id
        getItemById(params)
        .then( res => {
          this.$store.commit('setResults',res.data.hits.hits)
        }).catch(function (error) {
          console.log(error)
      })
      return null
      }
      else{
        return res._source
      }
    },
    iconography () {

      return this.$store.state.dic-iconography
    }
  },
  methods: {
      initOSDimg(){
      let tilesImg = []
      console.log("Initializing Images: ",this.images);
      if (this.images.length>0){
        console.log("images available, initiate OSDIMG");
        tilesImg = this.getOSDURL(this.images[0])        
        this.image=this.images[0]
        this.viewerImg = OpenSeadragon({
        id: "openseadragonImg",
        prefixUrl: '/static/',
        tileSources: tilesImg,
        })
      }
    },
    initOSDanno(){
      let tilesAnnos=[]
      if (this.annos.length>0){
        tilesAnnos = this.getOSDURL(this.annos[0])
        this.annoImage=this.annos[0]
        this.viewerAnnos = OpenSeadragon({
          id: "openseadragonAnno",
          prefixUrl: '/static/',
          tileSources: tilesAnnos,
          showRotationControl: true,
          showFlipControl: true,
          maxZoomLevel: 100,
          minZoomLevel: 0.001,
          referenceStripScroll: 'vertical',
          homeFillsViewer: true,
          
        })
        var config = {};
        config["readOnly"]=true;
				config["tagVocabulary"]=[];
				config["tree"]=[];
        config["image"]=this.viewerAnnos;
        this.annotoriousplugin = OpenSeadragon.Annotorious(this.viewerAnnos, config)
//        this.viewerAnnos.imagefilters({menuId:"menuAnno",
//		    							 toolsLeft: 270
//		    							});
        this.viewerAnnos.setControlsEnabled(false);
        this.viewerAnnos.setMouseNavEnabled(false);
			  this.viewerAnnos.addHandler("pre-full-page", function (data) {
					data.preventDefaultAction=true;
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
					}
  					else {
      					var el = $doc.documentElement;
      					el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    				}
			  });
      }
    },
    initNewDepiction(){
      if (this.result){
        console.log("started Depiction");
        console.log("Depiction: ", this.result);
        this.annos=[]
        this.images=[]      
        for (var img of this.result.relatedImages){
          if(this.result.relatedAnnotationList.find(element => element.image === img.filename)){
            this.annos.push(img)
          }
          else{
            this.images.push(img)
          }
        }
        console.log("Annos:", this.annos);
        console.log("Images:", this.images);
        OpenSeadragon.setString('Tooltips.SelectionToggle','Selection Demo');
        OpenSeadragon.setString('Tooltips.SelectionConfirm','Ok');
        OpenSeadragon.setString('Tooltips.ImageTools','Image tools');
        OpenSeadragon.setString('Tool.brightness','Brightness');
        OpenSeadragon.setString('Tool.contrast','Contrast');
        OpenSeadragon.setString('Tool.thresholding','Thresholding');
        OpenSeadragon.setString('Tool.invert','Invert');
        OpenSeadragon.setString('Tool.gamma','Gamma');
        OpenSeadragon.setString('Tool.greyscale','Greyscale');
        OpenSeadragon.setString('Tool.reset','Reset');
        OpenSeadragon.setString('Tooltips.HorizontalGuide', 'Add Horizontal Guide');
        OpenSeadragon.setString('Tooltips.VerticalGuide', 'Add Vertical Guide');
        OpenSeadragon.setString('Tool.rotate', 'Rotate');
        OpenSeadragon.setString('Tool.close', 'Close');
        console.log("Images",this.images);
        console.log('Annos',this.result.relatedAnnotationList);
        if (!this.viewerImg){
          this.initOSDimg() 
        }
        if (!this.viewerAnnos){
          this.initOSDanno()
        }
        if (this.images.length>0){
          this.setOSDimages(this.images[0])
        }
        if (this.annos.length>0){
          this.setOSDannos(this.annos[0])
        }
        var allAnnotationEntries=[]
        this.w3cAnnos =[]
        var geoGenerator=d3.geoPath()

        for (var ae of this.result.relatedAnnotationList) {
          var bodies=[]
          for (var ie of ae.tags) {
            if (!allAnnotationEntries.includes(ie)) {
              allAnnotationEntries.push(ie.iconographyID);
              var body={};
              body["type"]="TextualBody";
              body["value"]=ie.text;
              body["id"]=ie.iconographyID;
              body["image"]=ae.image;
              bodies.push(body);
            }
          }
          var anno={};
          anno["@context"]="http://www.w3.org/ns/anno.jsonld";
          anno["id"]=ae.annotoriousID;
          anno["type"]="Annotation";
          anno["body"]=bodies;
          var target={};
          var selector={};
          selector["type"]="SvgSelector";
          selector["conformsTo"]="http://www.w3.org/TR/media-frags/";
          var root = JSON.parse(ae.polygon);
          selector["value"]="<svg><path d=\""+geoGenerator(root)+"\"></path></svg>";
              
          //selector["value"]="<svg><path d=\""+ae.polygon+"\"></path></svg>";
          target["selector"]=selector;
          target["id"]= ae.image,
          anno["target"]=target;
          this.w3cAnnos.push(anno);
        }
        console.log("w3cAnnos:", this.w3cAnnos);
        this.icoAnnos=this.getIconographyByAnnos(allAnnotationEntries)
        console.log("icoAnnos:",this.icoAnnos);

      }
    },
    getChildren(item){
      var result=[item]
      for (var child of item.children){
        result= result.concat(this.getChildren(child))
      }
      return result
    },
    test(item){
      console.log("clicked: ",item);
     console.log("annoSelected: ",this.annoSelected);
    },

    getThumbnail(image){
      return "http://127.0.0.1:8182/iiif/2/kucha%2Fimages%2F" + image.filename + "/full/!80,80/0/default.jpg"
    },
    getOSDURLs(images){
      let tiles= []
      for (let ie of images) {
			  tiles.push("http://127.0.0.1:8182/iiif/2/kucha%2Fimages%2F" + ie.filename + "/info.json")
		}
      return tiles
    },
    getOSDURL(image){
      let tiles= []
 			  tiles.push("http://127.0.0.1:8182/iiif/2/kucha%2Fimages%2F" + image.filename + "/info.json")
     return tiles
    },
    mouseOver: function(){
      this.showDescription = !this.showDescription
    },
    getCaveLabel(entry){
      //console.log(entry);
      if (entry !== undefined){
        return "of cave "+getCaveLabel(entry)
      }
      else{
        return "";
      }
    },
    setOSDimages(image){
      this.image=image
      console.log("change to ", this.getOSDURL(image));
      this.viewerImg.open(this.getOSDURL(image))
    },
    setOSDannos(image){
      this.annoImage=image
      console.log("change to ", this.getOSDURL(image));
      this.viewerAnnos.open(this.getOSDURL(image))
    },
    searchForAnnosByIcoID(id, annosFound){
      for ( var anno of this.result.relatedAnnotationList){
        for ( var ie of anno.tags){
          if (ie.iconographyID===id){
            annosFound.push(anno)
          }
        }
      }
      return annosFound
    },
    getAnnoByIcoID(item){
      var annosFound = [];
      for ( var anno of this.result.relatedAnnotationList){
        for ( var ie of anno.tags){
          if (ie.iconographyID===item.iconographyID){
            annosFound.push(anno)
          }
        }
      }
      if (item.children.length>0){
        for (var child of item.children){
          var result =[]
          result=this.getAnnoByIcoID(child)
          if (result.length>0){
            annosFound = annosFound.concat(result)
          }
        }
      }
      return annosFound

      
    },
    switchAnnoImageControl(){
      if (this.viewerAnnos.areControlsEnabled()){
        this.actControl="Disable Controlls"
      }
      else{
        this.actControl="Enable Controlls"
      }

      this.viewerAnnos.setControlsEnabled(!this.viewerAnnos.areControlsEnabled())
      this.viewerAnnos.setMouseNavEnabled(!this.viewerAnnos.isMouseNavEnabled())
    },
    getIconographyByAnnos(ids){
      var returnElement=[]
      for (var rootElement of this.$store.state.dic.iconography){
        var dummy =  Object.assign({}, rootElement)
        var result=this.searchTree(dummy, ids)
        if (result!=null){
          
          returnElement.push(result)
        } 
      }
      console.log("returnElement", returnElement );
      return returnElement
    },
    addAnnotation(w3cAnno){
      if (w3cAnno.target.id===this.annoImage.filename){
        this.annotoriousplugin.addAnnotation(w3cAnno)
        this.annotoriousplugin.highlightAnnotation(w3cAnno.id)
      }
    },
    removeAnnotation(w3cAnno){
      if (w3cAnno.target.id===this.annoImage.filename){
        this.annotoriousplugin.dehighlightAnnotation(w3cAnno.id)
        this.annotoriousplugin.removeAnnotation(w3cAnno)
      }
    },
    mouseOverNode(item){
      var foundAnnos=this.getAnnoByIcoID(item)
      var foundW3cAnnos = []
      for (var anno of foundAnnos){
        var dummy = this.w3cAnnos.find(element => element.id === anno.annotoriousID)
        if (!Array.isArray(dummy)){
          this.addAnnotation(dummy)
        }
        else{
          for (var w3c of dummy){
            this.addAnnotation(w3c)
          }
        }
      }
      //console.log("found Annos:",this.getAnnoByIcoID(item))
    },
    updateSelectedAnnos(){
      this.annotoriousplugin.setAnnotations([])
      for (var icoAnno of this.annoSelected){
        console.log("found Annotated Iconography: ", icoAnno);
        for (var anno of this.getAnnoByIcoID(icoAnno)){
          console.log("Found related Anno:",anno);
          var dummy = this.w3cAnnos.find(element => element.id === anno.annotoriousID)
          console.log("found relatred w3cAnno:",dummy);
          if (!Array.isArray(dummy)){
            this.addAnnotation(dummy)
          }
          else{
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
      var newChildren=[]  
      //console.log("ids:",ids, element.iconographyID, element.root, element.name, element.children);
      if (element.children != null){
          for(var child of element.children){
               var hasChildren = this.searchTree(child, ids);
               if (hasChildren!=null){
                 newChildren.push(hasChildren)
               }
          }
      }
      let copy= Object.assign({}, element) 
      copy.children=newChildren;
      if ((ids.includes(copy.iconographyID)) || (copy.children.length>0)){
        copy.id=copy.iconographyID
        return copy
      }
      else{
        return null
      }
    },

  },
  getElement(element, id){
      if (element.id===id){
        return element
      }
      else{
        for (var child of element.children){
          var result = this.getElement(child,id)
          if (result!=null){
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
    result(newVal, oldVal){
      this.initNewDepiction()

    }
  },
  mounted:function () {

      this.initNewDepiction()



    }

}
</script>

<style lang="css" >

.v-tab {
  padding: 8px;
  min-width: 20px;
}

.v-treeview-node__content, .v-treeview-node__label {
  flex-shrink: 1;
  line-break: normal;
}
.v-treeview-node__root {
  height: auto; 
}
.v-treeview-node {
  min-height: 10px;
}
.v-treeview--dense .v-treeview-node__root
{
  min-height: 10px;
}
.v-treeview {
overflow-x: auto;
overflow-y: auto;
max-height: 200px;
}
</style>
