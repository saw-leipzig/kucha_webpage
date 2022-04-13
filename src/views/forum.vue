<template>
  <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
    <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
      <v-card-title class="text-h3" raised width="98%" style="margin: auto;padding-bottom: 15px;">Discussion Forum on Dating Issues</v-card-title>
      <v-expansion-panels v-model="panel" class v-if="$store.state.user.granted">
        <v-expansion-panel >
          <v-expansion-panel-header>
            Crate new Topic
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card class raised width="98%" style="margin: auto;padding-bottom: 15px;">
                  <v-card-title class="text-5" raised width="98%" style="margin: auto;padding-bottom: 15px;">Connected Elements <v-btn x-small icon color="green"  @click="helpElements=!helpElements"><v-icon>mdi-help</v-icon></v-btn></v-card-title>
                  <v-alert v-model="helpElements" dismissible color="green"> Please select at least one element of cave, iconography or painted representations. Multiple selections are allowed.</v-alert>
                    <v-row class="mx-5">
                      <v-col>
                        <v-combobox
                          v-model="selectedCaves"
                          :items="caves"
                          label="Cave"
                          multiple>
                        </v-combobox>
                      </v-col>
                      <v-col>
                        <v-combobox
                          v-model="selectedIconography"
                          :items="iconography"
                          label="Iconography"
                          multiple>
                        </v-combobox>
                      </v-col>
                      <v-col>
                        <v-combobox
                          v-model="selectedPR"
                          :items="prs"
                          label="Painted Representation"
                          multiple>
                        </v-combobox>
                      </v-col>
                    </v-row>
                    <v-card-title>Topic Title</v-card-title>
                    <v-text-field v-model="topicTitle" class="mx-5"></v-text-field>
                    <v-card-title>Topic Body</v-card-title>
                    <VueEditor class="mx-5" v-model=topicBody />
                    <v-col>
                      <v-btn @click="postNewthread" :loading="posting" dense block color="success">Submit</v-btn>
                    </v-col>

            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card-title>Discussions</v-card-title>
      <div v-for="(item, index) in discussions" :key="index" >
       <discussion :icos="item._source.iconography" :caves="item._source.caves" :prs="item._source.prs" :user="item._source.user" :topic="item._source.title" :date="item._source.date" :text="item._source.body" :comments="item._source.comments" @clicked="postComments" :uuid="item._id"></discussion>
      </div>
    </v-card>
  </v-card>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { v4 as uuidv4 } from 'uuid';
import {putComments, getComments, getPRList, getIcoList, getCaveList} from '@/services/repository'
import {getDepictionLabelShort, getCaveShortLabel} from  "@/utils/helpers"
import discussion from '@/components/discussion'

export default {
  components: {
    VueEditor,
    discussion
  },
  name: 'forum',
  props: {
    source: String,
  },
  data () {
    return {
      helpElements: false,
      selectedCaves: [],
      selectedIconography: [],
      selectedPR: [],
      topicBody: "",
      panel: false,
      topicTitle:"",
      discussions: [],
      posting: false,
      prs: [],
      iconography: [],
      caves: []
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
    postNewthread(){
      this.posting = true
      const now = Date.now();
      console.log("user:", this.$store.state.user.lastname + ", " + this.$store.state.user.firstname);
      console.log("title:", this.topicTitle);
      console.log("body:", this.topicBody);
      console.log("date:", now);
      var data = {
        "user": this.$store.state.user.lastname + ", " + this.$store.state.user.firstname,
        "userID": this.$store.state.user.userID,
        "title": this.topicTitle,
        "body": this.topicBody,
        "comments": [],
        "date": now,
        "latestUpdate": now,
        "prs": this.selectedPR,
        "caves": this.selectedCaves,
        "iconography": this.selectedIconography
      }
      console.log("data", data);
      putComments(data, uuidv4())
        .then( res => {
          const _self = this
          setTimeout(function () {
            console.log("loading new comments");
            _self.getComments()
            _self.posting = false
          }, 2000);
        })
        .catch((error) => {
          console.log(error)
        })
    },
    postComments(comments){
      console.log("post comment in forum:", comments);
      var parentDiscussion = this.discussions.find(element => element._id === comments[0].parentUuid)
      parentDiscussion._source.comments = comments
      parentDiscussion._source.latestUpdate = Date.now();
      console.log(parentDiscussion._source);
      putComments(parentDiscussion._source, comments[0].parentUuid)
    }
  },
  mounted:function () {
    this.getComments()
    getPRList()
      .then( res => {
        for (var pr of res.data.hits.hits){
          let label = getDepictionLabelShort(pr._source)
          let prProcessed = {
            value: pr._source.depictionID,
            text: label
          }
          this.prs.push(prProcessed)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    getIcoList()
      .then( res => {
        for (var ico of res.data.hits.hits){
          let label = ico._source.text
          let icoProcessed = {
            value: ico._source.iconographyID,
            text: label
          }
          this.iconography.push(icoProcessed)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    getCaveList()
      .then( res => {
        console.log("Caves", res);
        for (var cave of res.data.hits.hits){
          let label = getCaveShortLabel(cave._source)
          let caveProcessed = {
            value: cave._source.caveID,
            text: label
          }
          this.caves.push(caveProcessed)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
}

</script>

<style></style>
