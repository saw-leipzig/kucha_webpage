<template>
  <div>
    <div style="position: relative;">
      <v-carousel :height="$vuetify.breakpoint.smAndDown? '300' : '500'" hide-delimiters :cycle="true" :show-arrows="false" touchless class="home_carousel">
        <v-carousel-item
          v-for="(item,i) in items"
          :key="i"
          :src="item.src"
        >
        </v-carousel-item>
      </v-carousel>
      <v-overlay class="searchOverlay" :absolute=true :value="true" z-index="4" style="touch-action: initial" opacity=0.0>
        <va-global-search :xlarge="true"></va-global-search>
      </v-overlay>
    </div>
  </div>
</template>

<script>
import GlobalSearch  from '@/components/GlobalSearch';
export default {
  name: 'search',
  components: {
    'va-global-search': GlobalSearch
  },
  data () {
    return {
      items: [
        {
          src: require('@/pics/backgroundKIS.jpg'),
        },
        {
          src: require('@/pics/1.png'),
        },
        {
          src: require('@/pics/2.png'),
        },
      ],
    }
  },
}
</script>

<style lang="css">
.field-required label:after {
  content: '*';
}
.btn-delete {
  background-color: #fff;
  margin: 0 auto;
  left: 0;
  right: 0;
}
</style>
