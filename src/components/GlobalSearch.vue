<template>
    <v-form @submit.prevent="formSubmit" class="va-search d-flex align-center" :class="{'dense': dense}" style="width:50%;margin: 0 auto;">
      <v-text-field
      :disabled="searchDisabled"
      id="global-search-input-field"
      ref="globalSearchInput"
      label="Search"
      clearable
      :autofocus="autofocus"
      :filled="filled"
      :outlined="outlined"
      :dense="dense"
      light
      prepend-inner-icon="mdi-magnify"
      v-model="searchtext"
      @keyup="countAndSubmit"
      @focus="checkFocus"
      @click.stop="checkFocus"
      @mouseup.prevent
      @mousedown.prevent
      @click:clear.prevent="checkClear"
      v-on:keyup.enter="formSubmit(0)"
      v-on:keyup.escape="checkClear"
      :persistent-hint="persistentHint"
      :hint="hint"
      :hide-details="hint === ''"
      :loading="loading"
      class="search-input"
      :style="$vuetify.breakpoint.smAndUp ? 'min-width: 300px;' : ''"
      autocomplete="off"
      accesskey="f"
      >
      </v-text-field>
      <v-btn
      v-if="! hideButton"
      :style="!$vuetify.breakpoint.smAndUp ? 'min-width: 52px; padding: 0' : ''"
      color="primary"
      :x-large="xlarge"
      :x-small="xsmall"
      :small="small"
      :large="large"
      @click.stop="formSubmit(0)">
        <span v-if="$vuetify.breakpoint.smAndUp">Search</span>
        <v-icon v-else>mdi-magnify</v-icon>
      </v-btn>
      <v-menu attach activator="form.va-search" bottom light v-model="showResults" class="resultMenu" :close-on-content-click="true" :close-on-click="false">

        <v-list :dense="$vuetify.breakpoint.smAndDown">
          <v-subheader style="padding: 0px;" class="search-results-header">
            <v-list-item-action class="ml-n2">
                <v-btn icon v-on:click="loadPrevious" :disabled="searchPack<=0">
                  <v-icon >mdi-arrow-left</v-icon>
                </v-btn>
            </v-list-item-action>
            <v-list-item-content class="text-center">
              <v-list-item-title class="grey--text">{{"Results "+searchPack+"-"+searchPackEnd+" of "+totalres}}</v-list-item-title>
              <v-list-item-subtitle>{{ 'Results for' + ': ' + searchtext}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <va-legend :legendItems="legendItems" :buttonProps="legendButtonProps" @dialog_closed="focusOnInput">
                <v-btn icon><v-icon>mdi-help</v-icon></v-btn>
              </va-legend>
            </v-list-item-action>
            <v-list-item-action>
                <v-btn icon v-on:click="loadNext" :disabled="searchPack+results.length===totalres">
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
            </v-list-item-action>
          </v-subheader>
          <v-list-item v-for="(item, index) in $store.state.results" :key="index" @click.native=setRes(index) :to="getItemURL(item)" two-line>
              <v-list-item-content>
                  <v-list-item-title v-html="getTitle(item)"></v-list-item-title>
                  <v-list-item-subtitle v-html="getSubTitle(item)"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
        </v-list>
      </v-menu>
    </v-form>

</template>

<script>
import { CancelToken } from "@/utils/httpClient";
import { createFrontendLink } from  "@/utils/urlHelper"
import {getCaveLabel, getBibTitle, getWallLabels} from  "@/utils/helpers"
import { searchRoot } from '@/services/repository'
import Legend from '@/components/Legend'

export default {

  name: 'GlobalSearch',

  components: {
    'va-legend': Legend
  },

  props: {

    filled: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    xlarge: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    xsmall: {
      type: Boolean,
      default: false
    },
    hideButton: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: ''
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {

      results: Array,
      start: 0,
      showResults: false,
      cancelToken: null,
      previousUrl: '',
      nextUrl: '',
      loading: false
    }
  },
  computed: {
    searchDisabled(){
      return this.$store.state.searchDisabled
    },
    searchPackEnd(){
      return this.searchPack + this.results.length;
    },
    searchPack:{
      get: function(){
        return this.$store.state.searchPack;
      },
      set: function (newValue){
        this.$store.commit("setSearchPack", newValue)
      }
    },
    totalres:{
      get: function(){
        return this.$store.state.totalRes;
      },
      set: function (newValue){
        this.$store.commit("setTotalRes", newValue)
      }
    },
    respack:{
      get: function(){
        return  this.$store.state.respack;
      },
      set: function (newValue){
        this.$store.commit("setRespack", newValue)
      }
    },
    searchtext:{
      get: function(){
        return this.$store.state.searchText;
      },
      set: function (newValue){
        this.$store.commit("setSearchText", newValue)
      }
    },
    b_size() {
      return this.$vuetify.breakpoint.smAndUp ? 10 : 4
    },
    legendButtonProps() {
      return { icon: true }
    },
    legendItems() {
      let legend = []
      let legendObject = {}
      legendObject.title = "Title"
      legendObject.items = [];
      legendObject.items.push({vhtml: this.buildLegendIcon(this.getHtmlIcon('mdi-menu-up')), description:"description", itemClasses: "reducedPaddingTop"})
      legendObject.items.push({vhtml: this.buildLegendIcon(this.getHtmlIcon('mdi-menu-down')), description: "description", itemClasses: "reducedPaddingTop"})
      legendObject.items.push({vhtml: this.buildLegendIcon(this.getHtmlIcon('mdi-keyboard-return', 14)), description: ""})
      let legendAccessKey = {}
      legendAccessKey.items = [];
      legend.push({ block: [legendObject], width: 60 })
      legend.push({ block: [legendAccessKey], width: 60 })
      return legend
    },

  },

  methods: {
    getTitle(item){
      if (item._source.depictionID){
        return (item._source.cave === undefined || item._source.shortName === "") ? "Painted Representation " + item._source.depictionID :  "Painted Representation " + item._source.depictionID + " (" + item._source.shortName + ")"
      } else if (item._source.caveID){
        return this.getCaveLabel(item._source)
      } else if (item._source.annotatedBibliographyID){
        return "Annotated Bibliography: " + getBibTitle(item._source)
      } else if (item._source.iconographyID){
        return "Iconography: " + item._source.iconographyID
      } else {
        return "unknown"
      }
    },
    getSubTitle(item){
      if (item._source.depictionID){
        return getWallLabels(this.$store.state.dic.wallLocation, item._source, "")
      } else if (item._source.caveID){
        return null
      } else if (item._source.annotatedBibliographyID){
        return null
      } else if (item._source.iconographyID){
        return "(" + item._source.text + ")"
      } else {
        return "unknown"
      }
    },
    createFrontendLink: createFrontendLink,
    getCaveLabel(item){
      return 'Cave ' + getCaveLabel(item)
    },
    checkFocus(e) {
      if (document.activeElement === e.target && !this.showResults && this.searchtext && this.searchtext.length > 2) {
        this.showResults = true
      }
    },
    getItemURL(item){
      var res = ""
      if (item._source.depictionID){
        res = "/depiction/" + item._source.depictionID
      } else if (item._source.caveID){
        res = "/cave/" + item._source.caveID
      } else if (item._source.annotatedBibliographyID){
        res = "/bibliography/" + item._source.annotatedBibliographyID
      } else if (item._source.iconographyID){
        res = "/iconography/" + item._source.iconographyID
      }
      return res
    },
    setRes(res){
      console.log("setRes started")
      console.log('Setting result to', res);
      this.$store.commit('setResult', res)
    },
    checkClear() {
      this.searchtext = '';
      this.showResults = false;
    },

    buildLegendIcon(text) {
      return '<div class="va-key-symbol" style="border: 1px solid black; width: 48px; height: 28px; padding: 4px; text-align: center;">' + text + '</div>'
    },
    getHtmlIcon(iconname, fontSize) {
      let fontstyle = ""
      if (fontSize) {
        fontstyle = ' style="font-size: ' + fontSize + 'px;"'
      }
      let theme = this.$vuetify.theme.isDark ? 'theme--dark' : 'theme--light'
      return '<i aria-hidden="true" class="v-icon notranslate mdi ' + iconname + ' ' + theme + '"' + fontstyle + '></i>'
    },

    focusOnInput() {
      console.log('call focus')
      this.$nextTick(() => {
        console.log("focusOnImput started.");
        this.$refs.globalSearchInput && this.$refs.globalSearchInput.focus()
        console.log('ref: ', this.$refs.globalSearchInput.$el)
        console.log('active: ', document.activeElement)
      });

    },


    countAndSubmit(e) {
      if (e.location !== 0 || e.code.startsWith('Arrow') || e.code === "Insert" || e.code === "CapsLock" || e.code === "PageUp"  || e.code === "PageDown" || e.code === "End"  || e.code === "Home" || e.code.startsWith('F')) {
        return
      }
      if (this.searchtext && this.searchtext.length > 2 ) {
        this.waitForChanges(this.searchtext)
      } else {
        this.results = []
        this.totalResults = 0
        this.showResults = false
      }
    },
    waitForChanges(search) {
      let cancel = false
      const max = 10
      const millisec = 50
      let self = this
      let i = 0
      let timeid = setInterval( () => {
        if (self.searchtext !== search) {
          console.log('cancel', i)
          cancel = true
          i = max - 1
          clearInterval(timeid)
        }
        if (i === max - 1 && !cancel) {
          console.log('submit')
          clearInterval(timeid)
          self.formSubmit(0)
        }
        i++
      }
        , millisec)
    },
    formSubmit(batch) {
      if (this.searchtext) {
        this.start = 0
        this.cancelToken && this.cancelToken.cancel('Search canceled by new search');
        this.cancelToken = CancelToken.source()
        var params = {}
        params["searchtext"] = this.searchtext
        params["batchStart"] = batch
        this.loading = true
        searchRoot(params, this.$store.state.mapping)
          .then( res => {
            this.totalres = res.data.hits.total.value;
            console.log(this.totalres);
            console.log("recieved result.", res.data.hits.total.value)
            this.results = res.data.hits.hits
            console.log(res);
            this.totalResults = res.data.hits.total.value
            this.showResults = true
            this.loading = false

            console.log("search finished.");
            this.$store.commit('setResults', res.data.hits.hits)
            this.$matomo && this.$matomo.trackSiteSearch(this.$store.state.searchtext, 'global', this.totalResults)
          }).catch(function (error) {
            console.log(error)
            return null
          })
      }
    },

    loadPrevious() {
      this.searchPack -= 10
      this.formSubmit(this.searchPack)
    },

    loadNext() {
      this.searchPack += 10
      this.formSubmit(this.searchPack)
    },

    keyHandler(event) {
      if (event.code === "PageDown" && this.showResults) {
        event.preventDefault()
        this.loadNext()
      }
      if (event.code === "PageUp" && this.showResults) {
        event.preventDefault()
        this.loadPrevious()
      }

    }


  },

  mounted() {

    window.addEventListener("keydown", this.keyHandler );
    if (this.searchtext){
      if (this.searchtext.length > 2){
        this.formSubmit(0)
      }
    }

  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyHandler );
  }


}
</script>


<style lang="css" scoped>

.v-menu__content {
  top: 56px !important;
  max-width: 100%;
}

.va-search.dense .v-menu__content {
  top: 44px !important;
  max-width: 200px;
}

.resultMenu .v-list-item__title {
 white-space: normal;
 font-size: 0.9em;
}

.resultMenu {
   max-height: 300px;
}

.resultMenu .v-list-item__action {
  margin: 0px !important;
 padding: 4px;
}

.btn-key-hint  {
  font-size: 10px;
  margin-top: -10px;
  text-align: center;
  text-transform: uppercase;
}

.va-portal >>> .legend-icon {
  width: 150px;
}



</style>

<style lang="css">

.va-key-symbol {
  font-size: 0.85em;
}
.v-list-item__subtitle {
  white-space: break-spaces;
}
.reducedPaddingTop .va-key-symbol {
  padding-top: 2px !important;
}

</style>