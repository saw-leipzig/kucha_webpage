<template>
    <v-app >
      <div class="bg" style="height:100%;display:flex;flex-direction:column">
        <v-app-bar
          app
          color="green darken-4"
          leight
          clipped-left
          height="5px"
        >
        </v-app-bar>
        <div style="flex:1">
      <template style="display:flex;flex-direction:column;flex:1">
        <v-btn
          v-if="showMenuButton"
          class="mx-2 mb-5"
          fab
          dark
          right
          top
          fixed
          color="primary"
            @click.stop="ChangeShowMenu()"
        >
          <v-icon dark>
            mdi-menu
          </v-icon>
        </v-btn>
        <v-navigation-drawer
          v-model="showMenu"
          :hide-overlay = true
          :permanent = "(!$vuetify.breakpoint.smAndDown && showMenu)"
          :mini-variant="mini"
          app
          :ripple="false" class="mb-10"
          :width="mini ? '56': '100'"
          :style="mini ? 'background-color: rgba(255, 255, 255, 0.7) !important;' : 'background-color: rgba(255, 255, 255, 0.9) !important'"
        >
          <v-list>
            <v-subheader style="height:30px">
              <v-btn v-if="!$vuetify.breakpoint.smAndDown"
                icon
                absolute
                @click.stop="mini = !mini"
              >
                <v-icon v-if="mini">mdi-chevron-right</v-icon>
                <v-icon v-else>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn v-if="$vuetify.breakpoint.smAndDown"
                icon
                absolute
                @click.stop="ChangeShowMenu()"
              >
                <v-icon >mdi-chevron-left</v-icon>
              </v-btn>
            </v-subheader>
            <v-list-item
            class="px-0"
              to="/"
              style="padding:0 0px!important">
              <v-list-item style="padding:0 0px" :ripple="false" >
                <v-list-item-icon :style="mini ? 'min-width: 10%;' : 'min-width: 100px;'">
                  <iconHome :width="mini ? '56px' : 100" :height="mini ? '55px' : 100"></iconHome>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item>
            <v-list-item
            class="px-0"
            to="/tour"
            style="padding:0 0px!important">
            <v-list-item to="/tour" style="padding:0 0px" :ripple="false">
                <v-list-item-icon :style="mini ? 'min-width: 55px;' : 'min-width: 100px;'">
                  <iconTour :width="mini ? 56 : 100" :height="mini ? '55px' : 100"></iconTour>
                </v-list-item-icon>
              </v-list-item>

              </v-list-item>

              <v-list-item to="/search" style="padding:0 0px" :ripple="false">
                <iconFilter :width="mini ? '55px' : 100" :height="mini ? '55px' : 100"></iconFilter>
              </v-list-item>
            <v-list-item to="/cave" style="padding:0 0px" :ripple="false">
                <v-list-item-icon :style="mini ? 'min-width: 56px;' : 'min-width: 100px;'">
                  <iconCave :width="mini ? '55px' : 100" :height="mini ? '55px' : 100"></iconCave>
                </v-list-item-icon>
              </v-list-item>
            <v-list-item to="/pr" style="padding:0 0px" :ripple="false">
                <v-list-item-icon :style="mini ? 'min-width: 56px;' : 'min-width: 100px;'">
                  <iconPaintedRepresentation :width="mini ? '55px' : 100" :height="mini ? '55px' : 100" ></iconPaintedRepresentation>
                </v-list-item-icon>
              </v-list-item>
            <v-list-item to="/bibliography" style="padding:0 0px" :ripple="false">
                <v-list-item-icon :style="mini ? 'min-width: 56px;' : 'min-width: 100px;'">
                  <iconBibliography :width="mini ? '55px' : 100" :height="mini ? '55px' : 100" ></iconBibliography>
                </v-list-item-icon>
              </v-list-item>
            <v-list-item to="/iconography" style="padding:0 0px" :ripple="false">
                <v-list-item-icon :style="mini ? 'min-width: 56px;' : 'min-width: 100px;'">
                  <iconIconography :width="mini ? '55px' : 100" :height="mini ? '55px' : 100" ></iconIconography>
                </v-list-item-icon>
              </v-list-item>
            <v-list-item to="/about" style="padding:0 0px!important" :ripple="false">
                <v-list-item-icon title="About"  :style="mini ? 'min-width: 56px;' : 'min-width: 100px;'">
                  <iconAbout :width="mini ? 56 : 100" :height="mini ? 56 : 100" ></iconAbout>
                  <title>About the Database</title>
                </v-list-item-icon>
            </v-list-item>
            <v-list-item v-if="true" style="padding:0 0px!important" :ripple="false"
              class="px-2"
              to="/forum"
            >
                <v-list-item-icon :style="mini ? 'min-width: 56px;min-height: 56px;' : 'min-width: 100px;min-height: 100px;'">
                  <iconDiscussion :width="mini ? 56 : 100" :height="mini ? 56 : 100" ></iconDiscussion>
                  <title>Discussion Forum</title>
                </v-list-item-icon>
            </v-list-item>
            <v-list-item to="/impressum" style="padding:0 0px!important" :ripple="false"
              class="px-2"
            >
                <v-list-item-icon :style="mini ? 'min-width: 56px;' : 'min-width: 100px;'">
                  <iconImpressum :width="mini ? 56 : 100" :height="mini ? 56 : 100" ></iconImpressum>
                </v-list-item-icon>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
        </v-navigation-drawer>
      </template>
    <v-main >
      <v-dialog width="500" v-model="isTestVersion">
          <v-card title="Test Phase Ended">
            <v-card-title>Thes Pahse Ended!</v-card-title>
            <v-card-text>
              The Kucha Murals Information System is not in test phase anymore, you can find the official page here: <a href="https://kucha.saw-leipzig.de">https://kucha.saw-leipzig.de</a>.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" block target="_self" href="https://kucha.saw-leipzig.de">Go To</v-btn>
            </v-card-actions>
            <v-card-actions class="my-0 py-0">
              <v-btn density="compact" class="my-0 py-0" style="color:hsla(0,0%,100%,.9)!important;caret-color:hsla(0,0%,100%,.9)!important; " plain color="white"  block @click="isTestVersion = false"></v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>
      <v-row no-gutters justify="center" style="flex:1 mx-0" >
        <v-col no-gutters class="d-flex mt-1 mx-0 flex-column align-self-stretch flex-grow-1">
          <router-view></router-view>
        </v-col>
      </v-row>
    </v-main>
    </div>
    <v-footer
      :app="$vuetify.breakpoint.mdAndUp"
      color="black"
      height="80px"
      style="border-top:10px solid rgba(60, 179, 113,0.55) !important;background-clip: padding-box!important;"
    >
      <v-row no-gutters style="height:100%">
        <v-col cols="8">
          <div content style="font-size: 0.8rem;color:white;position: absolute;left: 20px; text-align: left;" v-html="getFooter"> </div>
        </v-col>
        <v-col cols="4" class="text-right">
          <v-layout warp class="justify-end">
            <div class="logo text-right" v-html="logo" style="color:white;"></div>
            <LoginComponent v-if="!$store.state.user.sessionID" />
            <usermanager v-if="$store.state.user.sessionID" />
          </v-layout>
        </v-col>
      </v-row>
    </v-footer>
    </div>
  </v-app>

</template>

<script>
import {logo, logoSmwk} from '@/utils/constants'
import iconCave from '@/components/icons/iconCave'
import iconPaintedRepresentation from '@/components/icons/iconPaintedRepresentation'
import iconBibliography from '@/components/icons/iconBibliography'
import iconHome from '@/components/icons/iconHome'
import iconIconography from '@/components/icons/iconIconography'
import iconAbout from '@/components/icons/iconAbout'
import iconImpressum from '@/components/icons/iconImpressum'
import iconFilter from '@/components/icons/iconFilter'
import iconTour from '@/components/icons/iconTour'
import iconDiscussion from '@/components/icons/iconDiscussion'
import LoginComponent from '@/components/LoginDialog'
import usermanager from '@/components/usermanager'
import {isLoggedIn} from '@/services/repository'

export default {
  name: 'App',
  data () {
    return {
      isTestVersion: false,
      route: window.location.hash,
      show: false,
      drawer: null,
      navigation: true,
      mini: true,
      query: '',
      logo: logo,
      logoSmwk: logoSmwk,
      showMenuButton: false
    }
  },
  created() {
  },
  components: {
    usermanager,
    LoginComponent,
    iconCave,
    iconPaintedRepresentation,
    iconBibliography,
    iconHome,
    iconIconography,
    iconAbout,
    iconImpressum,
    iconFilter,
    iconTour,
    iconDiscussion
  },
  computed:{
    breakpoint(){
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTopPage(){
      console.log();
      if (location.href.toLowerCase().includes("news") || location.href.toLowerCase().includes("home") || location.href.toLowerCase().includes("login")){
        console.log("istoppage");
        return false
      } else {
        return true
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
    breadcrumb:{
      get: function(){
        return this.$store.state.breadcrumb;
      },
      set: function (newValue){
        this.$store.commit("setBreadcrumb", newValue)
      }
    },
    checkLandscape(){
      console.log("is Landscape:", this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height);
      return this.$vuetify.breakpoint.width > this.$vuetify.breakpoint.height
    },
    getFooter(){
      return !this.$vuetify.breakpoint.smAndDown ? "2023, version 0.8.1 <br>Note: We welcome any kind of user feedback, be it on practical matters concerning <br> the website or comments on and questions about the content. Please contact <a href='mailto:kuchaadmin@saw-leipzig.de'> admin </a>" : "2023,<br> version 0.0.1"
    }
  },
  methods: {
    hideOverlay(){
      console.log("hideOerlay", this.$vuetify.breakpoint.smAndDown);
      return !this.$vuetify.breakpoint.smAndDown
    },
    setChecked(item){
      item['checked'] = false
      for (let child of item.children){
        this.setChecked(child)
      }
    },
    ChangeShowMenu(){
      this.showMenu = !this.showMenu
    },
    breakpointChanched(){
      if (!this.$vuetify.breakpoint.smAndDown){
        this.showMenuButton = false
      } else {
        if (location.pathname.toLowerCase().includes("news") || location.pathname.toLowerCase() === "/"){
          this.showMenuButton = false
        } else {
          console.log("breakpoint changed, no starting page, changing showMenuButton from", this.showMenuButton, " to:", !this.showMenu);
          this.showMenuButton = !this.showMenu
        }
      }

    }

  },
  beforeMount:function () {
    if (this.$store.state.user.sessionID){
      if (this.$store.state.user.sessionID !== "") {
        isLoggedIn(this.$store.state.user.sessionID)
          .then((res) => {
            console.log("User still logged!", res.data);
            this.$store.commit("setUser", res.data)
          })
          .catch((err) => {
            console.log("error!", err.response);
            this.$store.commit("setUser", {})
          })
      }
    }
    this.$store.dispatch('getIconography')
    if (this.$store.state.wallLocation.length === 0){
      this.$store.dispatch('getWallLocation')
    }
    this.$store.dispatch('getMapping')
    this.$store.dispatch('getDiscussionMapping')
  },
  watch: {
    showMenu(newVal, oldVal){
      console.log("showmenu changed from:", newVal, " to: ", oldVal);
      this.breakpointChanched();
    },
    breakpoint(newVal, oldVal){
      console.log("this.$vuetify.breakpoint.smAndDown", this.$vuetify.breakpoint.smAndDown);
      if (newVal){
        this.showMenu = false;
      }
      this.breakpointChanched();
    }
  },
  mounted:function(){
    if (window.location.origin.includes("test")){
      this.isTestVersion = true;
    }
    if (this.$vuetify.breakpoint.smAndDown){
      this.navigation = false
      this.mini = false
    } else {
      this.mini = true
      this.navigation = true
    }
  },
}
</script>

<style lang="css">
::-webkit-scrollbar {
  width: 3px;
  height: 8px;
  background-color: transparent; /* or add it to the track */
}
::-webkit-scrollbar-thumb {
  background: transparent;
}

.v-list-item__icon {
  margin: 1px 0!important;
}
.v-list-item {
  padding: 0px!important;
}
.v-list-item {
  padding: 0 0px;
}
.v-tab {
  padding: 8px;
  min-width: 20px;
}
.v-sheet.v-card {
  background-color: rgba(255, 255, 255, 0.9) !important;
  padding-bottom: 25px;
}
.v-expansion-panel {
  background-color: rgba(255, 255, 255, 0.9) !important;
}
.v-main {
  height: 100%;
  word-break: break-word!important;

}
p {
  word-break: break-word!important;
}
element {
  word-break: break-word!important;
}
.theme--light.v-application {
    background: transparent!important;;
}
.v-list-group__header__prepend-icon{
  margin-top: 0;
  margin-bottom: 0;
}
.v-treeview-node__content, .v-treeview-node__label {
  flex-shrink: 1;
  word-break: break-word;
  min-height: 10px;
  text-align: left !important;
  white-space: break-spaces;

}
.v-navigation-drawer__content {
  height: 100%;
  scrollbar-width: thin;
  overflow-x: hidden!important;
  overflow-y: auto!important;
}
::-webkit-scrollbar {
    width: 2px;
    height: 6px;
}
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    -webkit-border-radius: 6px;
    border-radius: 6px;
}
/* Handle */
::-webkit-scrollbar-thumb {
    -webkit-border-radius: 6px;
    border-radius: 6px;
    background: rgb(173, 173, 173);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
}.v-treeview-node__root {
  height: auto; min-height: 10px;
}
.v-treeview-node {
  min-height: 10px;
}
.v-card__title{
      word-break: break-word!important;
}
.v-treeview--dense .v-treeview-node__root
{
  min-height: 10px;
}
.v-application--is-ltr .v-list-group--sub-group .v-list-group__header
{
  padding-left: 16px;
}
.v-expansion-panel-content__wrap{
  padding: 34px 16px;
}
.container{
  max-width: 80%;
}
body {
    background: url( '../static/backgroundKIS.jpg') no-repeat center center fixed;
    background-size: cover;
  }
.v-main__wrap {
    display: flex;
    flex-direction: column;
}
</style>