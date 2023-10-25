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
      <v-card-title class="text-h3" raised width="98%" style="margin: auto;padding-bottom: 15px;">News</v-card-title>
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
      <v-card class="m-4">
        <v-card-title v-if="item._source.title !== '' && !editing" class="pt-2 mt-4 text-h3 justify-right">{{item._source.title}}</v-card-title>
        <v-text-field v-if="editing" v-model="item._source.title" class="mx-5"></v-text-field>
        <v-divider dense></v-divider>
        <v-list-subheader v-if="$store.state.user.accessLevel === 4 && editing">
          Is-expiring
        </v-list-subheader>
        <v-row v-if="$store.state.user.accessLevel === 4 && editing">
          <v-col>
            <v-checkbox
              class="mx-5"
              label="Is Expiring"
              v-model="item._source.isExpiring"
            >
            </v-checkbox>
          </v-col>
          <v-col v-show="item._source.isExpiring">
            <v-date-picker
              v-model="expiresString"
              landscape
            ></v-date-picker>
          </v-col>
        </v-row>

        <v-alert  type="warning" dense v-model="item._source.isUnpublished" border="left">Not published yet.</v-alert>
        <v-alert v-if="isOutdated(item)"  type="info" dense  border="left">{{"News is outdated since " + new Date(item._source.expires) + "."}}</v-alert>
        <v-card-text class="mx-2" v-if="!editing" v-html="item._source.body"></v-card-text>
        <div v-if="editing">
        <trumbowyg
          ref="editorEditedText"  class="mx-5" v-model="item._source.body"
        />
        </div>
        <v-divider></v-divider>
        <v-card-text class="m-0 font-weight-bold text-right text-caption">{{"(by: " + item._source.user + ", on: " + new Date(item._source.date).toGMTString()+")"}}</v-card-text>
        <v-card-actions>
          <v-btn
            @click="editing=false"
            color="success"
            v-if="editing"
          >
            {{"Cancel"}}
          </v-btn>
          <v-spacer v-if="$store.state.user.userID === item.userID"></v-spacer>
          <v-btn
            @click="editingClicked(item)"
            color="success"
            v-if="$store.state.user.accessLevel === 4"
          >
            {{editing ? 'Save' : 'Edit'}}
          </v-btn>
          <v-spacer v-if="$store.state.user.accessLevel === 4"></v-spacer>
          <v-btn
            v-if="$store.state.user.accessLevel === 4"
            @click="publish(item)"
            class="ml-3"
          >
            {{item._source.isUnpublished ? "Publish" : "Unpublish"}}
          </v-btn>
        </v-card-actions>
      </v-card>
      </div>
      </v-card>
    </div>
</template>
<script>

import {putNews, getNews} from '@/services/repository'
import { v4 as uuidv4 } from 'uuid'
import trumbowyg from '@/components/trumbowyg.vue'

export default {
  name: 'News',
  components: {
    trumbowyg,
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
      editing:false,
      topicTitleEdited:"",
      isUnpublished:false,
      editedText:"",
      unpublishedAlert:false
    }
  },
  computed: {
    expiresString:{
      get: function(){
        console.log("this.expireDate", new Date(this.expireDate));
        return new Date(this.expireDate).toISOString().substr(0, 10)
      },
      set: function(newValue){
        this.expireDate = Date.parse(newValue)
      }
    },
  },
  methods: {
    isOutdated(item){
      if (item._source.isExpiring){
        console.log("expires", item._source.expires, "now", Date.now());
        if (item._source.expires < Date.now()){
          return true
        } else {
          return false
        }
      } else {
        return false
      }
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
    publish(item){
      item._source.isUnpublished = !item._source.isUnpublished
      putNews(item._source, item._id, true, this.$store.state.user.sessionID, "This news was " + item._source.isUnpublished ? "published" : "unpublished")
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
      this.topicBody = ""
      this.isExpiring = false
      this.isUnpublished = false
      this.panel = false
    },

    textChangedNews(body){
      this.topicBody = body
    },
    getNews(date){
      getNews(date, false, this.$store.state.user.accessLevel === 4)
        .then( res => {
          this.news = res.data.hits.hits
          // this.news.sort(function(a, b){return b._source.latestUpdate - a._source.latestUpdate})
          console.log("news", this.news);
        })
        .catch((error) => {
          this.$log.debug(error)
        })
    },
    editingClicked(item){
      if (!this.editing){
        this.editing = true
        this.expireDat = item._source.expires
      } else {
        this.editing = false
        console.log("setting expires to:", this.expireDate);
        item._source.expires = this.expireDate
        putNews(item._source, item._id, true, this.$store.state.user.sessionID, item._source.body)
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

      }
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
