<template>
  <div style="width:100%">
    <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
      <v-breadcrumbs
        :items="$store.state.breadcrumb"
      >
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item
            :href="item.href"
            :disabled="item.disabled"
          >
            <span style="color: black;">
              {{item.text}}
            </span>
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-card-title class="text-h3" raised width="98%" style="margin: auto;padding-bottom: 15px;">Discussion Forum on Dating Issues</v-card-title>
      <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
        <v-expansion-panels class="mx-5 pr-10 pt-5"  v-model="introPanel">
          <v-expansion-panel v-if="introTopicTitle!=='' || $store.state.user.accessLevel===4">
            <v-expansion-panel-header>
              Introduction
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card>
                <v-card-title class="font-weight-bold h3" v-if="!editIntro">
                  {{intro.introTopicTitle}}
                </v-card-title>
                <v-card-title v-if="editIntro">Introduction Title</v-card-title>
                <v-text-field v-if="editIntro" v-model="intro.introTopicTitle" class="mx-5"></v-text-field>
                <v-card-subtitle v-if="!editIntro">{{intro.introTopicSubtitle}}</v-card-subtitle>
                <v-card-subtitle v-if="editIntro">Introduction Subtitle</v-card-subtitle>
                <v-text-field v-if="editIntro" v-model="intro.introTopicSubtitle" class="mx-5"></v-text-field>
                <div v-for="introSection of intro.introSections" :key="introSection.id">
                  <v-card-text v-html="introSection.introBody" v-if="!editIntro">
                  </v-card-text>
                  <v-card-title v-if="editIntro">Introduction Body</v-card-title>
                  <div v-if="editIntro" >
                  <trumbowyg
                    ref="editor"  class="mx-5" v-model="introSection.introBody" @input="textChanged"
                  />
                  </div>
                  <v-list class="pt-0 mt-0">
                  <draggable v-if="$store.state.user.accessLevel===4" v-model="introSection.discussions" @end="postIntro()">
                    <v-list-item  v-for="introDiscussion in introSection.discussions" :key="introDiscussion._id" >
                      <template >
                        <v-list-item-content class="pt-0 mt-0">
                          <showIntroDiscussion :introDiscussion="introDiscussion" />
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </draggable>
                  <div v-if="$store.state.user.accessLevel!==4" >
                    <v-list-item v-for="introDiscussion in introSection.discussions" :key="introDiscussion._id" >
                      <template >
                        <v-list-item-content>
                          <showIntroDiscussion :introDiscussion="introDiscussion" />
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </div>
                  </v-list>
                </div>
                <v-row class="mt-3" v-if="$store.state.user.accessLevel===4">
                  <v-col class="d-flex justify-center">
                    <v-btn @click="clickEditSave()" dense color="success">{{editIntro ? "Save" : "Edit"}}</v-btn>
                  </v-col>
                  <v-col class="d-flex justify-center" v-if="editIntro===true">
                    <v-btn @click="editIntro = false" dense color="success">{{"Cancel"}}</v-btn>
                  </v-col>
                  <v-col class="d-flex justify-center" v-if="editIntro===true">
                    <v-btn @click="addIntro()" dense color="success">{{"Add new Intro Section"}}</v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels class="mx-5 pr-10 pt-5"  v-model="filterPanel">
          <v-expansion-panel>
            <v-expansion-panel-header>
              Forum Filter
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row no-gutters class="mx-2" dense>
                <v-col >
                  <free-text-search :isForum="true" ref="textSearch" :textSearchParam="getTextSearchParams" @clicked="onTextSearchInput"  @update="updateTextSearchInput" :aggregations="textFacets"></free-text-search>
                </v-col>
              </v-row>
              <v-row no-gutters>
                    <v-col class="mx-2">
                      <comboboxSearch label="KeyWord" ref="bibKeywordSearch" @clicked="changedBibKeywordInput" prefix="keywordList.keyword" :aggregations="bibKeywordFacets"></comboboxSearch>
                    </v-col>
                    <v-col class="mx-2">
                      <comboboxSearch label="Authors" ref="userSearch" @clicked="changedUserInput" prefix="user.keyword" :aggregations="userFacets"></comboboxSearch>
                    </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="mx-2">
                  <RangeSlideSearch
                    label="Chronological Range"
                    ref="RangeSlideSearch"
                    @clicked="changedChronologicalRangeInput"
                    prefix="chronologicalRange"
                    :aggregations="rangeSlideFacets"
                    rangeMin = "-425"
                    rangeMax = "2025"
                    rangeStep = "25"
                    :chronologicalDefault = "[-425, 2025]"
                    :chronologicalRange = "chronologicalRange"
                  ></RangeSlideSearch>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn @click="initiateSearch(2000)" :loading="loading" dense block color="success">{{"Show " + resAmount +" Results"}}</v-btn>
                </v-col>
                <v-col cols=1>
                  <v-btn icon @click="clear()" dense block color="success"><v-icon>mdi-restart</v-icon></v-btn>
                </v-col>
              </v-row>
            <radioGroupSort :startValue="['title.keyword']" @clicked="changedSort" class="mt-5" label="Sort" :radioGroupData="getRadioGroupData"></radioGroupSort>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-alert border="top" class="mt-5 mx-5" v-model="loggedOut" color="amber"> You need to have an aproved Account for creating a new thread and commenting. You can register here. <Register @click.stop="doRegister()"></Register> Or login here. <LoginComponent/></v-alert>
        <v-expansion-panels class="mx-5 pr-10 pt-5" v-model="panel" v-if="$store.state.user.granted&&newPosts">
          <v-expansion-panel  >
            <v-expansion-panel-header>
              Crate new Topic
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card class raised width="98%" style="margin: auto;padding-bottom: 15px;">
                <v-card-title class="text-5" raised width="98%" style="margin: auto;padding-bottom: 15px;">Connected Elements <v-btn x-small icon color="green"  @click="helpElements=!helpElements"><v-icon>mdi-help</v-icon></v-btn></v-card-title>
                <v-alert v-model="helpElements" dismissible color="green"> Please select at least one element of cave, iconography or painted representations. Multiple selections are allowed.</v-alert>
                <v-row class="mx-5">
                  <v-col>
                    <v-combobox
                      v-model="selectedCaves"
                      :items="caves"
                      label="Cave"
                      chips
                      deletable-chips
                      multiple>
                      <template v-slot:prepend-item>
                        <v-list-item
                          ripple
                          @mousedown.prevent
                          @click="selectAllCaves()"
                        >
                          <v-list-item-action>
                            <v-icon >
                              {{ selectedCaves.length === caves.length ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                            </v-icon>
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>
                              Select All
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                    </v-combobox>
                    </v-col>
                    <v-col>
                      <v-combobox
                        v-model="selectedIconography"
                        :items="iconography"
                        label="Iconography"
                        chips
                        deletable-chips
                        multiple>
                        <template v-slot:prepend-item>
                          <v-list-item
                            ripple
                            @mousedown.prevent
                            @click="selectAllIcos()"
                          >
                          <v-list-item-action>
                            <v-icon >
                              {{ selectedIconography.length === iconography.length ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                            </v-icon>
                          </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title>
                                Select All
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-2"></v-divider>
                        </template>
                      </v-combobox>
                    </v-col>
                    <v-col>
                      <v-combobox
                        v-model="selectedPR"
                        :items="prs"
                        label="Painted Representation"
                        chips
                        deletable-chips
                        multiple>
                        <template v-slot:prepend-item>
                          <v-list-item
                            ripple
                            @mousedown.prevent
                            @click="selectAllPrs()"
                          >
                          <v-list-item-action>
                            <v-icon >
                              {{ selectedPR.length === prs.length ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                            </v-icon>
                          </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title>
                                Select All
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-2"></v-divider>
                        </template>
                      </v-combobox>
                    </v-col>
                    <v-col>
                      <v-combobox
                        v-model="selectedBiblios"
                        :items="biblios"
                        label="Annotated Bibliography"
                        chips
                        deletable-chips
                        multiple>
                        <template v-slot:prepend-item>
                          <v-list-item
                            ripple
                            @mousedown.prevent
                            @click="selectAllBiblios()"
                          >
                          <v-list-item-action>
                            <v-icon >
                              {{ selectedBiblios.length === biblios.length ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                            </v-icon>
                          </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title>
                                Select All
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-2"></v-divider>
                        </template>
                        <template v-slot:item="{ index, item }">
                          <v-text-field
                          style="display: flow-root!important"
                            v-html="item.text"
                            autofocus
                            flat
                            background-color="transparent"
                            hide-details
                          ></v-text-field>
                        </template>
                      </v-combobox>
                    </v-col>
                </v-row>
                <v-card-title class="text-5" raised width="98%" style="margin: auto;padding-bottom: 15px;">Information<v-btn x-small icon color="green"  @click="helpElements=!helpElements"><v-icon>mdi-help</v-icon></v-btn></v-card-title>
                <v-row class="mx-5">
                  <v-col>
                    <v-combobox
                      v-model="keywordsSelected"
                      :items="keywords"
                      label="Keywords"
                      multiple
                      no-data-text>
                    </v-combobox>
                    </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-range-slider
                      v-model="chronologicalRangeSelected"
                      min="-425"
                      max="2025"
                      step="25"
                      thumb-label="always"
                      ticks
                      hide-details
                      thumb-size=46
                      class="mt-5"
                      label="Chronological Range"
                    >
                    <template v-slot:thumb-label="{ value }">
                      {{ chronologicalRange[((value+425) / 25)] }}
                    </template>
                    </v-range-slider>
                  </v-col>
                </v-row>
                <v-divider v-if="$store.state.user.accessLevel === 4"/>
                <v-subheader v-if="$store.state.user.accessLevel === 4">
                  Info-Section
                </v-subheader>
                <v-row v-if="$store.state.user.accessLevel === 4">
                  <v-col>
                    <v-checkbox
                      class="mx-5"
                      label="Publish in Info-Section"
                      v-model="isInfo"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col>
                    <v-combobox
                      v-if="isInfo"
                      :items="intro.introSections"
                      v-model="infoRank"
                      hide-details
                      single-line
                      class="mx-5"
                      title="Info-Section Rank"
                    >
                      <template v-slot:item="{ index, item }">
                        <v-text-field
                        style="display: flow-root!important"
                          v-html="item.introBody.substring(0,20)"
                          autofocus
                          flat
                          background-color="transparent"
                          hide-details
                        ></v-text-field>
                      </template>
                      <template v-slot:selection="{ attrs, item, parent, selected }">
                        <v-text-field
                        style="display: flow-root!important"
                          v-html="item.introBody.substring(0,50)"
                          autofocus
                          flat
                          background-color="transparent"
                          hide-details
                        ></v-text-field>
                      </template>

                    </v-combobox>
                  </v-col>
                </v-row>
                <v-card-title>Topic Title</v-card-title>
                <v-text-field v-model="topicTitle" class="mx-5"></v-text-field>
                <v-card-title>Topic Body</v-card-title>
                <trumbowyg
                  ref="editorForum"  class="mx-5" v-model="topicBody" @update="textChangedForum"
                />

                <v-col>
                  <v-btn @click="postNewthread" :loading="posting" dense block color="success">Submit</v-btn>
                </v-col>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <Foruminf
          @getComments="initiateSearch(1000)"
          :discussions="discussions"
          :chronologicalRange="chronologicalRange"
          :iconographyList="iconography"
          :cavesList="caves"
          :prsList="prs"
          :biblios="biblios"
          :keywords="keywords"
          :intro="intro"
        >
        </Foruminf>
      </v-card>
    </v-card>
  </div>
</template>

<script>

import Foruminf from '../components/foruminf.vue';
import {TextSearchForum} from '@/utils/constants.js'
import freeTextSearch from '@/components/freeTextSearch.vue'
import showIntroDiscussion from '@/components/showIntroDiscussion.vue'
import { v4 as uuidv4 } from 'uuid'
import {getBuckets, getDepictionLabelShort, getCaveShortLabel, getBibTitle, prepareSortItem, appendFilterToAgg} from  "@/utils/helpers"
import {getIntroDiscussions, getIntro, getComments, postQuery, putComments, getPRList, getBiblioList, getIcoList, getCaveList, getDiscussionKeywords} from '@/services/repository'

import draggable from 'vuedraggable'
import radioGroupSort from '@/components/radioGroupSort.vue'
import Register from '@/components/Register'
import LoginComponent from '@/components/LoginDialog'
import comboboxSearch from '@/components/comboboxSearch.vue'
import RangeSlideSearch from '@/components/RangeSlideSearch.vue'
import trumbowyg from '@/components/trumbowyg.vue'

export default {
  components: {
    Foruminf,
    freeTextSearch,
    radioGroupSort,
    Register,
    LoginComponent,
    comboboxSearch,
    RangeSlideSearch,
    showIntroDiscussion,
    draggable,
    trumbowyg
  },
  name: 'forumFilter',
  props: {
    newPosts: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      intro:{
        introTopicTitle: "",
        introTopicSubtitle: "",
        introSections:[]
      },
      introDiscussions: [],
      introTopicTitle:"",
      introTopicSubtitle:"",
      introBody:"",
      editIntro:false,
      infoRank:null,
      resAmount:0,
      isInfo:false,
      loading: false,
      discussions: [],
      filterPanel: 0,
      introPanel: false,
      sort: ["yearORG.keyword"],
      direction:"asc",
      aggregations:{},
      aggsObject:{},
      helpElements: false,
      selectedCaves: [],
      selectedIconography: [],
      selectedPR: [],
      selectedBiblios: [],
      topicBody: "",
      panel: true,
      topicTitle:"",
      posting: false,
      prs: [],
      biblios: [],
      iconography: [],
      caves: [],
      keywords:[],
      keywordsSelected:[],
      chronologicalRange: ["unset", "400BC", "375BC", "350BC", "325BC", "300BC", "275BC", "250BC", "225BC", "200BC", "175BC", "150BC", "125BC", "100BC", "75BC", "50BC", "25BC", "0AD", "25AD", "50AD", "75AD", "100AD", "125AD", "150AD", "175AD", "200AD", "225AD", "250AD", "275AD", "300AD", "325AD", "350AD", "375AD", "400AD", "425AD", "450AD", "475AD", "500AD", "525AD", "550AD", "575AD", "600AD", "625AD", "650AD", "675AD", "700AD", "725AD", "750AD", "775AD", "800AD", "825AD", "850AD", "875AD", "900AD", "925AD", "950AD", "975AD", "1000AD", "1025AD", "1050AD", "1075AD", "1100AD", "1125AD", "1150AD", "1175AD", "1200AD", "1225AD", "1250AD", "1275AD", "1300AD", "1325AD", "1350AD", "1375AD", "1400AD", "1425AD", "1450AD", "1475AD", "1500AD", "1525AD", "1550AD", "1575AD", "1600AD", "1625AD", "1650AD", "1675AD", "1700AD", "1725AD", "1750AD", "1775AD", "1800AD", "1825AD", "1850AD", "1875AD", "1900AD", "1925AD", "1950AD", "1975AD", "2000AD", "unset"],
      chronologicalRangeSelected: [-425, 2025],
      bibKeywordsSearchObjects:[],
      userSearchObjects: [],
      rangeSearch: {},
      textSearch: {},
      sortRanking:{}

    }
  },
  computed:{
    rangeSlideFacets(){
      return null
    },
    userFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = getBuckets(this.aggregations["user"])
      }
      return aggregations
    },
    bibKeywordFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = getBuckets(this.aggregations["keyword"])
      }
      return aggregations
    },
    loggedOut() {
      if (this.$store.state.user.granted){
        return !this.$store.state.user.granted
      } else {
        return true
      }
    },
    resultsTitle(){
      if (this.loading){
        return "Loading, please wait!"
      } else {
        if (this.resAmount === 1){
          return "Found " + this.resAmount + " Result"
        } else {
          return "Found " + this.resAmount + " Results"
        }
      }
    },
    getTextSearchParams(){
      this.$log.debug("TextSearchForum", TextSearchForum);
      return TextSearchForum
    },
    getRadioGroupData(){
      let radioGroupData = []
      radioGroupData.push({
        "label": "Title",
        "value": "title.keyword"
      })
      radioGroupData.push({
        "label": "latestUpdate",
        "value": "latestUpdate"
      })
      return radioGroupData
    },

  },
  methods: {
    addIntro(){
      if (!this.intro.introSections){
        this.intro["introSections"] = []
      }
      let newIntroSection = {
        "id": uuidv4(),
        "introBody":"blubb"
      }
      this.intro.introSections.push(newIntroSection)
    },
    textChangedForum(body){
      this.topicBody = body
    },
    textChanged(body){
      this.$log.debug("text changed:", body, this.intro)
    },
    changeFootNotes(node, delta) {
      this.$log.debug("quill node", node)
      this.$log.debug("quill delta", delta)
      return delta
    },
    selectAllBiblios(){
      if (this.selectedBiblios.length === this.biblios.length){
        this.selectedBiblios = []
      } else {
        this.selectedBiblios = this.biblios
      }
    },
    selectAllPrs(){
      if (this.selectedPR.length === this.prs.length){
        this.selectedPR = []
      } else {
        this.selectedPR = this.prs
      }
    },
    selectAllIcos(){
      if (this.selectedIconography.length === this.iconography.length){
        this.selectedIconography = []
      } else {
        this.selectedIconography = this.iconography
      }
    },
    selectAllCaves(){
      if (this.selectedCaves.length === this.caves.length){
        this.selectedCaves = []
      } else {
        this.selectedCaves = this.caves
      }
    },
    clickEditSave(){
      if (this.editIntro === false){
        this.editIntro = true
      } else {
        this.postIntro()
      }
    },
    changedChronologicalRangeInput(value){
      this.rangeSearch = value.search
      this.initiateFacets()
    },
    changedBibKeywordInput(value){
      this.bibKeywordsSearchObjects = value.search
      this.aggsObject["keyword"] = value.aggs
      this.initiateFacets()
    },

    changedUserInput(value){
      this.userSearchObjects = value.search
      this.aggsObject["user"] = value.aggs
      this.initiateFacets()
    },
    buildQueries(){
      let queries = {
        "must": [
          {
            "exists": {
              "field": "isInfo"
            }
          }
        ],
        "should": []}
      if (this.textSearch.should){
        if ((this.textSearch.should.length > 0) || (this.textSearch.must.length > 0)){
          for (let textSearchObject of this.textSearch.should){
            queries.should.push(textSearchObject)
          }
          for (let textSearchObject of this.textSearch.must){
            queries.must.push(textSearchObject)
          }
        }
      }
      if (this.rangeSearch.should){
        if ((this.rangeSearch.should.length > 0) || (this.rangeSearch.must.length > 0)){
          for (let rangeSearchObject of this.rangeSearch.should){
            queries.should.push(rangeSearchObject)
          }
          for (let rangeSearchObject of this.rangeSearch.must){
            queries.must.push(rangeSearchObject)
          }
        }
      }
      if (this.bibKeywordsSearchObjects){
        if (this.bibKeywordsSearchObjects.length > 0){
          for (let bibKeywordsSearchObject of this.bibKeywordsSearchObjects){
            queries.must.push(bibKeywordsSearchObject)
          }
        }
      }
      if (this.bibKeywordsSearchObjects){
        if (this.bibKeywordsSearchObjects.length > 0){
          for (let bibKeywordsSearchObject of this.bibKeywordsSearchObjects){
            queries.must.push(bibKeywordsSearchObject)
          }
        }
      }
      if (this.$store.state.user.accessLevel < 4){
        queries.must.push(
          {
            "multi_match": {
              "query": "true",
              "fields": "published"
            }
          }
        )
      }
      return queries
    },
    prepAggs(){
      this.initiateFacets()
    },
    initiateSearch(amount){
      this.$refs.textSearch.update()
      let searchObject = {}
      this.relatedDepictions = []
      searchObject["size"] = amount
      searchObject["sort"] = prepareSortItem(this.sort, this.direction)
      searchObject["query"] = {}
      searchObject.query["bool"] = {}
      searchObject.query.bool["must"] = {}
      searchObject.query.bool.must = []
      let shouldQuery = {
        "bool": {
          "should": []
        }
      }
      let depictionmust = {}
      depictionmust["exists"] = {}
      depictionmust.exists["field"] = "body"
      searchObject.query.bool.must.push(depictionmust)
      let queries = this.buildQueries()
      for (let query of queries.must){
        searchObject.query.bool.must.push(query)
      }
      for (let query of queries.should){
        shouldQuery.bool.should.push(query)
      }
      if (shouldQuery.bool.should.length > 0){
        searchObject.query.bool.must.push(shouldQuery)
      }
      this.resAmount = 0
      this.loading = true
      postQuery(searchObject, process.env.VUE_APP_ESAPI + 'kucha_discussion/_search')
        .then( res => {
          var newForums = []
          this.resAmount = res.data.hits.total.value
          for ( var entry of res.data.hits.hits){
            newForums.push(entry)
          }
          this.loading = false
          this.discussions = newForums
        })
        .catch((error) => {
          this.$log.debug(error)
          this.loading = false
        })
    },
    postIntro(){
      let copyIntro = JSON.parse(JSON.stringify(this.intro))
      for (let introSection of copyIntro.introSections){
        let newSortDic = {}
        let sort = 0
        if (!introSection.discussions){
          introSection["discussions"] = []
        }
        for (let entry of introSection.discussions){
          newSortDic[entry._id] = sort
          sort += 1
        }
        introSection.discussionSort = newSortDic
        delete introSection.discussions
      }
      copyIntro["title"] = ""
      this.$log.debug("start postintro", copyIntro)
      this.posting = true
      putComments(copyIntro, "introduction", false, this.$store.state.user.sessionID)
        .then( res => {
          const _self = this
          console.log("blubb");
          setTimeout(function () {
            _self.posting = false
            _self.editIntro = false
          }, 1000);
        })
        .catch((error) => {
          this.$log.debug(error)
        })
    },
    postNewthread(){
      this.posting = true
      const now = Date.now();
      var data = {
        "user": this.$store.state.user.lastname + ", " + this.$store.state.user.firstname,
        "userID": this.$store.state.user.userID,
        "title": this.topicTitle,
        "body": this.topicBody,
        "comments": [],
        "isInfo": this.isInfo,
        "date": now,
        "latestUpdate": now,
        "prs": this.selectedPR,
        "bibliography": this.selectedBiblios,
        "caves": this.selectedCaves,
        "iconography": this.selectedIconography,
        "subscribed": [this.$store.state.user.userID],
        "unsubscribed": [],
        "keywordList": this.keywordsSelected,
        "published": false,
        "chronologicalRangeMin": this.chronologicalRangeSelected[0],
        "chronologicalRangeMax": this.chronologicalRangeSelected[1]
      }
      if (this.isInfo){
        data["introSection"] = this.infoRank.id
      }
      putComments(data, uuidv4(), false, this.$store.state.user.sessionID)
        .then( res => {
          const _self = this
          setTimeout(function () {
            _self.getComments()
            _self.posting = false
            _self.clearForm()
          }, 2000);
        })
        .catch((error) => {
          this.$log.debug(error)
        })
    },
    clearForm(){
      this.selectedCaves = []
      this.sclearelectedIconography = []
      this.selectedPR = []
      this.selectedBiblios = []
      this.keywordsSelected = []
      this.chronologicalRangeSelected = [-200, 1700]
      this.topicTitle = ""
      this.topicBody = ""
      this.panel = false

    },

    updateTextSearchInput(value) {
      this.textSearch = value.search
    },
    initiateFacets(){
      this.discussions = []
      let aggregations = {"aggs" : {}}
      for (let aggProp in this.aggsObject){
        let agg = JSON.parse(JSON.stringify( this.aggsObject[aggProp].agg))
        for (let filterProp in this.aggsObject){
          if (filterProp !== aggProp){
            if (this.aggsObject[filterProp].filter){
              let filter = JSON.parse(JSON.stringify(this.aggsObject[filterProp].filter))
              if (filterProp === "keywords" || filterProp === "wallLocation"){
                agg = appendFilterToAgg(agg, filter, "reverse_nested")
              } else {
                agg = appendFilterToAgg(agg, filter, "filter")
              }
            }
          }
        }
        for (let finalAggProp in agg){
          aggregations.aggs[aggProp] = agg[finalAggProp]
        }
      }
      aggregations["size"] = 0
      aggregations["query"] = {
        "bool": {
          "must": [
          ]
        }
      }
      aggregations["post_filter"] = {}
      aggregations["post_filter"]["bool"] = {}
      aggregations["post_filter"]["bool"]["must"] = []
      let queries = this.buildQueries()
      let shouldQuery = {
        "bool": {
          "should": []
        }
      }

      for (let query of queries.must){
        aggregations.query.bool.must.push(query)
      }
      for (let query of queries.should){
        shouldQuery.bool.should.push(query)
      }
      if (shouldQuery.bool.should.length > 0){
        aggregations.query.bool.must.push(shouldQuery)
      }
      postQuery(aggregations, process.env.VUE_APP_ESAPI + 'kucha_discussion/_search')
        .then( res => {
          this.aggregations = res.data.aggregations
          this.resAmount = res.data.hits.total.value
        })
        .catch((error) => {
          this.$log.debug(error)
        })
    },

    onTextSearchInput(value) {
      this.$log.debug("value", value);
      this.textSearch = value.search
      // this.buildTextAggs(value.aggs)
      this.initiateFacets()
    },
    textFacets(){
      let aggregations = []
      if (this.aggregations){
        aggregations = this.getBuckets(this.aggregations["text"])
      }
      return aggregations
    },
    clear(){
      this.$refs.textSearch.clear();
      this.initiateFacets();
      this.bibKeywordsSearchObjects = [];

    },
    changedSort(value){
      this.sort = value[0]
      this.direction = value[1]
      this.relatedBibliography = []
    },
    sortIntroDiscussions(){
      this.$log.debug("this.sortRanking", this.sortRanking)
      for (let introSection of this.intro.introSections){
        this.$log.debug("introsection", introSection.discussions, introSection)
        introSection.discussions.sort(this.sortIntro)
      }
    },
    findMax(dic){
      let maxKey = 0
      let maxValue = 0
      for (const [key, value] of Object.entries(dic)) {
        if (value > maxValue) {
          maxValue = value;
          maxKey = key;
          this.$log.debug("maxKeay", maxKey)
        }
      }
      return maxValue
    },
    sortIntro(a, b){
      this.$log.debug("a", a.sortRanking)
      this.$log.debug("b", b.sortRanking)
      if (a.sortRanking === null || a.sortRanking === undefined){
        console.log("sortintro, a not found", a._id, a.sortRanking);
        a.sortRanking = this.findmax(a._id)
      }
      if (b.sortRanking === null || b.sortRanking === undefined){
        console.log("sortintro, b not found", b._id, b.sortRanking);
        b.sortRanking = this.findmax(b._id)
      }
      return a.sortRanking - b.sortRanking
    },
    findmax(id){
      console.log("sortintro findmax started", id);
      if (!this.intro){
        return 99999
      }
      if (!this.intro.discussions){
        return 99999
      }
      for (let introSection of this.intro.introSections){
        for (let discussion of introSection.discussions){
          if (discussion._id === id){
            return (introSection.discussions.length)
          }
        }
      }
      return 9999
    },
    getComments(){
      getComments()
        .then( res => {
          this.discussions = res.data.hits.hits
          this.discussions.sort(function(a, b){return b._source.latestUpdate - a._source.latestUpdate})
        })
        .catch((error) => {
          this.$log.debug(error)
        })
    },
  },
  watch:{
    selectedPR(newVal, oldVal){
      let newPRs = newVal.filter(x => !oldVal.includes(x))
      for (let pr of newPRs){
        let caves = this.caves.filter(x => pr.cave === x.value)
        for (let cave of caves){
          if (!this.selectedCaves.some(x => {
            if (x.value === cave.value) {
              return true
            }
            return false
          })){
            this.selectedCaves.push(cave)
          }
        }
      }
    },

  },
  mounted:function () {
    let bibKeywordRes = this.$refs.bibKeywordSearch.prepSearch();
    this.bibKeywordsSearchObjects = bibKeywordRes.search
    this.aggsObject["keyword"] = bibKeywordRes.aggs
    let userRes = this.$refs.userSearch.prepSearch();
    this.userSearchObjects = userRes.search
    this.aggsObject["user"] = userRes.aggs
    this.initiateFacets()
    getPRList()
      .then( res => {
        for (var pr of res.data.hits.hits){
          let label = getDepictionLabelShort(pr._source)
          let prProcessed = {
            value: pr._source.depictionID,
            text: label,
            cave: pr._source.cave ? pr._source.cave.caveID : -1
          }
          this.prs.push(prProcessed)
        }
      })
      .catch((error) => {
        this.$log.debug(error)
      })
    getBiblioList()
      .then( res => {
        for (var pr of res.data.hits.hits){
          let label = getBibTitle(pr._source)
          let biblioProcessed = {
            value: pr._source.annotatedBibliographyID,
            text: label
          }
          this.biblios.push(biblioProcessed)
        }
      })
      .catch((error) => {
        this.$log.debug(error)
      })
    getIcoList()
      .then( res => {
        for (var ico of res.data.hits.hits){
          let label = ico._source.text
          let icoProcessed = {
            value: ico._source.iconographyID,
            text: label
          }
          this.iconography.push(icoProcessed)
        }
      })
      .catch((error) => {
        this.$log.debug(error)
      })
    getCaveList()
      .then( res => {
        for (var cave of res.data.hits.hits){
          let label = getCaveShortLabel(cave._source)
          let caveProcessed = {
            value: cave._source.caveID,
            text: label
          }
          this.caves.push(caveProcessed)
        }
      })
      .catch((error) => {
        this.$log.debug(error)
      })
    getDiscussionKeywords()
      .then( res => {
        for (let keyword of res.data.aggregations.keywordList.buckets){
          this.keywords.push(keyword.key)
        }
      })
      .catch((error) => {
        this.$log.debug(error)
      })
    getIntro()
      .then( res => {
        this.$log.debug("Intro", res)
        this.intro = res.data._source
        for (let infoSection of this.intro.introSections){
          this.$log.debug("introdiscussions", self)
          getIntroDiscussions(infoSection.id)
            .then( result => {
              let discussions =  result.data.hits.hits
              for (let discussion of discussions){
                discussion.sortRanking = infoSection.discussionSort[discussion._id]
              }
              discussions.sort(this.sortIntro)
              this.$log.debug("sortedDiscussions", discussions)
              infoSection.discussions = discussions
            })
        }
        // this.sortIntroDiscussions()
      })
      .catch((error) => {
        this.$log.debug(error)
      })
  },
}

</script>

<style>
.v-select__selections {
  overflow: scroll;
  flex-wrap: nowrap;
}
.v-chip {
  overflow: initial;
}

</style>
