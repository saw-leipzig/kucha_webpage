<template>
  <div>
    <v-tooltip left >
      <template v-slot:activator="{ on }">
        <v-btn
        v-bind="buttonProps"
        @click.stop="legendOverlay = !legendOverlay; $emit('clicked')"
        v-on="on"
        :class="buttonClasses"
        >
          <v-icon>mdi-information</v-icon>
       </v-btn>
      </template>
      <span>tooltip</span>
    </v-tooltip>

    <v-dialog v-model="legendOverlay" :width="$vuetify.breakpoint.xs? '100%' : $vuetify.breakpoint.sm? '70%':'50%'" >
      <v-card >
        <v-card-title primary-title>
           Legend
        </v-card-title>
         <v-card-text>
            <v-row v-for="(legendBlock, index) in allLegendItems" :key="index">
              <v-col v-for="legend in legendBlock.block" :key="legend.title">
                <v-subheader >{{ legend.title }}</v-subheader>
                <div class="va-legend-description align-center" v-if="legend.description" v-html="legend.description"></div>
                <va-legend-item v-for="legenditem in legend.items"
                :key="legenditem.description"
                :description="legenditem.description"
                :svgName="legenditem.svg"
                :imgSrc="legenditem.img"
                :icon="legenditem.icon"
                :vhtml="legenditem.vhtml"
                :itemProps="legenditem.itemProps"
                :itemClasses="legenditem.itemClasses"
                :distance="legendBlock.width"
                />
              </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions center>
           <v-spacer></v-spacer>

          <v-btn
          color="primary"
          fab
          center
          @click="legendOverlay = false"
          >
           <v-icon>mdi-close</v-icon>
          </v-btn>
           <v-spacer></v-spacer>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>


import LegendItem from '@/components/LegendItem'


export default {

  name: 'Legend',

  components: {
    'va-legend-item': LegendItem
  },

  props: {
    legendItems: Array,
    buttonProps: {},
    buttonClasses: String
  },


  data () {
    return {
      legendOverlay: false
    }
  },
  computed: {
    allLegendItems() {
      return this.legendItems
    },

  },
  methods: {

  },
  watch: {
    legendOverlay(nV, oV) {

      if (oV && !nV) {
        this.$emit("dialog_closed")
      }
    }
  }
}
</script>

<style lang="css" scoped>

.v-subheader {
  padding: 0;
  margin-bottom: 10px;
  height: unset;
}

.pub-dc-badge {
  font-weight: 500;
  font-size: 0.875em;
}

.va-legend-description {
  min-height: 32px;
  padding-top: 5px;
  font-style: italic;
}
</style>