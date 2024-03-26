<template>
        <v-card class="m-4" v-if="item._source!==undefined">
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
        <v-card-text class="mx-2 newsContent" v-if="!editing" v-html="item._source.body"></v-card-text>
        <div v-if="editing">
        <trumbowyg
          ref="editorEditedText"  class="mx-5" v-model="newsBody" @update="textChangedNews"
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
</template>

<script>
import {putNews, publish} from '@/services/repository'
import trumbowyg from '@/components/trumbowyg.vue'


export default {
  components: {
    trumbowyg
  },
  name: 'newsinf',
  props: {

    uuid:{
      type: String,
      default: function(){
        return ""
      }
    },
    news:{
      type: Object,
      default: function(){
        return {}
      }
    },
  },
  data () {
    return {
      editing:false,
      newsBody: "",
      expires: false,
      item: {},
    }
  },
  computed:{

  },
  methods: {
    publish(item){
      publish(item)
        .then( res => {
          const _self = this
          setTimeout(function () {
            _self.$emit('publish')
          }, 2000);
        })
        .catch((error) => {
          this.$log.debug(error)
        })

    },
    editingClicked(item){
      console.log("editing clicked was pressed", item);
      if (!this.editing){
        console.log("switching to editing mode");
        this.editing = true
        this.expires = item._source.isExpiring
        this.newsBody = item._source.body
      } else {
        console.log("saving ")
        item._source.date = Date.now()
        item._source.expires = this.expireDate
        item._source.body = this.newsBody
        putNews(item._source, item._id, true, this.$store.state.user.sessionID)
          .then( res => {
            console.log("saving finished", res);
            this.editing = false
            const _self = this
            setTimeout(function () {
              _self.$emit('publish')
            }, 2000);
          })
          .catch((error) => {
            console.log(error);
            this.$log.debug(error)
          })

      }
    },
    textChangedNews(body){
      this.newsBody = body
    },
    isOutdated(item){
      if (item._source.isExpiring){
        if (item._source.expires < Date.now()){
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
  },
  beforeMount:function () {
    this.$log.debug("newsinf called", this.item);
    this.item = this.news

  },
  watch: {
    'news': function(newVal, oldVal) {
      this.item = this.news;
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
.newsContent * {
  width: 100%
}
</style>
