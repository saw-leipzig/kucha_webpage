<template>
<div>
    <v-expansion-panels Focusable popout>
        <v-expansion-panel
        v-for="(item,i) in relatedItems"
        :key="i"
        >
        <v-expansion-panel-header>
            <div  v-html="getTitle(item)"></div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <depictionInf v-if="item.depictionID" :depiction="item" :presentCave="presentCave"></depictionInf>
            <caveInf v-if="item.caveID" :cave="item" ></caveInf>
            <bibliographyInf v-if="item.annotatedBibliographyID" :bibliography="item" ></bibliographyInf>
            <iconographyInf v-if="item.iconogrpahyID" :iconography="item" ></iconographyInf>
        </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</div>
</template>
<script>
import {getBibTitle, getCaveLabel, getDepictionLabel} from  "@/utils/helpers"
import caveInf from '@/components/caveInf'
import depictionInf from '@/components/depictionInf'
import iconographyInf from '@/components/iconographyInf'
import bibliographyInf from '@/components/bibliographyInf'

export default {
  name: 'relatedItems',
  props: {
    relatedItems: {},
    presentCave:{
      type: Boolean,
      default: false
    }
  },
  components: {
    "depictionInf":depictionInf,
    iconographyInf,
    bibliographyInf,
    caveInf,
  },

  data () {
    return {
      showAddInf: false,
      showAnno: false,
      tab:[],
      viewerImg:{}
    }
  },
  computed: {
  },
  methods: {
    getTitle(item){
      console.log(item);
      if (item.depictionID) {
        return getDepictionLabel(item, this.$store.state.dic.wallLocation)
      } else if (item.caveID) {
        return "cave " + getCaveLabel(item)
      } else if (item.iconographyID) {
        return "Iconography Entry " + item.iconographyID + " (" + item.text + ")"
      } else if (item.annotatedBibliographyID) {
        return getBibTitle(item)
      } else {
        return "unknown item"
      }
    }
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
