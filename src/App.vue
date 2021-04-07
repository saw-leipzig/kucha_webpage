<template>
    <v-app :class="{'mobileSmall': $vuetify.breakpoint.smAndDown, 'mobileExtraSmall': $vuetify.breakpoint.xs}" >

    <v-app-bar
      app
      color="primary"
      dark
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="navigation = !navigation"></v-app-bar-nav-icon>
      <v-toolbar-title>Kucha Information System</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer
      v-model="navigation"
      :mini-variant="mini"
      app
      clipped
      bottom
      floating
    >
      <v-list>
        <v-subheader class="px-2">
          <v-list-item-title
            v-if="!mini"
            class="pl-3"
          >Navigation</v-list-item-title>
          <v-btn
            icon
            @click.stop="mini = !mini"
          >
            <v-icon v-if="mini">mdi-chevron-right</v-icon>
            <v-icon v-else>mdi-chevron-left</v-icon>
          </v-btn>
        </v-subheader>
        <v-list-item
          class="px-2"
          to="/"

        >
          <v-list-item-avatar>
            <v-icon>mdi-home</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>
           Home
          </v-list-item-title>
        </v-list-item>
        <v-list-group
            sub-group
            :value="true"
            prepend-icon="mdi-filter"
          >
            <template v-slot:activator>
              <v-list-item-title class="text-wrap" >Advanced Search</v-list-item-title>
            </template>
         <v-list-item to="/cave">
            <v-list-item-icon>
              <v-icon >mdi-image-filter-hdr</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Cave</v-list-item-title>

          </v-list-item>
         <v-list-item to="/depiction">
            <v-list-item-icon>
              <v-icon >mdi-image-search</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Painted Representation</v-list-item-title>

          </v-list-item>
         <v-list-item to="/bibliography">
            <v-list-item-icon>
              <v-icon >mdi-book-open-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Annotated Bibliography</v-list-item-title>

          </v-list-item>
         <v-list-item to="/iconography">
            <v-list-item-icon>
              <v-icon >mdi-map-marker-path</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-wrap" v-html="'Pictorial Elements/ Iconography'" ></v-list-item-title>

          </v-list-item>
        </v-list-group>

        <v-list-item
          class="px-2"
          href="https://www.saw-leipzig.de/de/projekte/wissenschaftliche-bearbeitung-der-buddhistischen-hoehlenmalereien-in-der-kucha-region-der-noerdlichen-seidenstrasse/intro"
        >
          <v-list-item-avatar>
            <v-icon>mdi-information</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>
            About
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          class="px-2"
          disabled
        >
          <v-list-item-avatar>
            <v-icon>mdi-security</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>
            Privacy
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
    </v-navigation-drawer>

    <v-main>
      <router-view/>

    </v-main>

  </v-app>

</template>

<script>

import {logo} from '@/utils/constants'


export default {
  name: 'App',
  data () {
    return {
      show: false,
      drawer: null,
      navigation: true,
      mini: false,
      query: '',
      logo: logo,
      snackbar: {
        show: false,
        text:'test',
        type: this.HINT
      },
      appBarExtension: false,
      accept_tracking: true,
    }
  },
  created() {
  },
  components: {
  },
  methods: {

  },
  beforeMount:function () {
    console.log("Initialize Dictionaries");
    this.$store.dispatch('getMapping')
    this.$store.dispatch('getDics')
    console.log("Iconography:", this.$store.state.dic.iconography);
  }
}
</script>

<style lang="css">

.v-tab {
  padding: 8px;
  min-width: 20px;
}
.v-treeview-node__content, .v-treeview-node__label {
  flex-shrink: 1;
  word-break: break-all;
  min-height: 10px;
}
.v-treeview-node__root {
  height: auto; min-height: 10px;
}
.v-treeview-node {
  min-height: 10px;
}
.v-treeview--dense .v-treeview-node__root
{
  min-height: 10px;
}
.v-application--is-ltr .v-list-group--sub-group .v-list-group__header
{
  padding-left: 16px;
}
</style>
