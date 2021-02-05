<template>
    <v-form @submit.prevent="formSubmit" class="va-search d-flex align-center" :class="{'dense': dense}">
      <v-text-field
      id="global-search-input-field"
      ref="globalSearchInput"
      label="Search"
      clearable
      :autofocus="autofocus"
      :filled="filled"
      :outlined="outlined"
      :dense="dense"
      prepend-inner-icon="mdi-magnify"
      v-model="searchtext"
      @keyup="countAndSubmit"
      @focus="checkFocus"
      @click.stop="checkFocus"
      @mouseup.prevent
      @mousedown.prevent
      @click:clear.prevent="checkClear"
      v-on:keyup.enter="formSubmit"
      v-on:keyup.escape="checkClear"
      :persistent-hint="persistentHint"
      :hint="hint"
      :hide-details="hint == ''"
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
      @click.stop="formSubmit">
        <span v-if="$vuetify.breakpoint.smAndUp">Search</span>
        <v-icon v-else>mdi-magnify</v-icon>
      </v-btn>
      <v-menu attach activator="form.va-search" bottom light v-model="showResults" class="resultMenu" :close-on-content-click="true" :close-on-click="false">

        <v-list :dense="$vuetify.breakpoint.smAndDown">
          <v-subheader style="padding: 0px;" class="search-results-header">
            <v-list-item-action class="ml-n2">
                <v-btn icon v-on:click="loadPrevious" :disabled="!previousUrl">
                  <v-icon >mdi-arrow-left</v-icon>
                </v-btn>
            </v-list-item-action>
            <v-list-item-content class="text-center">
              <v-list-item-title class="grey--text">Showing Results</v-list-item-title>
              <v-list-item-subtitle>{{ 'Results for' + ': ' + searchtext}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <va-legend :legendItems="legendItems" :buttonProps="legendButtonProps" @dialog_closed="focusOnInput">
                <v-btn icon><v-icon>mdi-help</v-icon></v-btn>
              </va-legend>
            </v-list-item-action>
            <v-list-item-action>
                <v-btn icon v-on:click="loadNext" :disabled="!nextUrl">
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
            </v-list-item-action>
          </v-subheader>

          <v-list-item v-for="(item, index) in $store.state.results" :key="index" @click.native=setRes(index) :to="{ name: 'depiction', params: {result: item } }" two-line>
            <v-list-item-content>
              <v-list-item-title>{{ item._source.shortName }}</v-list-item-title>
              <v-list-item-subtitle>{{ item._source.description }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-form>

</template>

<script>
import { CancelToken } from "@/utils/httpClient";
import { createFrontendLink } from  "@/utils/urlHelper"
import { searchRoot } from '@/services/repository'
import { get } from "@/utils/httpClient";
import { portalTypesPub, portalTypesSources } from "@/utils/constants"
import Legend from '@/components/Legend'

export default {

  name: 'GlobalSearch',

  components: {
    'va-legend': Legend
  },

  props: {

    filled: {
      type: Boolean,
      default: false
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

      searchtext: '',
      results: Array,
      start: 0,
      showResults: false,
      totalResults: 0,
      cancelToken: null,
      previousUrl: '',
      nextUrl: '',
      loading: false
    }
  },

  computed: {
    allowedPortalTypes() {
      return ['person', 'location', 'organizational_unit', 'project', 'historic_event'].concat(portalTypesPub, portalTypesSources)
    },
    batchStart() {
      return this.start * this.b_size + Math.min(this.results.length, 1)
    },
    batchEnd() {
      return this.start * this.b_size + this.results.length
    },
    b_size() {
      return this.$vuetify.breakpoint.smAndUp? 10 : 4
    },
    legendButtonProps() {
       return { icon: true }
    },
    legendItems() {
      let legend = []
      let legendObject = {}
      legendObject.title = "Title"
    //  legendObject.description = this.$t('legend.result-list-decription')
      legendObject.items = [];
      legendObject.items.push( { vhtml: this.buildLegendIcon(this.getHtmlIcon('mdi-menu-up')), description:"description" , itemClasses: "reducedPaddingTop" })
      legendObject.items.push( { vhtml: this.buildLegendIcon(this.getHtmlIcon('mdi-menu-down')), description: "description", itemClasses: "reducedPaddingTop"  })
      legendObject.items.push( { vhtml:  this.buildLegendIcon(this.getHtmlIcon('mdi-keyboard-return', 14)) , description: "" })
//      legendObject.items.push( { vhtml:  this.buildLegendIcon(this.$t('legend.result-list-page-key') +this.getHtmlIcon('mdi-arrow-up', 14)) , description: this.$t('legend.result-list-prev') })
//      legendObject.items.push( { vhtml: this.buildLegendIcon(this.$t('legend.result-list-page-key') + this.getHtmlIcon('mdi-arrow-down', 14)), description: this.$t('legend.result-list-next'), itemProps: { style: ''}, itemClasses: "page-down-symbol"  })
//       legendObject.items.push( { vhtml: this.buildLegendIcon('ESC'), description: this.$t('legend.result-list-escape'), itemProps: { style: ''}, itemClasses: "page-down-symbol"  })

      let legendAccessKey = {}
//      legendAccessKey.title = this.$t('legend.result-list-access-headline')
//      legendAccessKey.description = this.$t('legend.result-list-access-description')
      legendAccessKey.items = [];
//       legendAccessKey.items.push( { vhtml: this.buildLegendIcon('f'), description: this.$t('legend.result-list-access-key') })

      legend.push({ block: [legendObject ], width: 60 })
      legend.push({ block: [ legendAccessKey ], width: 60 })
      return legend
    },

  },

  methods: {
    createFrontendLink: createFrontendLink,

    checkFocus(e) {
      console.log('focused')
      if (document.activeElement == e.target && !this.showResults && this.searchtext && this.searchtext.length>2) {
        this.showResults = true
      }
    },
    setRes(res){
      console.log("setRes started")
      console.log('Setting result to',res);
      this.$store.commit('setResult',res)
    },
    checkClear() {
      this.searchtext = '';
      this.showResults = false;
    },

    buildLegendIcon(text) {
      return '<div class="va-key-symbol" style="border: 1px solid black; width: 48px; height: 28px; padding: 4px; text-align: center;">'+text+'</div>'
    },
    getHtmlIcon(iconname, fontSize) {
      let fontstyle=""
      if (fontSize) {
        fontstyle = ' style="font-size: '+fontSize+'px;"'
      }
      let theme = this.$vuetify.theme.isDark? 'theme--dark' : 'theme--light'
      return '<i aria-hidden="true" class="v-icon notranslate mdi '+iconname + ' ' + theme + '"' + fontstyle+'></i>'
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

        if(e.location != 0 || e.code.startsWith('Arrow') || e.code=="Insert" || e.code=="CapsLock" || e.code=="PageUp"  || e.code=="PageDown" || e.code=="End"  || e.code=="Home" || e.code.startsWith('F')) {
          return
        }


      if(this.searchtext && this.searchtext.length>2 ) {
        this.waitForChanges(this.searchtext)
      }
      else {
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
       // self.$log.debug('searchtest', timeid, self.searchtext, search)
        if(self.searchtext != search) {
          console.log('cancel', i)
          cancel = true
          i = max-1
          clearInterval(timeid)
        }
        if (i == max-1 && !cancel) {
          console.log('submit')
           clearInterval(timeid)
          self.formSubmit()

        }
        i++
      }
      , millisec)

    },

    formSubmit() {
      console.log("Blub")
      if(this.searchtext) {
        this.start = 0
        this.cancelToken && this.cancelToken.cancel('Search canceled by new search');
        this.cancelToken = CancelToken.source()
        var params = this.searchtext
        this.loading = true
        searchRoot(params, this.cancelToken)
        .then( res => {
          console.log("recieved result.",res)
          this.results = res.data.hits.hits
          console.log(res);
//          this.previousUrl = res.data.batching? res.data.batching.prev : null
//          this.nextUrl = res.data.batching? res.data.batching.next : null
          this.totalResults = res.data.hits.total.value
          this.showResults = true
          this.loading = false
          console.log("search finished.");
          this.$store.commit('setResults',res.data.hits.hits)
        this.$matomo && this.$matomo.trackSiteSearch(this.searchtext, 'global', this.totalResults)
        }).catch(function (error) {
      console.log(error)
      return null
    })
      }
    },

    loadPrevious() {
      if(this.previousUrl) {
        this.loading = true
        get(this.previousUrl)
         .then( res => {
            this.results = res.data.items
            this.previousUrl = res.data.batching? res.data.batching.prev : null
            this.nextUrl = res.data.batching? res.data.batching.next : null
            this.totalResults = res.data.items_total
            this.showResults = true
            this.start-=1
            this.loading = false
          })
      }
    },

    loadNext() {
      if(this.nextUrl) {
        this.loading = true
        get(this.nextUrl)
         .then( res => {
            this.results = res.data.items
            this.previousUrl = res.data.batching? res.data.batching.prev : null
            this.nextUrl = res.data.batching? res.data.batching.next : null
            this.totalResults = res.data.items_total
            this.showResults = true
            this.start+=1
            this.loading = false
          })
       }
    },

    keyHandler(event) {
      if(event.code == "PageDown" && this.showResults) {
        event.preventDefault()
        this.loadNext()
      }
       if(event.code == "PageUp" && this.showResults) {
        event.preventDefault()
        this.loadPrevious()
      }

    }


  },

  mounted() {

    window.addEventListener("keydown", this.keyHandler );
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
  max-width: 100%;
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

.reducedPaddingTop .va-key-symbol {
  padding-top: 2px !important;
}

</style>