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
                        <div v-if="item_name=='dating'">
                          <foruminf heading="Related Dating Discussions" :newPosts="false" @getComments="getComments()" :discussions="discussions"></foruminf>
                        </div>
                        <v-list-item two-line v-for="(value, name, index) in item_value" :key=index>
                          <v-list-item-content>
                            <v-list-item-title class="ml-1 mt-5" >{{name}}</v-list-item-title>
                            <div v-if="!item_name.includes('Author') && !item_name.includes('Editor')" style="white-space: pre-line;padding:0px 0px 0px 10px;">{{value}}</div>
                            <div v-if="item_name.includes('Author') || item_name.includes('Editor')">
                              <v-list-item style="min-height:30px" v-for="(author_value, author_name, author_index) in value" :key=author_index>
                              <v-list-item-content style="padding:0">
                                <v-list-item-title class="ml-5" >{{author_name + ": "+ author_value}}</v-list-item-title>
                              </v-list-item-content>
                              </v-list-item>
                          </div>
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

import {getDepictionByBibliography, getVersionsOfEntry, getVersionOfEntry, getCommentsByItems} from '@/services/repository'
import {getBibTitle} from  "@/utils/helpers"
import VuePdfApp from "vue-pdf-app";
import "vue-pdf-app/dist/icons/main.css";
import Foruminf from '../components/foruminf.vue'

export default {
  name: 'bibliographyInf',
  props: {
    bibliographyDefault: {},
  },

  components: {
    VuePdfApp,
    Foruminf
  },

  data () {
    return {
      relatedDepictions:[],
      showAddInf: false,
      showAnno: true,
      tab:[],
      bibliography:{},
      viewerImg:{},
      currentPage: 0,
      pageCount: 0,
      version:null,
      versions:['current'],
      showVersions: false,
      discussions: [],
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
        if (this.bibliography.authorList.length > 0){
          let authorList = {}
          for (let authorInf of this.bibliography.authorList){
            let authorInfShown = {}
            if (authorInf.alias !== null && authorInf.alias !== "" && authorInf.alias !== undefined){
              authorInfShown["Alias"] = authorInf.alias
            }
            if (authorInf.homepage !== null && authorInf.homepage !== "" && authorInf.homepage !== undefined){
              authorInfShown["Homepage"] = authorInf.homepage
            }
            if (authorInf.firstname === null || authorInf.firstname === "" || authorInf.firstname === undefined){
              if (authorInf.lastname === null || authorInf.lastname === "" || authorInf.lastname === undefined){
                authorList[authorInf.alias] = authorInfShown
              } else {
                authorList[authorInf.lastname] = authorInfShown
              }
            } else {
              authorList[authorInf.firstname + " " + authorInf.lastname] = authorInfShown
            }
          }
          let authors = ""
          this.bibliography.authorList.length > 1 ? authors = "Authors" : authors = "Author"
          bibInfo[authors] = authorList
        }
        if (this.bibliography.editorList.length > 0){
          let editorList = {}
          for (let authorInf of this.bibliography.editorList){
            let authorInfShown = {}
            if (authorInf.alias !== null && authorInf.alias !== "" && authorInf.alias !== undefined){
              authorInfShown["Alias"] = authorInf.alias
            }
            if (authorInf.homepage !== null && authorInf.homepage !== "" && authorInf.homepage !== undefined){
              authorInfShown["Homepage"] = authorInf.homepage
            }
            if (authorInf.firstname === null || authorInf.firstname === "" || authorInf.firstname === undefined){
              if (authorInf.lastname === null || authorInf.lastname === "" || authorInf.lastname === undefined){
                editorList[authorInf.alias] = authorInfShown
              } else {
                editorList[authorInf.lastname] = authorInfShown
              }
            } else {
              editorList[authorInf.firstname + " " + authorInf.lastname] = authorInfShown
            }
          }
          let authors = ""
          this.bibliography.authorList.length > 1 ? authors = "Editor" : authors = "Editors"
          bibInfo[authors] = editorList
        }
        if (Object.keys(basciInf).length > 0){
          bibInfo["Basic Information"] = basciInf
        }
        if (Object.keys(content).length > 0){
          bibInfo["Content"] = content
        }
        if (this.discussions.length > 0){
          bibInfo['dating'] = ''
        }

        return bibInfo
      } else {
        return {}
      }
    }
  },
  methods: {
    getComments(){
      getCommentsByItems([], [], [], [this.bibliography.annotatedBibliographyID])
        .then( res => {
          console.log("recieved discussions.", res.data.hits.hits)
          this.discussions = res.data.hits.hits
        }).catch(function (error) {
          console.log(error)
          return null
        })
    },
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
    this.getComments()
  },
  beforeMount:function () {
    console.log("beforemount:", this.bibliographyDefault);
    this.bibliography = this.bibliographyDefault
    getVersionsOfEntry(this.bibliographyDefault)
      .then( res => {
        console.log("recieved versions.", res.data.hits.hits)
        this.versions = res.data.hits.hits
        for (let v of this.versions){
          v.date = new Date(v._source.timestamp)
        }
        this.versions[this.versions.length - 1].date = this.versions[this.versions.length - 1].date + " - (current)"
        this.version = this.versions[this.versions.length - 1]
        console.log("versions:", this.versions);
      }).catch(function (error) {
        console.log(error)
        return null
      })
  },
  watch: {
    version(newVal, oldVal){
      if (newVal != null){
        getVersionOfEntry(newVal._id)
          .then( res => {
            this.bibliography = res.data._source.content
          }).catch(function (error) {
            console.log(error)
            return null
          })
      }
    }
  },
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
