<template>
  <div>
      <v-card-title v-if="item.title !== '' && !editing && isFirst" class="pt-2 text-h4 justify-right">{{item.title}}</v-card-title>
      <v-text-field v-if="editing && isFirst" v-model="topicTitleEdited" class="mx-5"></v-text-field>
      <v-card-text v-if="isFirst" class="font-weight-bold text-right">{{"(by: " + item.user + ", on: " + new Date(item.date).toGMTString()+")"}}</v-card-text>
      <v-card-text v-if="!editing && item.keywordList && item.keywordList.length > 0 && isFirst">{{"Keywords: " + getKeywords}}</v-card-text>
      <v-combobox
        v-if="editing && isFirst"
        v-model="keywordsSelectedModified"
        :items="keywords"
        label="Keywords"
        multiple
        no-data-text>
      </v-combobox>
      <v-divider dense></v-divider>
      <div id="1" v-if="editing && isFirst">
        <v-card-title class="text-5" raised width="98%" style="margin: auto;padding-bottom: 15px;">Connected Elements <v-btn x-small icon color="green"  @click="helpElements=!helpElements"><v-icon>mdi-help</v-icon></v-btn></v-card-title>
        <v-alert v-model="helpElements" dismissible color="green">Please select at least one element of cave, iconography or painted representations. Multiple selections are allowed.</v-alert>
        <v-row class="mx-5">
          <v-col>
            <v-combobox
              v-model="cavesEdited"
              :items="cavesList"
              label="Cave"
              chips
              deletable-chips
              multiple>
                <template v-slot:prepend-item>
                  <v-list-item
                    ripple
                    @mousedown.prevent
                    @click="selectAllCaves()"
                  >
                    <v-list-item-action>
                      <v-icon >
                        {{ cavesEdited.length === cavesList.length ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>
                        Select All
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
            </v-combobox>
            </v-col>
            <v-col>
              <v-combobox
                v-model="icosEdited"
                :items="iconographyList"
                label="Iconography"
                chips
                deletable-chips
                multiple>
                  <template v-slot:prepend-item>
                    <v-list-item
                      ripple
                      @mousedown.prevent
                      @click="selectAllIcos()"
                    >
                    <v-list-item-action>
                      <v-icon >
                        {{ icosEdited.length === iconographyList.length ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                      </v-icon>
                    </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          Select All
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
              </v-combobox>
            </v-col>
            <v-col>
              <v-combobox
                v-model="prsEdited"
                :items="prsList"
                label="Painted Representation"
                chips
                deletable-chips
                multiple>
                  <template v-slot:prepend-item>
                    <v-list-item
                      ripple
                      @mousedown.prevent
                      @click="selectAllPrs()"
                    >
                    <v-list-item-action>
                      <v-icon >
                        {{ prsEdited.length === prsList.length ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                      </v-icon>
                    </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          Select All
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
              </v-combobox>
            </v-col>
            <v-col>
              <v-combobox
                v-model="bibliosEdited"
                :items="biblios"
                label="Annotated Bibliography"
                chips
                deletable-chips
                small-chips
                multiple>
                  <template v-slot:prepend-item>
                    <v-list-item
                      ripple
                      @mousedown.prevent
                      @click="selectAllBiblios()"
                    >
                    <v-list-item-action>
                      <v-icon >
                        {{ bibliosEdited.length === biblios.length ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                      </v-icon>
                    </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          Select All
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:item="{ index, item }">
                    <v-text-field
                      style="display: flow-root!important"
                      v-html="item.text"
                      autofocus
                      flat
                      background-color="transparent"
                      hide-details
                    ></v-text-field>
                  </template>
              </v-combobox>
            </v-col>
        </v-row>
      </div>
      <div id="2" v-if="!editing && isFirst">
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
              <a :href="getBiblioURL(item_biblio.value)" v-html="'Annotated Bibliography ' + item_biblio.value + ' (' + item_biblio.text + ')'">
              </a>
            </v-card-text>
          </div>
        </v-expand-transition>
      </div>
      <v-divider id="3" v-if="(item.iconography && item.iconography.length>0)||(item.caves && item.caves.length>0)||(item.prs && item.prs.length>0)"></v-divider>
      <v-range-slider
        v-if="isFirst && item.chronologicalRangeMin && !editing"
        v-model="chronologicalRangeComputed"
        min="-425"
        max="2025"
        step="25"
        thumb-label="always"
        readonly
        ticks
        hide-details
        thumb-size=46
        class="mt-15 mx-5"
        label="Chronological Range"
      >
      <template v-slot:thumb-label="{ value }">
        {{ chronologicalRange[((value+425) / 25)] }}
      </template>
      </v-range-slider>
      <v-range-slider
        v-if="isFirst && editing"
        v-model="chronologicalRangeSelectedModified"
        min="-425"
        max="2025"
        step="25"
        thumb-label="always"
        ticks
        hide-details
        thumb-size=46
        class="mt-15 mx-5"
        label="Chronological Range"
      >
      <template v-slot:thumb-label="{ value }">
         {{ chronologicalRange[((value+425) / 25)] }}
      </template>
      </v-range-slider>
      <v-divider v-if="isFirst && item.chronologicalRangeMin"></v-divider>
      <v-divider v-if="$store.state.user.accessLevel === 4 && editing"/>
      <v-subheader v-if="$store.state.user.accessLevel === 4 && editing">
        Info-Section
      </v-subheader>
      <v-row v-if="$store.state.user.accessLevel === 4 && editing">
        <v-col>
          <v-checkbox
            class="mx-5"
            label="Publish in Info-Section"
            v-model="isInfoEdited"
          >
          </v-checkbox>
        </v-col>
        <v-col>
          <v-combobox
            v-if="isInfoEdited"
            :items="intro.introSections"
            v-model="infoRank"
            hide-details
            single-line
            class="mx-5"
            title="Info-Section Rank"
            style="z-index: 10;"
          >
            <template v-slot:item="{ index, item }">
              <v-text-field
              style="display: flow-root!important"
                v-html="getSpliceOfText(item.introBody)"
                autofocus
                flat
                background-color="transparent"
                hide-details
              ></v-text-field>
            </template>
            <template v-slot:selection="{ attrs, item, parent, selected }">
              <v-text-field
              style="display: flow-root!important"
                v-html="getSpliceOfText(item.introBody)"
                autofocus
                flat
                background-color="transparent"
                hide-details
              ></v-text-field>
            </template>

          </v-combobox>
        </v-col>
      </v-row>
      <v-alert type="warning" dense v-model="unpublishedAlert" border="left">Post is not published yet, waiting for authorisation by Admins.</v-alert>
      <v-card-text v-if="!editing" v-html="item.body"></v-card-text>
      <div v-if="editing">
      <trumbowyg
        ref="editorEditedText"  class="mx-5" v-model="editedText"
      />
      </div>
      <v-card-text v-if="!isFirst" class="font-weight-bold text-right">{{"(by: " + item.user + ", on: " + new Date(item.date).toGMTString()+")"}}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          @click="showEditor = !showEditor"
          color="success"
          v-if="$store.state.user.granted"
        >
          Reply
        </v-btn>
        <v-spacer v-if="editing"></v-spacer>
        <v-btn
          @click="editing=false"
          color="success"
          v-if="editing"
        >
          {{"Cancel"}}
        </v-btn>
        <v-spacer v-if="$store.state.user.userID === item.userID"></v-spacer>
        <v-btn
          @click="editingClicked()"
          color="success"
          v-if="$store.state.user.userID === item.userID"
        >
          {{editing ? 'Save' : 'Edit'}}
        </v-btn>
        <v-spacer v-if="$store.state.user.accessLevel === 4 && !item.published"></v-spacer>
        <v-btn
          v-if="$store.state.user.accessLevel === 4 && !item.published"
          @click="publish()"
          class="ml-3"
        >
          Publish
        </v-btn>
        <v-spacer v-if="$store.state.user.userID === item.userID"></v-spacer>
        <v-btn
          v-if="$store.state.user.userID === item.userID"
          color="success"
          @click="subscribe({'isSubscribed': !isSubscribed, 'uuid':uuid})"
        >
          {{ isSubscribed ? 'unsubscribe' : 'subscribe' }}
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="showEditor">
          <trumbowyg
            ref="editorReply"  class="mx-5" v-model="replyBody" @update="textChangedAnswer"
          />
          <v-col>
            <v-btn @click="postAnswer" dense block color="success">Submit</v-btn>
            <v-spacer ></v-spacer>
            <v-alert v-model="postError" dismissible color="red"> Connot post empty reply!</v-alert>
          </v-col>
        </div>
      </v-expand-transition>
    <div v-if="publishedComments.length>0"   class="mx-5 mt-3">
      <v-expansion-panels dense Focusable v-model="showAnswers">
        <v-expansion-panel class=" mb-5">
        <v-expansion-panel-header>
            {{showAnswers === 0 ? 'Hide Answers' : 'Show Answers'}}
        </v-expansion-panel-header>
          <v-expansion-panel-content>
            <discussion
              @clicked="setComment"
              @publish="publishedComment"
              @editComment="editComment"
              @subscribe="subscribe"
              v-for="(item, index) in publishedComments"
              :uuid="item.uuid"
              :item="item"
              :key="index"
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
import { v4 as uuidv4 } from 'uuid';
import trumbowyg from '@/components/trumbowyg.vue'
import {getSpliceOfText} from  "@/utils/helpers"


export default {
  components: {
    discussion,
    trumbowyg
  },
  name: 'discussion',
  props: {
    biblios:{
      type: Array,
      default: function(){
        return []
      }
    },
    uuid:{
      type: String,
      default: function(){
        return ""
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
    intro:{
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
      isInfoEdited:false,
      infoRank:null,
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
    chronologicalRangeComputed(){
      return [this.item.chronologicalRangeMin, this.item.chronologicalRangeMax]
    },
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
      for (let keyword of this.item.keywordList){
        if (keywordText === ""){
          keywordText = keyword
        } else {
          keywordText += ", " + keyword
        }
      }
      return keywordText
    },
    isSubscribed(){
      this.$log.debug("subscribed:", this.subscribed);
      if (this.unsubscribed.includes(this.$store.state.user.userID)){
        return false
      } else if (this.subscribed.includes(this.$store.state.user.userID)){
        return true
      }
      return false
    },
  },
  methods: {
    getSpliceOfText(text){
      return getSpliceOfText(text)
    },
    textChangedEditedText(body){
      this.editedText = body
    },
    textChangedAnswer(body){
      this.replyBody = body
    },
    selectAllBiblios(){
      if (this.bibliosEdited.length === this.biblios.length){
        this.bibliosEdited = []
      } else {
        this.bibliosEdited = this.biblios
      }
    },
    selectAllPrs(){
      if (this.prsEdited.length === this.prsList.length){
        this.prsEdited = []
      } else {
        this.prsEdited = this.prsList
      }
    },
    selectAllIcos(){
      if (this.icosEdited.length === this.iconographyList.length){
        this.icosEdited = []
      } else {
        this.icosEdited = this.iconographyList
      }
    },
    selectAllCaves(){
      if (this.cavesEdited.length === this.cavesList.length){
        this.cavesEdited = []
      } else {
        this.cavesEdited = this.cavesList
      }
    },
    publishedComment(value){
      this.$log.debug("publishing triggered", value);
      let newComments = []
      let messageText = ""
      for (let comment of this.item.comments){
        if (comment.uuid === value){
          comment["published"] = true
          messageText = comment.body
          newComments.push(comment)
        } else {
          newComments.push(comment)
        }
      }
      this.$log.debug(newComments);
      let data = {
        "comment": newComments,
        "sendMail": true,
        "text": messageText
      }
      this.$emit('clicked', data)
    },
    publish(){
      this.$log.debug("item", this.uuid);
      this.$emit('publish', this.uuid)
    },
    getIntroSection(id){
      this.$log.debug("intro", this.intro, id)
      for (let introSection of this.intro.introSections){
        this.$log.debug("introSectionid", introSection.id, id)
        if (introSection.id === id){
          this.$log.debug("found introSection!", introSection)
          return introSection
        }
      }
    },
    editingClicked(){
      if (!this.editing){
        this.isInfoEdited = this.item.isInfo
        this.infoRank = this.getIntroSection(this.item.introSection)
        this.icosEdited = this.item.iconography
        this.cavesEdited = this.item.caves
        this.prsEdited = this.item.prs
        this.editedText = this.item.body
        this.bibliosEdited = this.item.bibliography
        this.topicTitleEdited = this.item.title
        this.chronologicalRangeSelectedModified = [this.item.chronologicalRangeMin, this.item.chronologicalRangeMax]
        this.keywordsSelectedModified = this.item.keywordList
        this.editing = true
      } else {
        this.$log.debug("saving", this.isFirst);
        this.editing = false
        let data = {
          "uuid": this.uuid,
          "user": this.$store.state.user.lastname + ", " + this.$store.state.user.firstname,
          "userID": this.$store.state.user.userID,
          "body": this.editedText,
          "comments": this.item.comments,
          "date" : this.item.date,
          "latestUpdate": Date.now(),
          "published": this.item.published
        }
        if (this.isFirst){
          data["isInfo"] = this.isInfoEdited
          data["title"] = this.topicTitleEdited
          data["prs"] = this.prsEdited
          data["caves"] = this.cavesEdited
          data["bibliography"] = this.bibliosEdited
          data["iconography"] = this.icosEdited
          data["subscribed"] = this.subscribed
          data["unsubscribed"] = this.unsubscribed
          data["keywordList"] = this.keywordsSelectedModified
          data["chronologicalRangeMin"] = this.chronologicalRangeSelectedModified[0]
          data["chronologicalRangeMax"] = this.chronologicalRangeSelectedModified[1]
          if (this.isInfoEdited){
            if (this.infoRank){
              data["introSection"] = this.infoRank.id
            }
          }
        }
        console.log("saving", data, this.isInfoEdited)
        this.$emit('editComment', data)

      }
    },
    editComment(value){
      this.$log.debug("editCommentTriggered", value);
      this.$log.debug("former comments:", this.item.comments);
      let newComments = []
      for (let comment of this.item.comments){
        if (comment.uuid === value.uuid){
          value["parentUuid"] = comment.parentUuid
          newComments.push(value)
        } else {
          newComments.push(comment)
        }
      }
      let data = {
        "comment": newComments,
        "sendMail": false,
        "text": ""
      }
      this.$emit('clicked', data)
    },
    subscribe(value){
      var data = {"isSubscribed": value.isSubscribed, "uuid":this.uuid}
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
          "parentUuid": this.uuid,
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
        this.$log.debug("THIS.ITEM", this.item);
        this.$log.debug("newComments", newComments);
        newComments.push(newComment)
        this.$log.debug("post answer", newComments);
        let data = {
          "comment": newComments,
          "sendMail": false,
          "text": ""
        }
        this.$emit('clicked', data)

      } else {
        this.postError = true
      }
    },
    setComment(newComment){
      this.$log.debug("setComment", newComment.comment);
      this.$log.debug("oldComments", this.item.comments);
      var newComments = []
      for (let comment of this.item.comments){
        this.$log.debug("comment", comment);
        if (comment.uuid === newComment.comment[0].parentUuid){
          var addedComment = Object.assign({}, comment)
          addedComment.comments = newComment.comment
          this.$log.debug("addedComment", addedComment);
          newComments.push(addedComment)
        } else {
          newComments.push(comment)
        }
      }
      this.$log.debug("newComments", newComments);
      let data = {
        "sendMail" : false,
        "comment": newComments,
        "text": ""

      }
      this.$emit('clicked', data)
    }
  },
  mounted:function () {
    this.$log.debug("discussions called");
    if (!this.item.published){
      this.unpublishedAlert = true
    }
    if (!this.$store.state.user.granted){
      this.showEditor = false
    }

  },
  watch: {
    'subscribed': function(newVal, oldVal) {
      this.$log.debug("subscribed:", newVal);
    },
    'unsubscribed': function(newVal, oldVal) {
      this.$log.debug("unsubscribed:", newVal);
    },
    'showAnswers': function(newVal, oldVal) {
      this.$log.debug("showAnswers:", newVal);
    }

  },
}

</script>

<style lang="css">
.v-expansion-panel-content__wrap {
  padding: 0px
}
</style>
