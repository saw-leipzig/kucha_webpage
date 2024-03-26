<template>
  <div style="width:100%;height:100%;opacity:1;display:flex;">
    <div class="align-self-center flex-grow-1">
      <v-row >
        <v-col>
          <v-card  class="justify-center"   color="white" >
            <v-row class="mx-3">
              <v-col class="my-3" :cols="checkLandscape() ? 3:12" style="opacity:1;padding-bottom: 0px !important;" >
                <v-img style="opacity:1;margin: auto;" src="../static/kucha-logo 02.png"  :width="!checkLandscape()?'90vw':'30vw'" left contain></v-img>
              </v-col>
              <v-col v-if="checkLandscape()" cols="9" class="d-flex">
                <v-row class="d-flex justify-center" style="opacity:1;">
                  <v-card-title :class="getHeadingStyle" style="color:#67331e;font-size:3vw;" v-html="getHeading"></v-card-title>
                </v-row>
              </v-col>
              <v-fade-transition>
                <v-row no-gutters class="d-flex">
                  <v-col v-show="isSearch">
                    <div class="mt-2" :style="{opacity: isSearch ? '1': '0', transition: 'opacity 1s'}">
                      <v-row class="justify-center" align="center" >
                        <v-col>
                          <v-alert
                            v-model="alert"
                            border="left"
                            close-text="Close Alert"
                            color="red accent-4"
                            dark
                            dismissible
                          >
                            You encountered Problems while loading the Database. Please reload. If this alert is still shown, please contact: kuchaadmin@saw-leipzig.de
                          </v-alert>
                          <va-global-search v-if="!alert" :xlarge="true"></va-global-search>
                        </v-col>
                      </v-row>
                      <v-row :style="{width: $vuetify.breakpoint.smAndDown ? '100%' : '70%', margin:'auto'}" class="justify-center" align="center"  >
                        <v-col cols="6">
                          <v-btn class="px-5 my-5 "
                            dense block color="primary"
                            to="/tour"
                          >
                            {{$vuetify.breakpoint.smAndDown? "Tour" : "Virtual Tour"}}
                          </v-btn>
                        </v-col>
                        <v-col cols="6">
                          <v-btn class="px-5 my-5 "
                            dense block color="primary"
                            to="/about"
                          >
                            {{$vuetify.breakpoint.smAndDown? "Help" : "Instruction Video"}}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </v-fade-transition>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-3" no-gutters v-show="!isSearch">
        <v-col v-if="checkLandscape()" cols="1"></v-col>
        <v-col :cols="checkLandscape()?'11':'12'" class="justify-center" >
          <v-list rounded color="transparent" width="fit-content" :class="checkLandscape()?'justify-center': 'justify-center mx-auto'"  >
            <v-list-item-group
              v-model="selectedItem"
              color="primary"
            >
              <div
                v-for="(item, i) in items"
                :key="i"
              >
                <v-list-item
                  :to="item.to"
                >
                  <v-list-item-title class="mb-2 h2 font-weight-bold" style="margin-right:auto;margin-left:auto;color:#67331e;font-size:5vh;line-height:1.2;" v-text="item.text"></v-list-item-title>
                </v-list-item>
              </div>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import GlobalSearch  from '@/components/GlobalSearch';
import { searchRoot } from '@/services/repository'

export default {
  name: 'Home',
  props:{
    isSearch: false,
    navigation: false
  },
  components: {
    'va-global-search': GlobalSearch,
  },
  data(){
    return {
      expand: false,
      alert: false,
      selectedItem: null,
      items: {
        about:{
          text: "About the Project",
          to: "https://www.saw-leipzig.de/de/projekte/wissenschaftliche-bearbeitung-der-buddhistischen-hoehlenmalereien-in-der-kucha-region-der-noerdlichen-seidenstrasse/introduction/kucha-murals"
        },
        news: {
          text: "News",
          to: "/news"
        },
        publications: {
          text: "Publications",
          to: "https://www.saw-leipzig.de/de/projekte/wissenschaftliche-bearbeitung-der-buddhistischen-hoehlenmalereien-in-der-kucha-region-der-noerdlichen-seidenstrasse/publications"
        },
        database: {
          text: "Database",
          to: "/search"
        },
        impressum:{
          text: "Impressum",
          to: "/impressum"
        },
      }
    }
  },
  methods: {
    checkLandscape(){
      console.log("is Landscape:", this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height);
      return this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height
    },
  },
  computed: {
    getHeading(){
      if (this.isSearch){
        return "Kucha Murals Information System"
      } else {
        return "Buddhist Murals of Kucha <br> on the Northern Silk Road"
      }
    },
    showMenu:{
      get: function(){
        return this.$store.state.showMenu
      },
      set: function(newValue){
        this.$store.commit("setShowMenu", newValue)
      }
    },
    getHeadingStyle(){
      if (this.$vuetify.breakpoint.xs){
        return "h6 font-weight-bold align-center"
      } else if (this.$vuetify.breakpoint.sm){
        return "h6 font-weight-bold align-center"
      } else if (this.$vuetify.breakpoint.md){
        return "h1 font-weight-bold align-center"
      } else if (this.$vuetify.breakpoint.lg){
        return "h1 font-weight-bold align-center"
      } else if (this.$vuetify.breakpoint.xl){
        return "h1 font-weight-bold align-center"
      } else {
        return "h2 font-weight-bold align-center"
      }
    }
  },
  mounted:function() {
    var params = {}
    params["searchtext"] = ""
    params["batchStart"] = 0
    this.loading = true
    const _self = this
    searchRoot(params, this.$store.state.mapping)
      .then( res => {
        if (res.data.hits.total.value === 0){
          this.$log.debug("res", res);
        }
      }).catch(function (error) {
        _self.$log.debug(error)
        _self.alert = true;
        return null
      })

  },
  watch: {
    isSearch(newVal, oldVal){
      if (newVal !== this.showMenu){
        this.showMenu = newVal
      }
    }
  }
// dense block color="rgba(152, 189, 160,1)"
// to="/tour"
// style="border: 1px solid rgba(134, 88, 66,1);"
}

</script>
<style lang="css" scoped>

.statistic-card {
  height: 50%;
}
.v-sheet.v-card {
  background-color: rgba(255, 255, 255, 0.4) !important;
}
.v-card__title{
  word-break: break-word;
}
.flex{
  height:100%
}
.v-list-item{
  -webkit-box-align: center;
-ms-flex-align: center;
align-items: center;
display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-flex: 1;
-ms-flex: 1 1 100%;
flex: 1 1 100%;
letter-spacing: normal;
min-height: 4px;
outline: none;
padding: 0 16px;
position: relative;
text-decoration: none;
}

/*.mobileExtraSmall  .statistic-card {
  height: 150px;
}*/

</style>
