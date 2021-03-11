<template>
<div class="d-flex align-center">
  <div class="legend-icon flex-shrink-0" :style="distance? 'width: '+distance+'px;' : ''" >
    <slot name="icon">
      <v-avatar v-if="svgName" class="legend-avatar">
      </v-avatar>
      <v-avatar v-else-if="imgSrc" class="legend-avatar">
        <v-img :src="imgSrc" height="25px" width="25px" contain v-bind="itemProps" :class="itemClasses"></v-img>
      </v-avatar>
      <v-avatar v-else-if="icon" class="legend-avatar">
        <v-icon v-bind="itemProps" :class="itemClasses">{{icon}}</v-icon>
      </v-avatar>
      <div v-else-if="vhtml" class="legend-avatar-html" v-bind="itemProps" v-html="vhtml" :class="itemClasses">

      </div>
    </slot>
  </div>
  <div class="legend-description flex-shrink-1">
    <slot name="description">
      {{ description }}
    </slot>
  </div>
</div>
</template>

<script>


export default {

  name: 'LegendItem',

  props: {
    svgName: String,
    imgSrc: String,
    icon: String,
    vhtml: String,
    description: String,
    itemProps: {},
    itemClasses: String,
    distance: Number
  },

  components: {
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>

.legend-avatar {
  height: 32px !important;
  min-width: 32px !important;
  width: 32px !important;
}

.legend-avatar-html {
  height: 32px !important;
  min-width: 32px !important;
  width: 100%;
}
</style>