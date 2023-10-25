<template>
  <v-card outlined v-if = "Object.keys(getCheckBoxData).length > 0">
    <v-list-item-subtitle>{{label}}</v-list-item-subtitle>
    <v-checkbox
      v-for="(item, index) in getCheckBoxData"
      :key="index"
      v-model="model"
      :label="item.label"
      :value="index"
    >
      <template v-slot:label>
        <div>
          {{item.label}}
              <v-badge
                :content="getCount(item)"
                inline
                color="grey"
              >
              </v-badge>
        </div>
      </template>
    </v-checkbox>
  </v-card>
</template>
<script>

export default {
  name: 'checkBoxFilter',
  components: {
  },
  props: {
    label: "",
    checkBoxData:{},
    aggregations:{},
    preSelected:{}
  },
  data () {
    return {

      model:[],
    }
  },
  computed: {
    getCheckBoxData(){
      let newCheckBoxData = {}
      console.log('getCheckBoxData', this.checkBoxData);
      for (let key in this.checkBoxData){
        if (this.getCount(this.checkBoxData[key]) !== null){
          newCheckBoxData[key] = this.checkBoxData[key]
        }
      }
      return newCheckBoxData
    }
  },
  methods: {
    getPreselected(){
      console.log("preselected checkbox", this.preSelected, this.model);
      for (const keySelected in this.preSelected){
        this.model.push(keySelected)
      }
    },
    clear(){
      this.model = [];
    },
    getCount(item){
      if (this.aggregations){
        if (Object.keys(this.aggregations).length > 0){
          console.log("looking for ", item.label, this.aggregations);
          let findEl = Object.keys(this.aggregations).find(el => el === item.label)
          if (findEl !== undefined){
            if (this.aggregations[findEl] !== null){
              let findElCeck = this.aggregations[findEl].find(el => el.key === 1)
              if (findElCeck !== undefined){
                return findElCeck.doc_count
              }
            }
          }

        }
      }
      return null
    },
    prepSearch(){
      let result = {}
      let searchObjects = []
      let aggsObject = {}
      for (let item in this.checkBoxData){
        let checkBoxPath = this.checkBoxData[item]['path'] + item
        aggsObject[item] = {
          "field" :  checkBoxPath
        }
        if (this.model.includes(item)){
          let checkboxSearch = {
            "terms": {
            }
          }
          checkboxSearch.terms[checkBoxPath] = [true]
          aggsObject[item]["ids"] = [true]
          searchObjects.push(checkboxSearch)
        }

      }
      result['search'] = searchObjects
      result['aggs'] = aggsObject

      return result
    },
    startSearch(){
      let result = this.prepSearch()
      this.$emit('clicked', result)
    },
  },
  watch: {
    'model': function(newVal, oldVal) {
      this.$log.debug("new CheckBox Model:", newVal);
      this.startSearch()
    },
    'aggregations': function(newVal, oldVal) {
      this.$log.debug("updated aggregations on CheckBoxes", this.aggregations);
    },

  },
  mounted:function () {
    this.$log.debug("checkBoxData:", this.checkBoxData);
    this.getPreselected()
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
