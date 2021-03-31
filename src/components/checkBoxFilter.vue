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
    aggregations:{}
  },
  data () {
    return {

      model:[],
    }
  },
  computed: {
    getCheckBoxData(){
      let newCheckBoxData = {}
      for (let key in this.checkBoxData){
        if (this.getCount(this.checkBoxData[key]) !== null){
          newCheckBoxData[key] = this.checkBoxData[key]
        }
      }
      return newCheckBoxData
    }
  },
  methods: {
    getCount(item){
      if (this.aggregations){
        if (Object.keys(this.aggregations).length > 0){
          let findEl = Object.keys(this.aggregations).find(el => el === item.label)
          if (findEl !== undefined){
            if (this.aggregations[findEl] !== null){
              if (this.aggregations[findEl][1] !== null){
                if (this.aggregations[findEl][1]){
                  return this.aggregations[findEl][1].doc_count
                }
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
      console.log("new CheckBox Model:", newVal);
      this.startSearch()
    },
    'aggregations': function(newVal, oldVal) {
      console.log("updated aggregations on CheckBoxes", this.aggregations);
    },

  },
  mounted:function () {
    console.log("checkBoxData:", this.checkBoxData);
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
