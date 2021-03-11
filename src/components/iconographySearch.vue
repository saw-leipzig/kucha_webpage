<template>
    <v-card outlined>
        <v-list-item-subtitle>Iconography</v-list-item-subtitle>
        <v-text-field v-model="search" label="Search Iconography Tree" hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
        <v-lazy
            transition="scroll-x-reverse-transition"
        >
        <v-treeview selection-type="leaf" :filter="filter" item-key="iconographyID" :search="search" return-object v-model="iconographySelected" rounded  selectable hoverable open-all :items="iconography" dense >
                <template class="v-treeview-node__label" slot="label" slot-scope="{ item }">
                <div class="v-treeview-node__label">{{ item.name }}</div>
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
    prefix:""
  },
  data () {
    return {
      visible:true,
      relatedDepictions:[],
      loading: false,
      search: null,
      textSearch:"",
      iconographySelected:[],
      selected:[]
    }
  },
  computed: {
    filter () {
      return  (item, search, textKey) => {
        if (item.search) {
          return (item["search"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1 || item["name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1)
        } else {
          return (item["name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(search) > -1)
        }
      }
    },
    iconography () {
      return this.$store.state.dic.iconography
    },
  },
  methods: {
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
    startSearch(){
      let searchObjects = []
      if (this.selected.length > 0){
        let iconographySearchIDs = []
        for (let ico of this.selected){
          iconographySearchIDs.push(ico.iconographyID)
        }
        let icoPath = this.prefix + "iconographyID"
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
      }
      console.log("searchObject", searchObjects);
      this.$emit('clicked', searchObjects)
    },
  },
  watch: {
    'iconographySelected': function(newVal, oldVal) {
      console.log("iconographySelected Updated", newVal);
      this.selected = []
      for (let node of newVal){
        this.selected.push(node);
      }
      for (let node of this.iconography){
        this.getSelectedParents(node, this.selected)
      }
      console.log("seletctedItems after adding parents: ", this.selected);
      this.startSearch()
    }
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
