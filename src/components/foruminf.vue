<template>
  <div>
      <v-expansion-panels flat v-model="panel" v-if="$store.state.user.granted&&newPosts">
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
                  <v-col>
                    <v-combobox
                      v-model="selectedBiblios"
                      :items="biblios"
                      label="Annotated Bibliography"
                      multiple>
                    </v-combobox>
                  </v-col>
              </v-row>
              <v-card-title class="text-5" raised width="98%" style="margin: auto;padding-bottom: 15px;">Information<v-btn x-small icon color="green"  @click="helpElements=!helpElements"><v-icon>mdi-help</v-icon></v-btn></v-card-title>
              <v-row class="mx-5">
                <v-col>
                  <v-combobox
                    v-model="keywordsSelected"
                    :items="keywords"
                    label="Keywords"
                    multiple
                    no-data-text>
                  </v-combobox>
                  </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-range-slider
                    v-model="chronologicalRangeSelected"
                    min="0"
                    max="1700"
                    step="50"
                    thumb-label="always"
                    ticks
                    hide-details
                    thumb-size=46
                    class="mt-5"
                    label="Chronological Range"
                  >
                  <template v-slot:thumb-label="{ value }">
                    {{ chronologicalRange[(value / 50)] }}
                  </template>
                  </v-range-slider>
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
      <v-card-title >{{heading}}</v-card-title>
      <div v-for="(item, index) in discussions" :key="index" >
        <v-card v-if="item._source.published=true || $store.state.user.accessLevel===4" raised width="98%" style="margin: auto;padding-bottom: 15px;">
        <discussion
          @editComment="editDiscussion"
          @subscribe="subscribe"
          @clicked="postComments"
          :item="item._source"
          :keywords="keywords"
          :chronologicalRange="chronologicalRange"
          :iconographyList="iconography"
          :cavesList="caves"
          :prsList="prs"
          :isFirst="true"
          :biblios="biblios"
        ></discussion>
        </v-card>
        <v-row><v-col class="my-3"></v-col></v-row>
      </div>
    </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { v4 as uuidv4 } from 'uuid';
import {putComments, getPRList, getBiblioList, getIcoList, getCaveList, getDiscussionKeywords} from '@/services/repository'
import {getDepictionLabelShort, getCaveShortLabel, getBibTitle} from  "@/utils/helpers"
import discussion from '@/components/discussion'

export default {
  components: {
    VueEditor,
    discussion
  },
  name: 'foruminf',
  props: {
    discussions: null,
    newPosts: {
      type: Boolean,
      default: true
    },
    heading: {
      type: String,
      default: "Discussion"
    },

  },
  data () {
    return {
      helpElements: false,
      selectedCaves: [],
      selectedIconography: [],
      selectedPR: [],
      selectedBiblios: [],
      topicBody: "",
      panel: false,
      topicTitle:"",
      posting: false,
      prs: [],
      biblios: [],
      iconography: [],
      caves: [],
      keywords:[],
      keywordsSelected:[],
      chronologicalRange: ["unset", "200BC", "150BC", "100BC", "50BC", "0AD", "50AD", "100AD", "150AD", "200AD", "250AD", "300AD", "350AD", "400AD", "450AD", "500AD", "550AD", "600AD", "650AD", "700AD", "750AD", "800AD", "850AD", "900AD", "950AD", "1000AD", "1050AD", "1100AD", "1150AD", "1200AD", "1250AD", "1300AD", "1350AD", "1400AD", "unset"],
      chronologicalRangeSelected: [-200, 1700],
    }
  },
  computed:{
  },
  methods: {
    editDiscussion(value){
      console.log("editDiscussion", value);
      console.log("Discussions", this.discussions);
      let uuid = value.uuid
      delete value.uuid
      console.log("this.$store.state.user.sessionID", this.$store.state.user.sessionID);
      putComments(value, uuid, false, this.$store.state.user.sessionID)
      for (let discussion of this.discussions){
        if (discussion._id === uuid){
          console.log("discussion", discussion);
          discussion._source = value
        }
      }
    },
    subscribe(data){
      console.log("subscribe initiated:", data);
      var filtered = []
      var parentDiscussion = this.discussions.find(element => element._id === data.uuid)
      console.log("Discussion",  this.discussions);
      console.log("parentDiscussion", parentDiscussion);
      var _self = this
      if (data.isSubscribed){
        filtered = parentDiscussion._source.unsubscribed.filter(function(value, index, arr){
          return value !== _self.$store.state.user.userID;
        });
        parentDiscussion._source.unsubscribed = filtered
        filtered = parentDiscussion._source.subscribed.filter(function(value, index, arr){
          return value !== _self.$store.state.user.userID;
        });
        parentDiscussion._source.subscribed = filtered
        parentDiscussion._source.subscribed.push(this.$store.state.user.userID)
      } else {
        filtered = parentDiscussion._source.unsubscribed.filter(function(value, index, arr){
          return value !== _self.$store.state.user.userID;
        });
        parentDiscussion._source.unsubscribed = filtered
        filtered = parentDiscussion._source.subscribed.filter(function(value, index, arr){
          return value !== _self.$store.state.user.userID;
        });
        parentDiscussion._source.subscribed = filtered
        parentDiscussion._source.unsubscribed.push(this.$store.state.user.userID)
      }
      console.log("discussions", this.discussions);
      putComments(parentDiscussion._source, parentDiscussion._id, false, this.$store.state.user.sessionID)
    },
    getComments(){
      this.$emit("getComments", '')
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
        "bibliography": this.selectedBiblios,
        "caves": this.selectedCaves,
        "iconography": this.selectedIconography,
        "subscribed": [this.$store.state.user.userID],
        "unsubscribed": [],
        "keywords": this.keywordsSelected,
        "published": false,
        "chronologicalRange": this.chronologicalRangeSelected
      }
      console.log("data", data);
      putComments(data, uuidv4(), false, this.$store.state.user.sessionID)
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
      console.log("PrarenDiscussion", parentDiscussion);
      if (!parentDiscussion._source.unsubscribed.includes(this.$store.state.user.userID)){
        if (!parentDiscussion._source.subscribed.includes(this.$store.state.user.userID)){
          parentDiscussion._source.subscribed.push(this.$store.state.user.userID)
        }
      }
      console.log(parentDiscussion._source);
      putComments(parentDiscussion._source, comments[0].parentUuid, true, this.$store.state.user.sessionID)
    }
  },
  watch:{
    chronologicalRangeSelected(newVal, oldVal){
      console.log(newVal);
    }

  },
  mounted:function () {
    console.log("discussions:", this.discussions);
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
    getBiblioList()
      .then( res => {
        for (var pr of res.data.hits.hits){
          let label = getBibTitle(pr._source)
          let biblioProcessed = {
            value: pr._source.annotatedBibliographyID,
            text: label
          }
          this.biblios.push(biblioProcessed)
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
    getDiscussionKeywords()
      .then( res => {
        console.log("keywords", res.data.aggregations.keywords.buckets);
        for (let keyword of res.data.aggregations.keywords.buckets){
          this.keywords.push(keyword.key)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },
}

</script>

<style></style>
