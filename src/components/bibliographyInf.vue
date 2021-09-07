<template>
    <v-card raised width="98%" style="margin: auto;">
      <v-card-title ><a :href="getBibURL()" style="flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;">Information for Annotated Bibliography Entry {{bibliography.annotatedBibliographyID}}</a> </v-card-title>
      <v-card-text  v-html="getBibTitle(bibliography)"> </v-card-text>

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

              <v-card class="mx-10">
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

                  <v-card flat style="min-height:50%">
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
      <v-expand-transition v-if="bibliography.annotation">
        <div v-show="showAnno">
          <v-divider></v-divider>

              <v-card class="mx-10" >
                <v-card-title>
                  <a :href="'https://kuchatest.saw-leipzig.de/kis/resource?document=AnnotatedBibliography.' + bibliography.annotatedBibliographyID + '-annotation.pdf'">
                  Annotation for Annotated Bibliography {{bibliography.annotatedBibliographyID}}
                  </a>
                </v-card-title>
                <div>
                  <vue-pdf-app
                  style="height: 80vh;"
                    :pdf="'https://kuchatest.saw-leipzig.de/kis/resource?document=AnnotatedBibliography.' + bibliography.annotatedBibliographyID + '-annotation.pdf'"
                  ></vue-pdf-app>
                </div>

              </v-card>
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
import VuePdfApp from "vue-pdf-app";
// import this to use default icons for buttons
import "vue-pdf-app/dist/icons/main.css";

export default {
  name: 'bibliographyInf',
  props: {
    bibliography: {},
  },

  components: {
    VuePdfApp
  },

  data () {
    return {
      relatedDepictions:[],
      showAddInf: false,
      showAnno: true,
      tab:[],
      viewerImg:{},
      currentPage: 0,
      pageCount: 0
    }
  },
  computed: {
    bibInfo (){
      if (this.bibliography.annotatedBibliographyID){
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
          bibInfo["Basic Information"] = basciInf
        }
        if (Object.keys(content).length > 0){
          bibInfo["Content"] = content
        }

        return bibInfo
      } else {
        return {}
      }
    }
  },
  methods: {
    getAllPages(){

    },
    getBibURL(){
      return "/bibliography/" + this.bibliography.annotatedBibliographyID
    },
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

    mouseOver: function(){
      this.showAddInf = !this.showAddInf
    },
    mouseOverAnno: function(){
      this.showAnno = !this.showAnno
    },
    getBibTitle(bib){
      console.log("bibentry: ", bib, getBibTitle(bib));
      return getBibTitle(bib)
    }
  },
  mounted:function () {
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
