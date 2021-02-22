<template>
  <v-container>
    <v-card>
      <v-card-title>
        Basic Information for Painted Representation {{depiction.depictionID}}
      </v-card-title>
      <v-tabs
      v-model="tab"

      >
        <v-tab
          v-for="(item_value, item_name, item_key) in depictionInfo"
          :key="item_key"
        >
          {{ item_name }}
        </v-tab>
      </v-tabs>

        <v-card flat>
          <v-tabs-items v-model="tab">
            <v-tab-item
              v-for="(item_value, item_name, item_key) in depictionInfo"
              :key="item_key"
            >
              <v-list-item two-line v-for="(value, name, index) in item_value" :key=index>
                <v-list-item-content>
                  <v-list-item-title >{{name}}</v-list-item-title>
                  <div v-if="name!='Wall Location'" style="white-space: pre-line;padding:0px 0px 0px 10px;">{{value}}</div>
                  <v-treeview 
                      v-if="name==='Wall Location'"
                      :items="value"
                  ></v-treeview>
                </v-list-item-content>
              </v-list-item>
            </v-tab-item>
          </v-tabs-items>
        </v-card>


    </v-card>
  </v-container>
</template>

<script>
export default {

  name: 'depictionInf',

  props: {
    depiction: {}
  },

  data () {
    console.log("depiction", this.depiction);
    return {
      tab:[]
    }
  },
  computed:{
    depictionInfo(){
      var depictionInf={}
      var mainInf={}
      if (this.depiction.shortName){
        mainInf['Short Name']=this.depiction.shortName
      }
      if (this.depiction.expedition){
        mainInf['Acquired by expredition']=this.depiction.expedition.name
      }
      if (this.depiction.vendor){
        mainInf['Vendor']=this.depiction.vendor.vendorName
      }
      if (this.depiction.purchaseDate){
        mainInf['Date purchased']=this.depiction.purchaseDate
      }
      if (this.depiction.location){
        mainInf['Current Location']=this.depiction.location.name
      }
      if (this.depiction.inventoryNumber){
        mainInf['Inventory Number']=this.depiction.inventoryNumber
      }
      
      depictionInf['Main']=mainInf
      var wallLocation = {}
      console.log("wallIDs",this.depiction.wallIDs);
      if (this.depiction.wallIDs){
        var wallClone = Object.assign({}, this.$store.state.dic.wallLocation)
        var walls=[]
        console.log("WallID",this.depiction.wallIDs);
        for (var key in wallClone){
          var res = this.getWallTree(wallClone[key],this.depiction.wallIDs)
          if (res!=null){
            walls.push(res)
          }
        }
        wallLocation["Wall Location"]= walls
      }
      if (this.depiction.positionNotes){
        wallLocation["Position Notes"]= this.depiction.positionNotes
      }

      depictionInf["Wall"]=wallLocation
      var depictionDes={}
      if (this.depiction.width){
        depictionDes["Width"]=this.depiction.width
      }
      if (this.depiction.height){
        depictionDes["Height"]=this.depiction.height
      }
      if (this.depiction.style){
        depictionDes["Style"]=this.depiction.style.styleName
      }
      if (this.depiction.modeOfRepresentation){
        depictionDes["Mode of Preservation"]=this.depiction.modeOfRepresentation.name
      }
      if (this.depiction.backgroundColour){
        depictionDes["Background Colour"]=this.depiction.backgroundColour
      }
      if (this.depiction.inscriptions){
        depictionDes["Inscriptions"]=this.depiction.inscriptions
      }
      if (this.depiction.separateAksaras){
        depictionDes["Separate Akṣaras"]=this.depiction.separateAksaras
      }
      
      if (this.depiction.dating){
        depictionDes["Dating"]=this.depiction.dating
      }
      if (this.depiction.description){
        depictionDes["Description"]=this.depiction.description
      }
      if (this.depiction.generalRemarks){
        depictionDes["General Remarks"]=this.depiction.generalRemarks
      }
      if (this.depiction.otherSuggestedIdentifications){
        depictionDes["Other Suggested Identifications"]=this.depiction.otherSuggestedIdentifications
      }
      depictionInf["Description"]=depictionDes
      console.log("depictionInf", depictionInf);
      return depictionInf
    }
  },

  methods: {

    getWallTree(wallLocationTree, entries){
      var newChildren=[]
      var newWallLocationTree=Object.assign({},wallLocationTree)
      if (wallLocationTree.children){
        if (Array.isArray(newWallLocationTree.children)){
          for (var child of newWallLocationTree.children){
            var result = this.getWallTree(child, entries)
            if (result!=null){
              newChildren.push(result)
            }
          }
        }
        else{
          var result = this.getWallTree(newWallLocationTree.children, entries)
            if (result!=null){
              newChildren.push(child)
            }
        }

        newWallLocationTree.children=newChildren
      }
    var match= entries.find(el => el.wallLocationID === newWallLocationTree.wallLocationID)
    if ((match!= undefined) || (newWallLocationTree.children.length>0)){
      if (match!=undefined){
        if (match.position){
          var positionName=""
          console.log("wallLocationPosition", match.position);
          for (var pe of match.position){
            if (positionName===""){
              positionName=pe.name
            }
            else{
              positionName+=", "+pe.name
            }
          }
          if (positionName!==""){
            newWallLocationTree.name+=" ("+positionName+")"
          }
          
        }
      }
      console.log("newWallLocationTree", newWallLocationTree);
      return newWallLocationTree
    }
    else{
      return null
    }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
