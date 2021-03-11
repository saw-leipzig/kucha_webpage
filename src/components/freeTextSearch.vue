<template>
    <v-text-field
      id="global-search-input-field"
      ref="globalSearchInput"
      label="Free Textsearch"
      clearable
      :dense=false
      prepend-inner-icon="mdi-magnify"
      v-model="textSearch"
      @mouseup.prevent
      @mousedown.prevent
      @click:clear.prevent="checkClear"
      v-on:keyup.enter="startSearch"
      v-on:keyup.escape="checkClear"
      autocomplete="off"
      accesskey="f"
      >
      </v-text-field>
</template>
<script>

export default {
  name: 'freeTextSearch',
  components: {
  },
  props: {
  },
  data () {
    return {
      visible:true,
      relatedDepictions:[],
      loading: false,
      textSearch:"",
    }
  },
  computed: {
  },
  methods: {
    startSearch(){
      this.$emit('clicked', this.textSearch)
    },
    checkClear() {
      this.searchtext = '';
      this.showResults = false;
    },
  },
  watch: {
  },
  mounted:function () {
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
