<template>
    <v-card outlined>
        <v-list-item-subtitle>Iconography</v-list-item-subtitle>
        <v-text-field v-model="search" label="Search Iconography Tree" hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
        <v-lazy
            transition="scroll-x-reverse-transition"
        >
        <v-treeview :selection-type="getSelectionType" :filter="filter" item-key="iconographyID" :search="search" return-object v-model="iconographySelected" rounded  selectable hoverable open-all :items="iconography" dense >
                <template class="v-treeview-node__label" slot="label" slot-scope="{ item }">
                <div class="v-treeview-node__label">
                {{ item.name }}
                  <v-badge v-if = "isDepiction"
                    :content="item.count"
                    inline
                    color="grey"
                  >
                  </v-badge>

                </div>
                </template>
        </v-treeview>
        </v-lazy>
    </v-card>
</template>
<script>

export default {
  name: 'iconographySearch',
  components: {
  },
  props: {
    prefix:"",
    aggregations:{},
    mode:{
      default: "depiction",
      type: String
    }
  },
  data () {
    return {
      visible:true,
      relatedDepictions:[],
      loading: false,
      search: null,
      textSearch:"",
      iconographySelected:[],
      selected:[],
      iconography:[],
      icocounts:{}
    }
  },
  computed: {
    getSelectionType(){
      if (!this.isDepiction){
        return "independent"
      } else {
        return "leaf"
      }
    },
    isDepiction(){
      if (this.mode === "iconography"){
        return false
      } else {
        return true
      }
    },
    filter () {
      return  (item, search, textKey) => {
        if (item.search) {
          return (item["search"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1 || item["name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1)
        } else {
          return (item["name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1)
        }
      }
    },
  },
  methods: {
    initiateIco(){
      this.iconography = []
      let icos = JSON.parse(JSON.stringify(this.$store.state.dic.iconography));
      console.log("Iconography", icos);
      for (let element of icos){
        if (this.mode === "depiction"){
          let res = this.setAggsInElement(element)
          if (res !== null){
            this.iconography.push(res)
          }
        } else if (this.mode === "iconography") {
          this.iconography.push(element)
        }
      }
      console.log("Igonography after filtering", this.iconography);
      // this.setAggs(this.iconography)
    },
    setAggsInElement(element){
      element['count'] = 0
      let newChildren = []
      if (this.aggregations){
        for (let agg of this.aggregations){
          if (agg.key === element.iconographyID){
            element['count'] = agg.doc_count
            break
          }
        }
        if (element.children){
          for (let child of element.children){
            let res = this.setAggsInElement(child)
            if (res != null){
              element.count += res.count
              newChildren.push(child)
            }
          }
        }
        element.children = newChildren
        if (element.count > 0){
          return element
        } else {
          return null
        }
      } else {
        return element
      }
    },
    getSelectedParents(element, selectedItems){
      let foundAll = false
      if (element.children){
        if (element.children.length > 0){
          foundAll = true
          for (let child of element.children){
            if (!this.getSelectedParents(child, selectedItems)){
              foundAll = false
            }
          }
        }
      }
      if (selectedItems.includes(element) || foundAll){
        if (!selectedItems.includes(element)){
          selectedItems.push(element)
        }
        return true
      } else {
        return null
      }
    },
    prepSearch(){
      let searchObjects = []
      let icoAggs = {}
      let icoPath = this.prefix + "iconographyID"
      if (this.isDepiction){
        if (this.selected.length > 0){
          let iconographySearchIDs = []
          for (let ico of this.selected){
            iconographySearchIDs.push(ico.iconographyID)
          }
          let icoSearch = {
            "nested": {
              "path": "relatedAnnotationList",
              "query": {
                "nested": {
                  "path": "relatedAnnotationList.tags",
                  "query": {
                    "terms": {
                    }
                  }
                }
              }
            }
          }
          icoSearch.nested.query.nested.query.terms[icoPath] = iconographySearchIDs
          searchObjects.push(icoSearch)
          icoAggs.filter = {
            "Tags": {
              "nested": {
                "path": "relatedAnnotationList.tags"
              },
              "aggs": {
                "iconographyID": {
                  "filter": {
                    "terms": {
                    }
                  },
                  "aggs": {
                    "comment_to_issue": {
                      "reverse_nested": {}
                    }
                  }
                }
              }
            }
          }
          icoAggs.filter.Tags.aggs.iconographyID.filter.terms[icoPath] = iconographySearchIDs
        }
        icoAggs.agg = {
          "Tags": {
            "nested": {
              "path": "relatedAnnotationList.tags"
            },
            "aggs": {
              "iconographyID": {
                "terms": {
                }
              }
            }
          }
        }
        icoAggs.agg.Tags.aggs.iconographyID.terms["field"] = icoPath
        icoAggs.agg.Tags.aggs.iconographyID.terms["size"] = 10000
        console.log("searchObject", searchObjects)
      } else {
        let icoPath = this.prefix + "iconographyID"
        if (this.selected.length > 0){
          let iconographySearchIDs = []
          for (let ico of this.selected){
            iconographySearchIDs.push(ico.iconographyID)
          }
          let icoSearch = {
            "terms": {
            }
          }
          icoSearch.terms[icoPath] = iconographySearchIDs
          searchObjects.push(icoSearch)
          icoAggs.filter = {
            "iconographyID": {
              "filter": {
                "terms": {
                }
              },
            }
          }
          icoAggs.filter.iconographyID.filter.terms[icoPath] = iconographySearchIDs
        }
        icoAggs.agg = {
          "iconographyID": {
            "terms": {
            }
          }
        }
        icoAggs.agg.iconographyID.terms["field"] = icoPath
        icoAggs.agg.iconographyID.terms["size"] = 10000
        console.log("searchObject", searchObjects);
      }
      let result = {
        "search": searchObjects,
        "aggs":  icoAggs
      }
      return result
    },
    startSearch(){
      let result = this.prepSearch()
      this.$emit('clicked', result)
    },
  },
  watch: {
    'iconographySelected': function(newVal, oldVal) {
      console.log("iconographySelected Updated", newVal);
      this.selected = []
      for (let node of newVal){
        this.selected.push(node);
      }
      if (this.isDepiction){
        for (let node of this.iconography){
          this.getSelectedParents(node, this.selected)
        }
      }
      console.log("seletctedItems after adding parents: ", this.selected);
      this.startSearch()
    },
    'aggregations': function(newVal, oldVal) {
      console.log("updated aggregations on iconography", this.aggregations);
      console.log("length of aggregations: ", this.aggregations.length);
      this.initiateIco()
    },

  },
  mounted:function () {
    this.initiateIco()
  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >

.v-tab {
  padding: 8px;
  min-width: 20px;
}

.v-treeview-node__content, .v-treeview-node__label {
  flex-shrink: 1;
  white-space: inherit;
}
.v-treeview-node__root {
    height: auto;
}
.v-treeview-node {
  min-height: 10px;
}
.v-treeview--dense .v-treeview-node__root
{
  min-height: 10px;
}
.v-treeview {
overflow-x: auto;
overflow-y: auto;
max-height: 300px;
}
</style>
