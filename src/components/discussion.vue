<template>
  <div>
    <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
      <v-card-title v-if="topic !== ''" class="text-h4 justify-right">{{topic}}</v-card-title>
      <v-divider></v-divider>
      <v-expansion-panels v-model="existRelated" class v-if="icos.length>0||caves.length>0||prs.length>0">
        <v-expansion-panel >
          <v-expansion-panel-header>
            Related Entries
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card-subtitle v-if="icos.length>0">Related Iconography:</v-card-subtitle>
              <v-card-text class="ml-5" v-for="(item_ico, index_ico) in icos" :key="'ico-'+index_ico">
                <a :href="getIcoURL(item_ico.value)">
                  {{"Iconography Entry " + item_ico.value + " (" + item_ico.text + ")"}}
                </a>
              </v-card-text>

              <v-card-subtitle v-if="caves.length>0">Related Caves:</v-card-subtitle>
              <v-card-text class="ml-5" v-for="(item_cave, index_cave) in caves" :key="'cave-'+index_cave">
                <a :href="getCaveURL(item_cave.value)">
                  {{"cave " + item_cave.text}}
                </a>
              </v-card-text>

              <v-card-subtitle v-if="prs.length>0">Related Painted Representations:</v-card-subtitle>
              <v-card-text class="ml-5" v-for="(item_pr, index_pr) in prs" :key="'pr-'+index_pr">
                <a :href="getPRURL(item_pr.value)">
                  {{"Painted Representation " + item_pr.value + " (" + item_pr.text + ")"}}
                </a>
              </v-card-text>

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-divider v-if="icos.length>0||caves.length>0||prs.length>0"></v-divider>
      <v-card-text v-html="text"></v-card-text>
      <v-card-text class="font-weight-bold text-right">{{"(by: " + user + ", on: " + new Date(date).toGMTString()+")"}}</v-card-text>
    </v-card>
    <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn
          @click="showEditor = !showEditor"
          color="orange lighten-2"
          text
          class="ml-3"
          v-if="$store.state.user.granted"
        >
          Reply
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="showEditor = !showEditor"
        >
          <v-icon>{{ showEditor ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>
      <v-expand-transition >
        <div v-show="showEditor">
          <VueEditor class="mx-5" v-model=replyBody />
          <v-col>
            <v-btn @click="postAnswer" dense block color="success">Submit</v-btn>
            <v-spacer ></v-spacer>
            <v-alert v-model="postError" dismissible color="red"> Connot post empty reply!</v-alert>
          </v-col>
        </div>
      </v-expand-transition>
    <div v-if="comments.length>0" >
      <v-expansion-panels Focusable popout v-model="showAnswers">
        <v-expansion-panel class="ml-3">
        <v-expansion-panel-header>
            {{showAnswers ? 'Hide Answers' : 'Show Answers'}}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
      <discussion v-for="(item, index) in comments" :key="index" @clicked="setComment" :user="item.user" :topic="item.title" :text="item.body" :uuid="item.uuid" :date="item.date" :comments="item.comments" class="ml-4"></discussion>

        </v-expansion-panel-content>

        </v-expansion-panel>
      </v-expansion-panels>
          </div>
  </div>
</template>

<script>
import discussion from '@/components/discussion'
import { VueEditor } from "vue2-editor";
import { v4 as uuidv4 } from 'uuid';


export default {
  components: {
    discussion,
    VueEditor
  },
  name: 'discussion',
  props: {
    caves:{
      type: Array,
      default: function(){
        return []
      }
    },
    icos:{
      type: Array,
      default: function(){
        return []
      }
    },
    prs:{
      type: Array,
      default: function(){
        return []
      }
    },
    user:{
      type: String,
      default: function(){
        return "no user"
      }
    },
    topic: {
      type: String,
      default: ""
    },
    date: {
      type: Number,
      default: -1
    },
    comments: {
      type: Array,
      default: function(){
        return []
      }
    },
    text: {
      type: String,
      default: "no content"
    },
    uuid: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      showEditor: false,
      replyBody: "",
      postError: false,
      showAnswers:false,
      existRelated:false
    }
  },
  computed:{
  },
  methods: {
    getIcoURL(value){
      if (value){
        return "/iconography/" + value
      }
      return ""
    },
    getPRURL(value){
      if (value){
        return "/pr/" + value
      }
      return ""
    },
    getCaveURL(value){
      if (value){
        return "/cave/" + value
      }
      return ""
    },
    postAnswer(){
      if (this.replyBody !== ""){
        const now = Date.now();
        var newComment = {
          "parentUuid": this.uuid,
          "uuid": uuidv4(),
          "user": this.$store.state.user.lastname + ", " + this.$store.state.user.firstname,
          "userID": this.$store.state.user.userID,
          "body": this.replyBody,
          "comments": [],
          "date" : now,
          "latestUpdate": now
        }
        var newComments = JSON.parse(JSON.stringify(this.comments))
        newComments.push(newComment)
        console.log("post answer", newComments);
        this.$emit('clicked', newComments)

      } else {
        this.postError = true
      }
    },
    setComment(newComment){
      console.log("setComment", newComment);
      console.log("oldComments", this.comments);
      var newComments = []
      for (let comment of this.comments){
        console.log("comment", comment.uuid);
        console.log("newComment", newComment[0].parentUuid);
        if (comment.uuid === newComment[0].parentUuid){
          var addedComment = Object.assign({}, comment)
          addedComment.comments = newComment
          console.log("addedComment", addedComment);
          newComments.push(addedComment)
        } else {
          newComments.push(comment)
        }
      }
      console.log("newComments", newComments);
      this.$emit('clicked', newComments)
    }
  },
  mounted:function () {
    console.log("item", this.item);
    if (!this.$store.state.user.granted){
      this.showEditor = false
    }
  },
}

</script>

<style></style>
