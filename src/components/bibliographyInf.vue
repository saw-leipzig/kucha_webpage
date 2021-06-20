<template>
    <v-card raised width="98%" style="margin: auto;">
      <v-card-title > Information for Annotated Bibliography Entry {{bibliography.annotatedBibliographyID}} </v-card-title>
      <v-card-subtitle v-html="getBibTitle(bibliography)"> </v-card-subtitle>

      <v-card-actions v-if="Object.keys(bibInfo).length>0">
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
          @click="showAddInf = !showAddInf"
        >
          <v-icon>{{ showAddInf ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="showAddInf">
          <v-divider></v-divider>

          <v-card-text>
            <v-container>
              <v-card>
                <v-card-title>
                  Additional Information for Annotated Bibliography {{bibliography.annotatedBibliographyID}}
                </v-card-title>
                <v-tabs
                v-model="tab"

                >
                  <v-tab
                    v-for="(item_value, item_name, item_key) in bibInfo"
                    :key="item_key"
                  >
                    {{ item_name }}
                  </v-tab>
                </v-tabs>

                  <v-card flat>
                    <v-tabs-items v-model="tab">
                      <v-tab-item
                        v-for="(item_value, item_name, item_key) in bibInfo"
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
            </v-container>
          </v-card-text>
        </div>
      </v-expand-transition>
      <v-card-actions v-if="bibliography.annotation">
        <v-btn
          @click="mouseOverAnno"
          color="orange lighten-2"
          text
        >
          Annotation
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
        <div v-show="showAnno">
          <v-divider></v-divider>

          <v-card-text>
            <v-container>
              <v-card>
                <v-card-title>
                  Annotation for Annotated Bibliography {{bibliography.annotatedBibliographyID}}
                </v-card-title>
                <div id="openseadragonAnno" style='height:500px'>
                </div>
              </v-card>
            </v-container>
          </v-card-text>
        </div>
      </v-expand-transition>
      <div v-if="relatedDepictions">
        <hideRelatedItems v-if="relatedDepictions.length>0" title="Related Painted Representations" :items="relatedDepictions"></hideRelatedItems>
      </div>

    </v-card>
</template>

<script>

import {getDepictionByBibliography} from '@/services/repository'
import {getBibTitle} from  "@/utils/helpers"
import OpenSeadragon from "openseadragon"
export default {
  name: 'bibliographyInf',
  props: {
    bibliography: {},
  },

  components: {
  },

  data () {
    return {
      relatedDepictions:[],
      showAddInf: false,
      showAnno: false,
      tab:[],
      viewerImg:{}
    }
  },
  computed: {
    bibInfo (){
      console.log("bibentry: ", this.bibliography);
      var bibInfo = {}
      var basciInf = {}
      var content = {}
      if (this.bibliography.abstractText !== ""){
        content["Abstract"] = this.bibliography.abstractText
      }
      if (this.bibliography.comments !== ""){
        content["Comments"] = this.bibliography.comments
      }
      if (this.bibliography.keywordList.length > 0){
        let keywords = ""
        for (let keyword of this.bibliography.keywordList){
          if (keywords === ""){
            keywords += keyword.bibKeyword
          }
        }
        basciInf["Keywords"] = keywords
      }
      if (this.bibliography.url !== ""){
        basciInf["Url"] = this.bibliography.url
      }
      if (this.bibliography.notes !== ""){
        content["Notes"] = this.bibliography.notes
      }
      if (Object.keys(basciInf).length > 0){
        bibInfo["Basic Inforamtion"] = basciInf
      }
      if (Object.keys(content).length > 0){
        bibInfo["Content"] = content
      }

      return bibInfo
    }

  },
  methods: {
    getRelatedDepictions(){
      var params = {}
      params.annotatedBibliographyID = [parseInt(this.$route.params.id)]
      getDepictionByBibliography(params)
        .then( res => {
          var newDepictions = []
          for (var entry of res.data.hits.hits){
            newDepictions.push(entry._source)
          }
          this.relatedDepictions = newDepictions
          console.log("new Depictions:", newDepictions);
        }).catch(function (error) {
          console.log(error)
        })
    },
    initOSDAnno(){
      if (this.bibliography.annotation){
        let tile = process.env.VUE_APP_IIIFAPI + "/iiif/2/kucha%2Fdocuments%2FAnnotatedBibliography." + this.bibliography.annotatedBibliographyID + "-annotation.pdf/info.json"
        let tilesImg = []
        tilesImg.push(tile)
        console.log("images available, initiate OSDAnno");
        this.viewerImg = OpenSeadragon({
          id: "openseadragonAnno",
          sequenceMode: true,
          showReferenceStrip: true,
          prefixUrl: '/static/',
          tileSources: tilesImg,
        })
      }

    },
    mouseOver: function(){
      this.showAddInf = !this.showAddInf
    },
    mouseOverAnno: function(){
      this.showAnno = !this.showAnno
    },
    getBibTitle(bib){
      console.log("bibentry: ", bib);
      return getBibTitle(bib)
    }
  },
  mounted:function () {
    this.initOSDAnno()
    this.getRelatedDepictions()
  }
}
</script>

<style lang="css" scoped>

.v-list-item__title{
  margin-bottom: 5px;
}
.v-tab {
  padding: 8px;
  min-width: 20px;
}
</style>
