<template>
  <div v-if="publishedDiscussions.length > 0">
      <v-card-title>{{heading}}</v-card-title>
      <div v-for="(item, index) in publishedDiscussions" :key="index" >
        <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
        <discussion
          @publish="publishDiscussion"
          @editComment="editDiscussion"
          @subscribe="subscribe"
          @clicked="postComments"
          :uuid="item._id"
          :item="item._source"
          :keywords="keywords"
          :subscribed="item._source.subscribed"
          :unsubscribed="item._source.unsubscribed"
          :chronologicalRange="chronologicalRange"
          :iconographyList="iconographyList"
          :cavesList="cavesList"
          :prsList="prsList"
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
import {putComments} from '@/services/repository'
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
    biblios:{
      type: Array,
      default: function(){
        return []
      }
    },
    chronologicalRange:{
      type: Array,
      default: function(){
        return []
      }
    },
    keywords:{
      type: Array,
      default: function(){
        return []
      }
    },
    cavesList:{
      type: Array,
      default: function(){
        return []
      }
    },
    iconographyList:{
      type: Array,
      default: function(){
        return []
      }
    },
    prsList:{
      type: Array,
      default: function(){
        return []
      }
    },
  },
  data () {
    return {
    }
  },
  computed:{
    publishedDiscussions(){
      console.log("all discussions", this.discussions, this.$store.state.user.accessLevel);
      if (this.$store.state.user.accessLevel === 4){

        return this.discussions
      } else {
        let published = []
        for (let discussion of this.discussions){
          if (discussion.published){
            published.push(discussion)
          } else if (this.$store.state.user.userID === discussion._source.userID) {
            published.push(discussion)
          }
        }
        return published
      }
    }
  },
  methods: {
    publishDiscussion(value){
      console.log("this.publishedDiscussion", value);
      let newComments = []
      for (let discussion of this.discussions){
        if (discussion._id === value){
          discussion._source["published"] = true
          putComments(discussion._source, value, true, this.$store.state.user.sessionID, discussion.body)
          break
        }
      }
      console.log(newComments);
      this.$emit('clicked', newComments)
    },

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
          discussion = value
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
    postComments(comments){
      console.log("post comment in forum:", comments);
      var parentDiscussion = this.discussions.find(element => element._id === comments.comment[0].parentUuid)
      parentDiscussion._source.comments = comments.comment
      parentDiscussion._source.latestUpdate = Date.now();
      console.log("PrarenDiscussion", parentDiscussion);
      if (!parentDiscussion._source.unsubscribed.includes(this.$store.state.user.userID)){
        if (!parentDiscussion._source.subscribed.includes(this.$store.state.user.userID)){
          parentDiscussion._source.subscribed.push(this.$store.state.user.userID)
        }
      }
      console.log(parentDiscussion);
      putComments(parentDiscussion._source, comments.comment[0].parentUuid, comments.sendMail, this.$store.state.user.sessionID, comments.text)
    }
  },
  watch:{
    discussions(newVal, oldVal){

    }

  },
  mounted:function () {
    console.log("published discussions", this.publishedDiscussions);
  },
}

</script>

<style></style>
