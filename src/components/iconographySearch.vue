<template>
    <v-card outlined>
        <v-list-item-subtitle>Annotations</v-list-item-subtitle>
        <v-text-field v-model="search" label="Search Iconography Tree" hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
        <v-lazy
            transition="scroll-x-reverse-transition"
        >
        <v-treeview :selection-type="getSelectionType" :filter="filter" item-key="iconographyID" :search="search" return-object v-model="iconographySelected" rounded  selectable hoverable open-all :items="iconography" dense >
                <template class="v-treeview-node__label" slot="label" slot-scope="{ item }">
                <div class="v-treeview-node__label">
                {{ item.name }}
                  <v-badge v-if = "isDepiction"
                    :content="getCount(item)"
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
    preSelected:null,
    mode:{
      default: "depiction",
      type: String
    }
  },
  data () {
    return {
      update:true,
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
    getCount(item){
      if (item.count){
        return item.count.length
      } else {
        return -1
      }
    },
    clear(){
      this.update = false;
      this.search = "";
      this.iconographySelected = [];
    },
    getPreSelectedByName(){
      let selected = []
      let names = []
      if (this.preSelected){
        if (Array.isArray(this.preSelected)){
          names = this.preSelected
        } else {
          names = [this.preSelected]
        }
      }
      for (const name of names){
        for (const ico of this.iconography){
          selected = selected.concat(this.getIcosByName(ico, name, false))
        }
      }
      this.iconographySelected = selected
    },
    getIcosByName(ico, name, found){
      let selected = []
      if (ico.name === name){
        found = true
      }
      if (found){
        selected.push(ico)
      }
      if (ico.children){
        if (ico.children.length > 0){
          for (const child of ico.children) {
            selected = selected.concat(this.getIcosByName(child, name, found))
          }
        }
      }
      return selected

    },
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
      element['count'] = []
      let newChildren = []
      if (this.aggregations){
        for (let agg of this.aggregations){
          if (agg.key === element.iconographyID){
            element['count'] = agg.test.depictionID.buckets
            console.log("aggs found for elemen:", element);
            break
          }
        }
        if (element.children){
          for (let child of element.children){
            let res = this.setAggsInElement(child)
            if (res != null){
              for (var depictionID of res.count){
                let elDepictionID = element.count.find(item => item.key === depictionID.key)
                if (elDepictionID === undefined){
                  element.count.push(depictionID)
                }
              }
              newChildren.push(child)
            }
          }
        }
        element.children = newChildren
        if (element.count.length > 0){
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
                  "field": "relatedAnnotationList.tags.iconographyID",
                  "size": 10000
                },
                "aggs": {
                  "test": {
                    "reverse_nested": {},
                    "aggs": {
                      "depictionID": {
                        "terms": {
                          "field": "depictionID"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
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
    'preSelected': function(oldVal, newVal){
      this.getPreSelectedByName()
    },
    'iconographySelected': function(newVal, oldVal) {
      if (this.update){
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
      } else {
        this.update = true
      }
    },
    'aggregations': function(newVal, oldVal) {
      console.log("updated aggregations on iconography", this.aggregations);
      // console.log("length of aggregations: ", this.aggregations.length);
      this.initiateIco()
    },

  },
  mounted:function () {
    console.log("preSelected:", this.preSelected);
    this.initiateIco()
    this.getPreSelectedByName()
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
