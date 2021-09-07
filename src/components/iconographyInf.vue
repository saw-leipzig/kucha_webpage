<template>
    <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;" v-if="idealTypical">
      <v-card-title ><a :href="getIcoURL()" style="flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;">Information for Iconography Entry {{iconography.iconographyID}}</a> </v-card-title>
      <v-card-subtitle v-html="iconography.text"> </v-card-subtitle>
      <v-card class="mx-10">

      <v-treeview
          :items="icoTree"
          rounded
          open-all
          dense
          transition
      >
        <template class="v-treeview-node__label" slot="label" slot-scope="{ item }">
          <div v-html="getTitle(item)"></div>
        </template>
      </v-treeview>
      </v-card>
      <v-card-actions v-if="idealTypical.annos.length>0">
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
      <v-expand-transition v-if="idealTypical.annos.length>0">
        <annotatedImage style="min-height: 60vh;" v-show="showAnno" v-if="idealTypical.annos.length>0" :item="iconography"  :annos="idealTypical.annos" :relatedAnnotations="idealTypical.relatedAnnotationList"/>
      </v-expand-transition>
      <v-card-actions v-if="hasAdditionalInfo">
        <v-btn
          @click="mouseOver"
          color="orange lighten-2"
          text
        >
          Additional Information
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="showDec = !showDec"
        >
          <v-icon>{{ showDec ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="showDec">
          <v-divider></v-divider>

              <v-card class="mx-10">
                <v-card-title>
                  Additional Information for Iconography Entry {{iconography.iconographyID}} ({{iconography.text}})
                </v-card-title>
                <v-tabs
                v-model="tab"

                >
                  <v-tab
                    v-for="(item_value, item_name, item_key) in idealTypical.data"
                    :key="item_key"
                  >
                    {{ item_name }}
                  </v-tab>
                </v-tabs>

                  <v-card flat>
                    <v-tabs-items v-model="tab">
                      <v-tab-item
                        v-for="(item_value, item_name, item_key) in idealTypical.data"
                        :key="item_key"
                      >
                        <v-list-item two-line v-for="(value, name, index) in item_value" :key=index>
                          <v-list-item-content>
                            <v-list-item-title >{{name}}</v-list-item-title>
                            <div style="white-space: pre-line;padding:0px 0px 0px 10px;">{{value}}</div>
                          </v-list-item-content>
                        </v-list-item>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-card>

              </v-card>
        </div>
      </v-expand-transition>
      <v-card-actions v-if="hasImages">
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


              <v-card class="mx-10" style='height:550px' v-if="hasImages">
                <v-tabs
                v-if="hasImages"
                  slider-color="yellow"
                  centered
                >
                  <v-tab
                    v-for="(item, index) in idealTypical.images"
                    :key="index"
                    @click="setOSDimages(item)"
                >
                        <v-img
                            :src="getThumbnail(item)"
                          ></v-img>
                  </v-tab>
                </v-tabs>
                <div id="openseadragonImg" style='height:500px'></div>
              </v-card>
      </v-expand-transition>
      <hideRelatedItems v-if="hasRelatedDepictions" title="Related Painted Representations" :items="relatedDepictions"></hideRelatedItems>
    </v-card>

</template>

<script>
import { getDepictionByAnnotation } from '@/services/repository'
import {fillPicsContainer} from '@/utils/helpers'
import OpenSeadragon from 'openseadragon'
import annotatedImage from '@/components/annotatedImage'

export default {

  name: 'iconographyInf',
  props: {
    iconography: {}
  },
  components: {
    annotatedImage,
  },
  data () {
    return {
      tab:[],
      showDec:false,
      showImage:true,
      relatedDepictions:[],
      iconographyWithChildren:{},
      showAnno: true,
    }
  },
  computed: {
    hasRelatedDepictions(){
      if (this.relatedDepictions){
        if (this.relatedDepictions.length > 0){
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    hasImages(){
      console.log("hasImages:", this.idealTypical);
      if (this.idealTypical){
        if (this.idealTypical.images){
          if (this.idealTypical.images.length > 0){
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        return false
      }
    },
    hasAdditionalInfo(){
      console.log("idealtypical:", this.idealTypical);
      if (this.idealTypical){
        if (Object.keys(this.idealTypical).length > 0){
          if (Object.keys(this.idealTypical.data).length > 0){
            console.log("idealtypical returned true:", Object.keys(this.idealTypical).length);
            return true
          } else {
            return false

          }
        } else {
          return false
        }
      } else {
        return false
      }
    },
    icoTree(){
      var returnElement = []
      for (var rootElement of this.$store.state.dic.iconography){
        var dummy =  Object.assign({}, rootElement)
        var result = this.searchTree(dummy, this.iconography)
        if (result != null){
          returnElement.push(result)
        }
      }
      console.log("returnElement", returnElement );
      return returnElement
    },

    idealTypical(){
      let icoInf = {}
      let data = {}
      let basicInf = {}
      let desc = {}
      console.log("iconography Entry", this.iconography);
      // if (this.iconography.search !== "" && this.iconography.search !== this.iconography.text){
      //   basicInf["Alternative Terms"] = this.iconography.search
      // }
      console.log(this.$store.state.dic.ornaments);
      let idealTypical = this.$store.state.dic.ornaments.find(el => el.iconographyID === this.iconography.iconographyID)
      icoInf.annos = []
      icoInf.relatedAnnotationList = []
      if (idealTypical !== undefined){
        console.log("idealTypical", idealTypical);
        let res = fillPicsContainer(idealTypical.images, idealTypical.relatedAnnotationList)
        console.log("idealTypical res", res);
        icoInf.relatedAnnotationList = idealTypical.relatedAnnotationList
        if (idealTypical.description){
          desc["Description"] = idealTypical.description
        }
        if (idealTypical.remarks){
          desc["General Remarks"] = idealTypical.remarks
        }
        icoInf['images'] = []
        if (res.images.length > 0){
          icoInf['images'] = idealTypical.images
        }
        icoInf['annos'] = res.annos
      }
      if (Object.keys(basicInf).length > 0){
        data['Basic Information'] = basicInf
      }
      if (Object.keys(desc).length > 0){
        data['Description'] = desc
      }
      this.getRelatedDepictions()
      icoInf['data'] = data
      console.log("idealtypical.relatedAnnotationList", icoInf.relatedAnnotationList);
      return icoInf
    },

  },
  methods: {
    getIcoURL(){
      return "/iconography/" + this.iconography.iconographyID
    },
    getIdsOfChildren(ico, ids){
      var result = []
      if (ico.iconographyID){
        if (ico.children){
          if (ico.children.length > 0){
            for (var child of ico.children){
              result = result.concat(this.getIdsOfChildren(child, []))
            }
          }
        }
        result.push(ico.iconographyID)

      }
      return result
    },
    getRelatedDepictions(){
      var params = {}
      var allIds = this.getIdsOfChildren(this.iconographyWithChildren)
      params.iconographyID = allIds
      console.log("params of getDepictions", params);
      getDepictionByAnnotation(params)
        .then( res => {
          var newDepictions = []
          for ( var entry of res.data.hits.hits){
            newDepictions.push(entry._source)
          }
          this.relatedDepictions = newDepictions
          console.log("new Depictions:", newDepictions);
        }).catch(function (error) {
          console.log(error)
        })
    },
    getOSDURL(image){
      let tiles = []
      tiles.push(process.env.VUE_APP_IIIFAPI + "/iiif/2/kucha%2Fimages%2F" + image.filename + "/info.json")
      return tiles
    },
    initNewIconography(){
      if (this.idealTypical.images){
        if (this.idealTypical.images.length > 0){
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
          if (!this.viewerImg){
            this.initOSDimg()
          }
        }
      }
    },
    initOSDimg(){
      let tilesImg = []
      console.log("Initializing Images: ", this.idealTypical.images);
      if (this.idealTypical.images.length > 0){
        console.log("images available, initiate OSDIMG");
        tilesImg = this.getOSDURL(this.idealTypical.images[0])
        this.image = this.idealTypical.images[0]
        this.viewerImg = OpenSeadragon({
          id: "openseadragonImg",
          prefixUrl: '/static/',
          tileSources: tilesImg,
        })
      }
    },
    setOSDimages(image){
      this.image = image
      console.log("change to ", this.getOSDURL(image));
      this.viewerImg.open(this.getOSDURL(image))
    },
    mouseOver: function(){
      this.showDec = !this.showDec
    },
    getItemURL(item){
      var res = ""
      res = "/iconography/" + item.iconographyID
      return res
    },
    getTitle(item){
      if (item.iconographyID === this.iconography.iconographyID){
        return "<b>" + item.name + "</b>"
      } else {
        return "<a href=\"" + this.getItemURL(item) + "\" style=\"color: inherit;text-decoration: none\">" + item.name + "</a>"
      }
    },
    searchTree(element, ids){
      let copy = Object.assign({}, element)
      if (ids.iconographyID === element.iconographyID){
        element["isHeading"] = true
        this.iconographyWithChildren = element
        return element
      } else {
        if (element.children != null) {
          let newChildren = []
          for (var child of element.children) {
            var hasChildren = this.searchTree(child, ids);
            if (hasChildren != null){
              newChildren.push(hasChildren)
              copy.children = newChildren;
              copy["isHeading"] = false
              return copy
            }
          }
        }
      }
      return null
    },
    getThumbnail(image){
      return process.env.VUE_APP_IIIFAPI + "/iiif/2/kucha%2Fimages%2F" + image.filename + "/full/!80,80/0/default.jpg"
    },
  },
  mounted:function () {
    console.log("new Iconography started");
    this.initNewIconography()
  }

}
</script>

<style lang="css">

.v-list-item__title{
  margin-bottom: 5px;
}
.v-tab {
  padding: 8px;
  min-width: 20px;
}

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
max-height: 100%;
}
</style>