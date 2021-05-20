<template>
  <div>
    <div style="position: relative;">
      <v-overlay class="searchOverlay" :absolute=true :value="true" z-index="4" style="top:200px;touch-action: initial" opacity=0.0>
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
