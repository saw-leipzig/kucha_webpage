<template>
    <v-card outlined>
        <v-list-item-subtitle>Annotations</v-list-item-subtitle>
        <v-row>
          <v-col cols="12">
            <v-checkbox
              dense
              @change="startSearch"
              v-model="includeIco"
              label="Include related Painted Representations WITHOUT Annotations as well"
            ></v-checkbox>
          </v-col>
        </v-row>        <v-row>
          <v-col cols="8">
            <v-text-field v-model="search" label="Search Iconography Tree" hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-combobox label="Selection Type" v-model="selectedSelectionType" :items="selectionTypes"></v-combobox>
          </v-col>
        </v-row>
        <v-row v-show="!isReady">
          <v-col>
            <v-layout align-center justify-center column fill-height>
            <v-progress-circular v-if="true" color="primary" indeterminate />
            </v-layout>
          </v-col>
        </v-row>
        <v-lazy v-model="isReady"
            transition="scroll-x-reverse-transition"
        >
        <v-treeview ref="tree" @input="select" style="max-height: 300px!important;"  :filter="filter" item-key="iconographyID" :search="search" return-object  rounded  hoverable open-all :items="iconography" dense >
                <template v-slot:prepend="{item}" >
                  <v-checkbox hide-details class="shrink mr-2 mt-0" dense  @click="selectedIco(item)" v-model="item.checked" ></v-checkbox>
                </template>
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
    altPrefix:"",
    aggregations:{},
    preSelected:null,
    mode:{
      default: "depiction",
      type: String
    }
  },
  data () {
    return {
      includeIco: false,
      newSelected:[],
      update:true,
      visible:true,
      relatedDepictions:[],
      loading: false,
      search: null,
      textSearch:"",
      iconographySelected:[],
      iconographySelectedWhileReload:[],
      selected:[],
      checkedSelected:[],
      iconography:[],
      icocounts:{},
      selectionTypes: ["leaf", "independent"],
      selectedSelectionType: "leaf",
      selectedGroups: [],
      selectedTriggered:false,
      isReady:false
    }
  },
  computed: {
    hasAggs(){
      return this.isReady
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
          // .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          return (item["search"].toLowerCase().indexOf(search) > -1 || item["name"].toLowerCase().indexOf(search) > -1)
        } else {
          return (item["name"].toLowerCase().indexOf(search) > -1)
        }
      }
    },
  },
  methods: {
    setCheckedInChildren(item, checked){
      item.checked = checked
      if (checked){
        this.selected.push(item)
      } else {
        const index = this.selected.indexOf(item);
        if (index > -1) {
          this.selected.splice(index, 1);
        }
      }
      for (let child of item.children){
        this.setCheckedInChildren(child, checked)
      }
    },
    selectedIco(item){
      if (this.selectedSelectionType === "leaf"){
        this.setCheckedInChildren(item, item.checked)
      }
      this.selectedGroups = []
      for (let root of this.iconography) {
        this.getTreeGroups(root)
      }
      for (let group of this.selectedGroups){
        console.log("getTreeGroups", group);
      }
      this.startSearch()

    },
    getCount(item){
      if (item.count){
        return item.count.length
      } else {
        return 0
      }
    },
    clear(){
      this.update = false;
      this.search = "";
      this.iconographySelected = [];
      for (let root of this.iconography){
        this.setCheckedInChildren(root, false)
      }
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
      console.log("getPreSelectedByName found selected:", selected);
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
      if (this.iconographySelected.length > 0){
        this.selectedTriggered = true
      }
      console.log("select triggered initiateICO")
      console.log("iconographySelectedLocal before initiate Ico", this.iconographySelected.length);
      // this.iconography = []
      // this.iconographySelectedWhileReload = JSON.parse(JSON.stringify(this.iconographySelected));
      // this.iconographySelected = []
      // console.log("Iconography", icos);
      let icoTree = []
      for (let element of this.iconography){
        if (this.mode === "depiction"){
          let res = this.setAggsInElement(element)
          if (res !== null){
            icoTree.push(res)
          }
        } else if (this.mode === "iconography") {
          icoTree.push(element)
        }
      }
      if (this.$refs.tree) {
        console.log("iconographySelectedLocal refs.tree found");
        this.$refs.tree.updateAll(false)
      }
      this.iconography = icoTree
      this.iconographySelected = this.iconographySelectedWhileReload
      if (this.$refs.tree) {
        this.$refs.tree.updateAll(true)
      }
      this.isReady  = true
      console.log("iconographySelectedLocal", this.iconographySelected.length);
      // this.setAggs(this.iconography)
    },
    setAggsInElement(element){
      element['count'] = []
      if (!element.oldChildren){
        element.oldChildren = JSON.parse(JSON.stringify(element.children));
      } else {
        for (let oldChild of element.oldChildren){
          let child = element.children.find(el => el.iconographyID === oldChild.iconographyID)
          if (child){
            oldChild.checked = child.checked
          } else {
            oldChild.checked = false
          }
        }
      }
      if (!element.checked){
        element['checked'] = false
      }
      if (this.aggregations){
        for (let agg of this.aggregations){
          if (agg.key === element.iconographyID){
            element['count'] = agg.test.depictionID.buckets
            break
          }
        }
        element.children = []
        if (element.oldChildren){
          for (let child of element.oldChildren){
            let res = this.setAggsInElement(child)
            if (res != null){
              if (this.selectedSelectionType === "leaf"){
                for (var depictionID of res.count){
                  let elDepictionID = element.count.find(item => item.key === depictionID.key)
                  if (elDepictionID === undefined){
                    element.count.push(depictionID)
                  }
                }
              }
              element.children.push(child)
            }
          }
        }
        if (this.selectedSelectionType === 'leaf'){
          if (element.count.length > 0){
            return element
          } else {
            // let selectedItem = this.selected.find(el => el.iconographyID === element.iconographyID)
            // if (selectedItem) {
            //   console.log("found idden selected item:", selectedItem);
            //   const index = this.selected.indexOf(selectedItem);
            //   if (index > -1) {
            //     this.selected.splice(index, 1);
            //   }
            // }
            return null
          }
        } else {
          if (element.children.length > 0){
            return element
          } else {
            if (element.count.length > 0){
              return element
            } else {
              return element
            }
          }
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
          this.selected.push(element)
        }
        return true
      } else {
        return null
      }
    },
    buildAggs(aggs, icoIDs, icoPath){
      console.log("icoAggs buildaggs", icoIDs);
      let newAggs = {}
      if (Object.keys(aggs).length === 0){
        if (!this.includeIco){
          newAggs = {
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
        } else {
          newAggs = {
            "Tags": {
              "nested": {
                "path": "relatedIconographyList"
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
        }

      } else {
        if (!this.includeIco){
          newAggs = {
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
                }
              }
            }
          }
          newAggs.Tags.aggs.iconographyID['aggs'] = aggs
        } else {
          newAggs = {
            "Tags": {
              "nested": {
                "path": "relatedIconographyList"
              },
              "aggs": {
                "iconographyID": {
                  "filter": {
                    "terms": {
                    }
                  },
                }
              }
            }
          }
          newAggs.Tags.aggs.iconographyID['aggs'] = aggs
        }
      }
      newAggs.Tags.aggs.iconographyID.filter.terms[icoPath] = icoIDs.pop()
      if (icoIDs.length > 0){
        this.buildAggs(newAggs, icoIDs, icoPath)
      }
      return newAggs
    },
    select(){
      console.log("select triggered");
      if (this.update){
        console.log("iconographySelected Updated");
        this.selected = []
        for (let node of this.iconographySelected){
          this.selected.push(node);
        }
        console.log("this.selected", this.selected);
        if (this.selectedSelectionType === "leaf"){
          if (this.isDepiction){
            for (let node of this.iconography){
              this.getSelectedParents(node, this.selected)
            }
          }
          console.log(" getTreeGroups selected after adding parents: ", this.selected);
          this.checkedSelected = []
          this.selectedGroups = []
          for (let root of this.iconography) {
            this.getTreeGroups(root)
          }
          for (let group of this.selectedGroups){
            console.log("getTreeGroups", group);
          }

        }
        if (!this.selectedTriggered || this.iconographySelected.length === 0){
          this.startSearch()
        }
        this.selectedTriggered = false
      } else {
        this.update = true
      }
    },
    getTreeGroups(tree){
      if (tree.checked){
        let found = false
        for (let selectedGroup of this.selectedGroups){
          if (selectedGroup.find(el => el === tree.parentID)){
            found = true
            selectedGroup.push(tree.iconographyID)
          }
        }
        if (!found) {
          this.selectedGroups.push([tree.iconographyID])
        }
      }
      if (this.selected.length > this.checkedSelected.length){
        for (let child of tree.children){
          this.getTreeGroups(child)
        }
      }

    },
    prepSearch(){
      console.log("prepsearch triggered", this.selected);
      let searchObjects = []
      let icoAggs = {}
      let icoPath = ""
      if (!this.includeIco){
        icoPath = this.prefix + "iconographyID"
      } else {
        icoPath = this.altPrefix + "iconographyID"
      }
      if (this.isDepiction){
        if (this.selectedGroups.length > 0){
          for (let ico of this.selectedGroups){
            console.log("preparing group for:", ico);
            let icoSearch = {}
            if (!this.includeIco){
              icoSearch = {
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
            } else {
              icoSearch = {
                "nested": {
                  "path": "relatedIconographyList",
                  "query": {
                    "nested": {
                      "path": "relatedIconographyList",
                      "query": {
                        "terms": {
                        }
                      }
                    }
                  }
                }
              }

            }
            icoSearch.nested.query.nested.query.terms[icoPath] = ico
            searchObjects.push(icoSearch)
          }
          icoAggs.filter = this.buildAggs({}, this.selectedGroups, icoPath)
        }
        if (!this.includeIco){
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
                            "field": "depictionID",
                            "size": 1000
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          icoAggs.agg = {
            "Tags": {
              "nested": {
                "path": "relatedIconographyList"
              },
              "aggs": {
                "iconographyID": {
                  "terms": {
                    "field": "relatedIconographyList.iconographyID",
                    "size": 10000
                  },
                  "aggs": {
                    "test": {
                      "reverse_nested": {},
                      "aggs": {
                        "depictionID": {
                          "terms": {
                            "field": "depictionID",
                            "size": 1000
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        console.log("icoAggs:", icoAggs);
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
        "aggs":  icoAggs,
        "ico": this.selected
      }
      console.log("prepsearch ended");
      return result
    },
    startSearch(){
      let result = this.prepSearch()
      this.$emit('clicked', result)
      console.log("start search ended");
    },
  },
  watch: {
    'preSelected': function(oldVal, newVal){
      this.getPreSelectedByName()
    },
    'iconographySelected': function(newVal, oldVal) {

    },
    'selectedSelectionType': function(newVal, oldVal){
      this.initiateIco()
    },
    'aggregations': function(newVal, oldVal) {
      console.log("select triggered updated aggregations on iconography");
      // console.log("length of aggregations: ", this.aggregations.length);
      this.initiateIco()
    },

  },
  mounted:function () {
    this.iconography = JSON.parse(JSON.stringify(this.$store.state.iconography));
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
.v-messages {
  min-height: 0px;
}
.v-input--selection-controls {
    margin-top: 5px;
    padding-top: 0px;
}
</style>
