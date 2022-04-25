<template>
  <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
      <v-card-title class="text-h3" raised width="98%" style="margin: auto;padding-bottom: 15px;">Discussion Forum on Dating Issues</v-card-title>
      <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
        <Foruminf @getComments="getComments()" :discussions="discussions"></Foruminf>
      </v-card>
  </v-card>
</template>

<script>
import {getComments} from '@/services/repository'
import Foruminf from '../components/foruminf.vue';

export default {
  components: {
    Foruminf
  },
  name: 'forum',
  data () {
    return {
      discussions: [],
    }
  },
  computed:{
  },
  methods: {
    getComments(){
      getComments()
        .then( res => {
          console.log("Discussions", res.data.hits.hits);
          this.discussions = res.data.hits.hits
          this.discussions.sort(function(a, b){return b._source.latestUpdate - a._source.latestUpdate})
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
  mounted:function () {
    this.getComments()
  },
}

</script>

<style></style>
