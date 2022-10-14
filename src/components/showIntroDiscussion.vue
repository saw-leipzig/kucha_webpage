<template>
  <div>
    <v-row class="ml-10 mr-5">
      <v-col cols="11">
        <v-card-title @click="showContent = !showContent">{{introDiscussion._source.title}}</v-card-title>
      </v-col>
      <v-col cols="1" class="d-flex justify-end">
        <v-btn
          icon
          @click="showContent = !showContent"
        >
          <v-icon>{{ showContent ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-expand-transition class="ml-10 mr-5">
    <v-card-text v-show="showContent" v-html="introDiscussion._source.body"></v-card-text>
    </v-expand-transition>
  </div>
</template>
<script>

export default {
  name: 'showIntroDiscussion',
  props: {
    introDiscussion: {}
  },
  components: {
  },
  data () {
    return {
      showContent:false
    }
  },
  computed:{
  },
  mounted:function () {
    this.$log.debug("dicussion:", this.introDiscussion)
  },
}
</script>
<style scoped>

</style>