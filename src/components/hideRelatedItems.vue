<template>
    <div>
        <v-card-actions >
        <v-btn
            color="orange lighten-2"
            text
            @click="showRelatedItems = !showRelatedItems"
        >
            {{title}}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
            icon
            @click="showRelatedItems = !showRelatedItems"
        >
            <v-icon>{{ showRelatedItems ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
        </v-card-actions>

        <v-expand-transition>
        <div v-show="showRelatedItems">
            <v-divider></v-divider>
                <relatedItems class="mx-5" :relatedItems="items" :presentCave="presentCave" :preselectedAnnotations="iconography"></relatedItems>
            </div>
        </v-expand-transition>
    </div>
</template>
<script>
import relatedItems from '../components/relatedItems.vue'

export default {
  name: 'hideRelatedItems',
  props: {
    items: {},
    title:"",
    presentCave:{
      type: Boolean,
      default: false
    },
    open:{
      type: Boolean,
      default: true
    },
    iconography:{
      type: Array,
      default: function(){
        return []
      }
    }
  },
  components: {
    relatedItems
  },
  data () {
    return {
      relatedDepictions:[],
      showRelatedItems:this.open
    }
  },
  computed:{
  },
  mounted:function () {
    this.$log.debug("conography is:", this.iconography);
  },
}
</script>
<style scoped>

</style>