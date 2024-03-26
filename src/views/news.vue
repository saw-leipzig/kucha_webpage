<template>
<div style="width:100%">
    <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
      <v-breadcrumbs
        :items="$store.state.breadcrumb"
      >
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item
            :href="item.href"
            :disabled="item.disabled"
          >
            <span style="color: black;">
              {{item.text}}
            </span>
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-card-title class="text-h2" raised width="98%" style="margin: auto;padding-bottom: 15px;">News</v-card-title>
        <v-expansion-panels class="mx-5 pr-10 py-5" v-model="panel" v-if="$store.state.user.accessLevel === 4 ">
          <v-expansion-panel  >
            <v-expansion-panel-header>
              Create News
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card class raised width="98%" style="margin: auto;padding-bottom: 15px;">
                <v-card-title class="text-5" raised width="98%" style="margin: auto;padding-bottom: 15px;">Expiring Date <v-btn x-small icon color="green"  @click="helpElements=!helpElements"><v-icon>mdi-help</v-icon></v-btn></v-card-title>
                <v-row class="mx-5">
                  <v-col>
                    <v-checkbox
                      v-model="isExpiring"
                    >
                      <template class="mb-0" v-slot:label>
                        <div class="mb-0">
                        Is expiring
                        </div>
                      </template>

                    </v-checkbox>
                  </v-col>
                  <v-col>
                    <v-checkbox
                      label="Unpublished"
                      v-model="unpublished"
                    >
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row v-if="isExpiring">
                  <v-col>
                    <v-date-picker
                      v-model="expiresString"
                      landscape
                    ></v-date-picker>
                  </v-col>
                </v-row>
                <v-card-title class="text-5" raised width="98%" style="margin: auto;padding-bottom: 15px;">Information<v-btn x-small icon color="green"  @click="helpElements=!helpElements"><v-icon>mdi-help</v-icon></v-btn></v-card-title>
                <v-card-title>Title</v-card-title>
                <v-text-field v-model="newsTitle" class="mx-5"></v-text-field>
                <v-card-title>News Body</v-card-title>
                <trumbowyg
                  ref="editorForum"  class="mx-5" v-model="newsBody" @update="textChangedNews"
                />

                <v-col>
                  <v-btn @click="postNewthread" :loading="posting" dense block color="success">Submit</v-btn>
                </v-col>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
    <div v-for="(item, index) in news" v-bind:key="index">
      <newsinf @publish="getNews(Date.now(), false, $store.state.user.accessLevel === 4)" :news="item"></newsinf>
      </div>
      </v-card>
    </div>
</template>
<script>
import newsinf from '@/components/newsinf.vue'
import {putNews, getNews, publish} from '@/services/repository'
import { v4 as uuidv4 } from 'uuid'
import trumbowyg from '@/components/trumbowyg.vue'

export default {
  name: 'News',
  components: {
    trumbowyg,
    newsinf
  },

  data () {
    return {
      news:[],
      panel:false,
      isExpiring:false,
      unpublished:true,
      expireDate: Date.now(),
      newsTitle:"",
      newsBody:"",
      posting:false,

      topicTitleEdited:"",
      isUnpublished:false,
      editedText:"",
      unpublishedAlert:false
    }
  },
  computed: {
    expiresString:{
      get: function(){
        return new Date(this.expireDate).toISOString().substr(0, 10)
      },
      set: function(newValue){
        this.expireDate = Date.parse(newValue)
      }
    },
  },
  methods: {
    publish(item){
      publish(item)
        .then( res => {
          const _self = this
          setTimeout(function () {
            _self.getNews(Date.now(), false, _self.$store.state.user.accessLevel === 4)
            _self.posting = false
            _self.clearForm()
          }, 2000);
        })
        .catch((error) => {
          this.$log.debug(error)
        })

    },
    postNewthread(){
      this.posting = true
      const now = Date.now();
      var data = {
        "user": this.$store.state.user.lastname + ", " + this.$store.state.user.firstname,
        "userID": this.$store.state.user.userID,
        "title": this.newsTitle,
        "body": this.newsBody,
        "date": now,
        "isExpiring": this.isExpiring,
        "expires": Date.parse(this.expireDate),
        "isUnpublished": true,
      }
      console.log(this.newsBody);
      putNews(data, uuidv4(), false, this.$store.state.user.sessionID)
        .then( res => {
          const _self = this
          setTimeout(function () {
            _self.getNews(Date.now(), false, _self.$store.state.user.accessLevel === 4)
            _self.posting = false
            _self.clearForm()
          }, 2000);
        })
        .catch((error) => {
          this.$log.debug(error)
        })
    },
    clearForm(){
      this.topicTitle = ""
      this.newsBody = ""
      this.isExpiring = false
      this.isUnpublished = false
      this.panel = false
    },

    textChangedNews(body){
      this.newsBody = body
    },
    getNews(date){
      getNews(date, false, this.$store.state.user.accessLevel === 4)
        .then( res => {
          this.news = res.data.hits.hits
          // news.sort(function(a, b){return b._source.latestUpdate - a._source.latestUpdate})
          console.log("news", this.news);
        })
        .catch((error) => {
          this.$log.debug(error)
        })
    },



  },
  watch: {
    expireDate(newVal, OldVal){
      console.log(newVal);
    }
  },
  mounted:function () {
    this.getNews(Date.now(), false, this.$store.state.user.accessLevel === 4)
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
  label {
    margin-bottom: 0rem;
  }
</style>
