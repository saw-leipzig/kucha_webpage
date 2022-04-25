<template>
  <div>
      <v-card-title v-if="item.topic !== '' && !editing" class="pt-2 text-h4 justify-right">{{item.topic}}</v-card-title>
      <v-text-field v-if="editing && isFirst" v-model="topicTitleEdited" class="mx-5"></v-text-field>
      <v-card-text v-if="isFirst" class="font-weight-bold text-right">{{"(by: " + item.user + ", on: " + new Date(item.date).toGMTString()+")"}}</v-card-text>
      <v-card-text v-if="!editing && item.keywords && item.keywords.length > 0">{{"Keywords: " + getKeywords}}</v-card-text>
      <v-combobox
        v-if="editing && isFirst"
        v-model="keywordsSelectedModified"
        :items="keywords"
        label="Keywords"
        multiple
        no-data-text>
      </v-combobox>
      <v-divider dense></v-divider>
      <div v-if="editing && isFirst">
        <v-card-title class="text-5" raised width="98%" style="margin: auto;padding-bottom: 15px;">Connected Elements <v-btn x-small icon color="green"  @click="helpElements=!helpElements"><v-icon>mdi-help</v-icon></v-btn></v-card-title>
        <v-alert v-model="helpElements" dismissible color="green">Please select at least one element of cave, iconography or painted representations. Multiple selections are allowed.</v-alert>
        <v-row class="mx-5">
          <v-col>
            <v-combobox
              v-model="cavesEdited"
              :items="cavesList"
              label="Cave"
              multiple>
            </v-combobox>
            </v-col>
            <v-col>
              <v-combobox
                v-model="icosEdited"
                :items="iconographyList"
                label="Iconography"
                multiple>
              </v-combobox>
            </v-col>
            <v-col>
              <v-combobox
                v-model="prsEdited"
                :items="prsList"
                label="Painted Representation"
                multiple>
              </v-combobox>
            </v-col>
            <v-col>
              <v-combobox
                v-model="bibliosEdited"
                :items="biblios"
                label="Annotated Bibliography"
                multiple>
              </v-combobox>
            </v-col>
        </v-row>
      </div>
      <div v-if="!editing && isFirst">
        <v-card-actions dense>
          <v-btn
            @click="existRelated = !existRelated"
            color="orange lighten-2"
            text
            dense
            class="ml-3"
            v-if="(item.iconogrpahy && item.iconography.length > 0) || (item.caves && item.caves.length > 0) || (item.prs && item.prs.length>0)"
          >
            Related Entries
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dense
            @click="existRelated = !existRelated"
          >
            <v-icon>{{ existRelated ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-expand-transition >
          <div v-show="existRelated">
            <v-card-subtitle v-if="item.iconogrpahy && item.iconography.length>0">Related Iconography:</v-card-subtitle>
            <v-card-text class="ml-5" v-for="(item_ico, index_ico) in item.iconography" :key="'ico-'+index_ico">
              <a :href="getIcoURL(item_ico.value)">
                {{"Iconography Entry " + item_ico.value + " (" + item_ico.text + ")"}}
              </a>
            </v-card-text>
            <v-card-subtitle v-if="item.caves.length>0">Related Caves:</v-card-subtitle>
            <v-card-text class="ml-5" v-for="(item_cave, index_cave) in item.caves" :key="'cave-'+index_cave">
              <a :href="getCaveURL(item_cave.value)">
                {{"cave " + item_cave.text}}
              </a>
            </v-card-text>
            <v-card-subtitle v-if="item.prs.length>0">Related Painted Representations:</v-card-subtitle>
            <v-card-text class="ml-5" v-for="(item_pr, index_pr) in item.prs" :key="'pr-'+index_pr">
              <a :href="getPRURL(item_pr.value)">
                {{"Painted Representation " + item_pr.value + " (" + item_pr.text + ")"}}
              </a>
            </v-card-text>
            <v-card-subtitle v-if="item.prs.length>0">Related Annotated Biliography:</v-card-subtitle>
            <v-card-text class="ml-5" v-for="(item_biblio, index_biblio) in item.bibliography" :key="'biblio-'+index_biblio">
              <a :href="getBiblioURL(item_biblio.value)">
                {{"Annotated Bibliography " + item_biblio.value + " (" + item_biblio.text + ")"}}
              </a>
            </v-card-text>
          </div>
        </v-expand-transition>
      </div>
      <v-divider v-if="(item.iconography && item.iconography.length>0)||(item.caves && item.caves.length>0)||(item.prs && item.prs.length>0)"></v-divider>
      <v-range-slider
        v-if="isFirst && item.chronologicalRange.length>0 && !editing"
        v-model="item.chronologicalRange"
        min="0"
        max="1700"
        step="50"
        thumb-label="always"
        readonly
        ticks
        hide-details
        thumb-size=46
        class="mt-15 mx-5"
        label="Chronological Range"
      >
      <template v-slot:thumb-label="{ value }">
        {{ chronologicalRange[(value / 50)] }}
      </template>
      </v-range-slider>
      <v-range-slider
        v-if="isFirst && editing"
        v-model="chronologicalRangeSelectedModified"
        min="0"
        max="1700"
        step="50"
        thumb-label="always"
        ticks
        hide-details
        thumb-size=46
        class="mt-15 mx-5"
        label="Chronological Range"
      >
      <template v-slot:thumb-label="{ value }">
        {{ chronologicalRange[(value / 50)] }}
      </template>
      </v-range-slider>
      <v-divider v-if="isFirst && item.chronologicalRange.length>0"></v-divider>
      <v-alert type="warning" dense v-model="unpublishedAlert" border="left">Post is not published yet, waiting for authorisation by Admins.</v-alert>
      <v-card-text v-if="!editing" v-html="item.body"></v-card-text>
      <VueEditor v-if="editing" class="mx-5" v-model="editedText" />
      <v-card-text v-if="!isFirst" class="font-weight-bold text-right">{{"(by: " + item.user + ", on: " + new Date(item.date).toGMTString()+")"}}</v-card-text>
      <v-divider></v-divider>
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
        <v-spacer v-if="editing"></v-spacer>
        <v-btn
          @click="editing=false"
          color="orange lighten-2"
          text
          class="ml-3"
          v-if="editing"
        >
          {{"Cancel"}}
        </v-btn>
        <v-spacer v-if="$store.state.user.userID === item.userID"></v-spacer>
        <v-btn
          @click="editingClicked()"
          color="orange lighten-2"
          text
          class="ml-3"
          v-if="$store.state.user.userID === item.userID"
        >
          {{editing ? 'Save' : 'Edit'}}
        </v-btn>
        <v-spacer v-if="$store.state.user.accessLevel === 4 && !item.published"></v-spacer>
        <v-btn
          v-if="$store.state.user.accessLevel === 4 && !item.published"
          @click="publish()"
          color="orange lighten-2"
          text
          class="ml-3"
        >
          Publish
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="orange lighten-2"
          text
          @click="subscribe({'isSubscribed': !isSubscribed, 'uuid':item.uuid})"
        >
          {{ isSubscribed ? 'unsubscribe' : 'subscribe' }}
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
    <div v-if="publishedComments.length>0" >
      <v-expansion-panels Focusable popout v-model="showAnswers">
        <v-expansion-panel class="ml-3">
        <v-expansion-panel-header>
            {{showAnswers ? 'Hide Answers' : 'Show Answers'}}
        </v-expansion-panel-header>
          <v-expansion-panel-content>
            <discussion
              @publish="publishedComment"
              @editComment="editComment"
              @subscribe="subscribe"
              v-for="(item, index) in publishedComments"
              :item="item"
              :key="index" @clicked="setComment"
              :user="item.user"
              :userID="item.userID"
              :subscribed="subscribed"
              :unsubscribed="unsubscribed"
              class="ml-4"></discussion>
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
    item:{
      type: Object,
      default: function(){
        return {}
      }
    },
    isFirst:{
      type: Boolean,
      default: function(){
        return false
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
    subscribed:{
      type: Array,
      default: function(){
        return []
      }
    },
    unsubscribed:{
      type: Array,
      default: function(){
        return []
      }
    },
  },
  data () {
    return {
      showEditor: false,
      replyBody: "",
      postError: false,
      showAnswers:false,
      existRelated:false,
      editing:false,
      cavesEdited:[],
      icosEdited:[],
      bibliosEdited:[],
      prsEdited:[],
      helpElements:false,
      editedText:"",
      topicTitleEdited:"",
      chronologicalRangeSelectedModified:[],
      keywordsSelectedModified:[],
      unpublishedAlert:false
    }
  },
  computed:{
    publishedComments(){
      if (this.$store.state.user.accessLevel === 4){
        return this.item.comments
      } else {
        let published = []
        for (let comment of this.item.comments){
          if (comment.published){
            published.push(comment)
          } else if (this.$store.state.user.userID === comment.userID) {
            published.push(comment)
          }
        }
        return published

      }
    },
    getKeywords(){
      let keywordText = ""
      for (let keyword of this.item.keywords){
        if (keywordText === ""){
          keywordText = keyword
        } else {
          keywordText += ", " + keyword
        }
      }
      return keywordText
    },
    isSubscribed(){
      if (this.unsubscribed.includes(this.$store.state.user.userID)){
        return false
      } else if (this.subscribed.includes(this.$store.state.user.userID)){
        return true
      }
      return false
    },
  },
  methods: {
    publishedComment(value){
      let newComments = []
      for (let comment of this.item.comments){
        if (comment.uuid === value){
          comment["published"] = true
          newComments.push(comment)
        } else {
          newComments.push(comment)
        }
      }
      console.log(newComments);
      this.$emit('clicked', newComments)
    },
    publish(){
      this.$emit('publish', this.item.uuid)
    },
    editingClicked(){
      if (!this.editing){
        this.editing = true
        this.icosEdited = this.item.iconography
        this.cavesEdited = this.item.caves
        this.prsEdited = this.item.prs
        this.editedText = this.item.body
        this.bibliosEdited = this.item.bibliography
        this.topicTitleEdited = this.item.topic
        this.chronologicalRangeSelectedModified = this.item.chronologicalRange
        this.keywordsSelectedModified = this.item.keywords
      } else {
        console.log("saving");
        this.editing = false
        let data = {
          "uuid": this.item.uuid,
          "user": this.$store.state.user.lastname + ", " + this.$store.state.user.firstname,
          "userID": this.$store.state.user.userID,
          "body": this.editedText,
          "comments": this.item.comments,
          "date" : this.item.date,
          "latestUpdate": Date.now(),
          "published": this.published
        }
        if (this.isFirst){
          data["title"] = this.topicTitleEdited
          data["prs"] = this.prsEdited
          data["caves"] = this.cavesEdited
          data["bibliography"] = this.bibliosEdited
          data["iconography"] = this.icosEdited
          data["subscribed"] = this.subscribed
          data["unsubscribed"] = this.unsubscribed
          data["keywords"] = this.keywordsSelectedModified
          data["chronologicalRange"] = this.chronologicalRangeSelectedModified
        }
        this.$emit('editComment', data)

      }
    },
    editComment(value){
      console.log("editCommentTriggered", value);
      console.log("former comments:", this.item.comments);
      let newComments = []
      for (let comment of this.item.comments){
        if (comment.uuid === value.uuid){
          value["parentUuid"] = comment.parentUuid
          newComments.push(value)
        } else {
          newComments.push(comment)
        }
      }
      this.$emit('clicked', newComments)
    },
    subscribe(value){
      var data = {"isSubscribed": value.isSubscribed, "uuid":this.item.uuid}
      this.$emit('subscribe', data)
    },
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
    getBiblioURL(value){
      if (value){
        return "/bibliography/" + value
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
          "parentUuid": this.item.uuid,
          "uuid": uuidv4(),
          "user": this.$store.state.user.lastname + ", " + this.$store.state.user.firstname,
          "userID": this.$store.state.user.userID,
          "body": this.replyBody,
          "comments": [],
          "date" : now,
          "latestUpdate": now,
          "published": false
        }
        var newComments = JSON.parse(JSON.stringify(this.item.comments))
        newComments.push(newComment)
        console.log("post answer", newComments);
        this.$emit('clicked', newComments)

      } else {
        this.postError = true
      }
    },
    setComment(newComment){
      console.log("setComment", newComment);
      console.log("oldComments", this.item.comments);
      var newComments = []
      for (let comment of this.item.comments){
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
    if (!this.item.published){
      this.unpublishedAlert = true
    }
    if (!this.$store.state.user.granted){
      this.showEditor = false
    }

  },
  watch: {
    'subscribed': function(newVal, oldVal) {
      console.log("subscribed:", newVal);
    },
    'unsubscribed': function(newVal, oldVal) {
      console.log("unsubscribed:", newVal);
    },

  },
}

</script>

<style></style>
