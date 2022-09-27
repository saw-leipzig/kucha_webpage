<template>
    <v-card outlined>
        <v-list-item-subtitle>Wall Location</v-list-item-subtitle>
        <v-text-field v-model="search" label="Search WallLocation Tree" hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
        <v-lazy
            transition="scroll-x-reverse-transition"
        >
        <v-treeview style="max-height: 300px!important;" selection-type="leaf" :filter="filter" item-key="wallLocationID" :search="search" v-model="wallLocationSelected" rounded  selectable hoverable open-all :items="getWallLocations" dense >
                <template  class="v-treeview-node__label" slot="label" slot-scope="{ item }">
                <div class="v-treeview-node__label">
                  {{ item.name }}
                  <v-badge v-if="item.count"
                    :content="item.count.size"
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
  name: 'wallSearch',
  components: {
  },
  props: {
    prefix:"",
    aggregations:{}
  },
  data () {
    return {
      update:true,
      visible:true,
      relatedDepictions:[],
      loading: false,
      search: null,
      textSearch:"",
      wallLocationSelected:[],
      selected:[],
      wallLocations:[],

    }
  },
  computed: {
    getWallLocations(){
      if (this.$store.state.wallLocation.length === 0){
        this.$store.dispatch('getWallLocation')
      }
      let wallLocations = []
      let walls = this.$store.state.wallLocation
      this.$log.debug("walls", walls)
      for (let element of walls){
        let el = Object.assign({}, element)
        let res = this.setAggsInElement(el)
        this.$log.debug("result of res count for:", element, ":", res)
        if (res !== null){
          if (res.count.size > 0){
            wallLocations.push(res)
          }
        }
      }
      // wallLocations = walls
      // this.$log.debug("walls after filtering", this.wallLocations);
      // this.setAggs(this.walls)
      return wallLocations
    },
    filter () {
      return  (item, search, textKey) => {
        this.$log.debug("count of item: ", item, "returning:", ((item["name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1) && (this.getCount(item) > 0)))
        return ((item["name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1) && (this.getCount(item) > 0))
      }
    },
  },
  methods: {
    clear(){
      this.update = false
      this.wallLocationSelected = [];
      this.search = "";
    },
    getCount(item){
      if (this.aggregations){
        let res = this.aggregations.find(el => el.key === item.wallLocationID)
        if (res !== undefined){
          return res.doc_count
        } else {
          return "0"
        }
      } else return "-1"
    },
    setAggsInElement(element){
      // element['count'] = 0
      element["count"] = new Set()
      let newChildren = []
      if (this.aggregations){
        for (let agg of this.aggregations){
          if (agg.key === element.wallLocationID){
            for (let bucket of agg.depictionID.amount.buckets){
              element.count.add(bucket.key)
              // if (element.wallLocationID === 102){
              //   this.$log.debug("wallLocationCount of wallLocation", element.wallLocationID, ":", bucket.key, ", count:", element.count);
              // }
            }
            break
          }
        }
        if (element.children){
          for (let child of element.children){
            let res = this.setAggsInElement(child)
            if (res != null){
              for (let depictionID of child.count){
                element.count.add(depictionID)
                // if (element.wallLocationID === 102){
                //   this.$log.debug("wallLocationCount of wallLocation", element.wallLocationID, ":", depictionID, ", count:", element.count);
                // }

              }

              newChildren.push(child)
            }
          }
        }
        element.children = newChildren
        if (element.count.size > 0){
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
      if (foundAll){
        selectedItems.push(element.wallLocationID)
      }
      if (selectedItems.includes(element.wallLocationID)){
        return true
      } else {
        return null
      }
    },
    prepSearch(){
      let searchObjects = []
      let wallLocationAggs = {}
      let wallLoactionPath = this.prefix + "wallLocationID"
      if (this.selected.length > 0){
        let wallLocationSearchIDs = []
        for (let wallLoaction of this.selected){
          wallLocationSearchIDs.push(wallLoaction)
        }
        let wallLoactionSearch = {
          "nested": {
            "path": "wallIDs",
            "query": {
              "terms": {
              }
            }
          }
        }
        wallLoactionSearch.nested.query.terms[wallLoactionPath] = wallLocationSearchIDs
        searchObjects.push(wallLoactionSearch)
        wallLocationAggs.filter = {
          "WallIDs": {
            "nested": {
              "path": "wallIDs"
            },
            "aggs": {
              "wallLocationID": {
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
        wallLocationAggs.filter.WallIDs.aggs.wallLocationID.filter.terms[wallLoactionPath] = wallLocationSearchIDs
      }
      wallLocationAggs.agg = {
        "WallIDs": {
          "nested": {
            "path": "wallIDs"
          },
          "aggs": {
            "wallLocationID": {
              "terms": {
              },
              "aggs": {
                "depictionID": {
                  "reverse_nested": {},
                  "aggs": {
                    "amount": {
                      "terms": {
                        "field": "depictionID",
                        "size": 2000
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      wallLocationAggs.agg.WallIDs.aggs.wallLocationID.terms["field"] = wallLoactionPath
      wallLocationAggs.agg.WallIDs.aggs.wallLocationID.terms["size"] = 10000
      this.$log.debug("searchObject", searchObjects);
      let result = {
        "search": searchObjects,
        "aggs":  wallLocationAggs
      }
      return result
    },
    startSearch(){
      if (this.update){
        let result = this.prepSearch()
        this.$emit('clicked', result)
      } else {
        this.update = true
      }
    },
  },
  watch: {
    'wallLocationSelected': function(newVal, oldVal) {
      if (this.update){
        this.$log.debug("wallLocationSelected Updated", newVal);
        this.selected = []
        for (let node of newVal){
          this.selected.push(node);
        }
        for (let node of this.getWallLocations){
          this.getSelectedParents(node, this.selected)
        }
        this.$log.debug("seletctedItems after adding parents: ", this.selected);
        this.startSearch()
      } else {
        this.update = true
      }
    },


  },
  mounted:function () {
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
  line-break: normal;
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
