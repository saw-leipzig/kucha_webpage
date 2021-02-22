<template>
    <v-card>
      <v-card-title>Information of cave {{getCaveLabel(cave)}} </v-card-title>

      <v-tabs
      v-model="tab"

      >
        <v-tab
          v-for="(item_value, item_name, item_key) in caveInfo"
          :key="item_key"
        >
          {{ item_name }}
        </v-tab>
      </v-tabs>

        <v-card flat>
          <v-row>
            <v-col style="width:50%">
              <v-tabs-items v-model="tab">
                <v-tab-item
                v-for="(item_value, item_name, item_key) in caveInfo"
                :key="item_key"
                >
                  <v-list-item two-line v-for="(value, name, index) in item_value" :key=index>
                    <v-list-item-content>
                      <v-list-item-title>{{name}}</v-list-item-title>
                      <div style="white-space: pre-line;padding:0px 0px 0px 10px;">{{value}}</div>
                    </v-list-item-content>
                  </v-list-item>
                </v-tab-item>
              </v-tabs-items>
            </v-col>
        <div >
          <v-col v-if="cave.caveSketchList">
            <v-row v-for="(item,key) in cave.caveSketchList" :key="key">
              <v-img :lazy-src="getCaveRes(item)"></v-img>
            </v-row>
          </v-col>
        </div>
      </v-row>
        </v-card>


</v-card>

</template>

<script>
import {getCaveLabel,getSiteLabel, getRegionLabel,getDistrictLabel} from  "@/utils/helpers"
export default {

  name: 'caveInf',
  props: {
    cave: {}
  },

  components: {
   },

  data () {

    console.log("cave started.");
    console.log("cave:", this.cave);
    return {
          show: false,
          tab:[]

  }
  },
  computed: {

    caveInfo (){
          var caveInfo={}
          var basciInf = {}
          if (this.cave.officialNumber){
            basciInf["Official Number"]=this.cave.officialNumber
          }
          if (this.cave.historicalName){
            basciInf["Historical Name"]=this.cave.historicalName
          }
          if (this.cave.optionalHistoricName){
            basciInf["Optional Historical Name"]=this.cave.optionalHistoricName
          }
          if (this.cave.firstDocumentedBy){
            basciInf["First Documented By"]=this.cave.firstDocumentedBy
          }
          if (this.cave.firstDocumentedInYear){
            basciInf["First Documented in Year"]=this.cave.firstDocumentedInYear
          }
          if (this.cave.caveGroupID){
            basciInf["Cave Group"]=this.cave.caveGroupID
          }
          if (this.cave.siteID){
            basciInf["Site"]=this.getSite(this.cave.siteID)
          }
          if (this.cave.districtID){
            basciInf["District"]=this.getDistrict(this.cave.districtID)
          }
          if (this.cave.regionID){
            basciInf["Region"]=this.getRegion(this.cave.regionID)
          }
          caveInfo['Basic Information']= basciInf 
          var caveLayout = {}
          var caveMeasurements = {}
          if (this.cave.caveType){
            caveLayout["Cave Type"]=this.cave.caveType.nameEN
          }
          var ceilingTypes=""
          for (var caveArea of this.cave.caveAreaList){
            var mesures=""
            if (caveArea.ceilingType1){
              ceilingTypes+=caveArea.caveAreaLabel+": "+caveArea.ceilingType1.name+"\n"
            }
            if (caveArea.ceilingType2){
              ceilingTypes+=caveArea.caveAreaLabel+": "+caveArea.ceilingType1.name+"(optional second type)\n"
            }
            if (caveArea.expeditionLength > 0){
              mesures+="Length (Expedition Measurement): "+caveArea.expeditionLength.toString()+" m\n";
            }
            if (caveArea.expeditionWidth > 0){
              mesures+="Width (Expedition Measurement): "+caveArea.expeditionWidth.toString()+"m \n";
            }
            if (caveArea.expeditionTotalHeight > 0){
              mesures+="Total Height (Expedition Measurement): "+caveArea.expeditionTotalHeight.toString()+"m \n";
            }
            if (caveArea.expeditionWallHeight > 0){
              mesures+="Wall Height (Expedition Measurement): "+caveArea.expeditionWallHeight.toString()+"m \n";
            }
            if (caveArea.modernMaxHeight > 0){
              mesures+="Maximal Height (Modern Measurement): "+caveArea.modernMaxHeight.toString()+" m\n";
            }
            if (caveArea.modernMaxHeight > 0){
              mesures+="Maximal Height (Modern Measurement): "+caveArea.modernMaxHeight.toString()+" m\n";
            }
            if (caveArea.modernMaxLength > 0){
              mesures+="Maximal Length (Modern Measurement): "+caveArea.modernMaxLength.toString()+" m\n";
            }
            if (caveArea.modernMaxWidth > 0){
              mesures+="Maximal Width (Modern Measurement): "+caveArea.modernMaxWidth.toString()+" m\n";
            }
            if (caveArea.modernMinHeight > 0){
              mesures+="Minimal Height (Modern Measurement): "+caveArea.modernMinHeight.toString()+" m\n";
            }
            if (caveArea.modernMinLength > 0){
              mesures+="Minimal Length (Modern Measurement): "+caveArea.modernMinLength.toString()+" m\n";
            }
            if (caveArea.modernMinWidth > 0){
              mesures+="Minimal Width (Modern Measurement): "+caveArea.modernMinWidth.toString()+" m\n";
            }
            
            if (mesures!=""){
              caveMeasurements["Measurements of "+caveArea.caveAreaLabel]=mesures
            }
          }
          ceilingTypes+=""
          caveLayout["Ceiling Types"]=ceilingTypes
          caveInfo['Layout']= caveLayout 
          caveInfo['Measurements']=caveMeasurements
          var description = ""
          if (this.cave.findings){
            description["findings"]=this.cave.findings
          }
          if (this.cave.notes){
            description["notes"]=this.cave.notes
          }
          var plasticalItems=""
          if (this.cave.hasSculptures) {
            plasticalItems+="has sculptures\n"
          }
          if (this.cave.hasClayFigures) {
            plasticalItems+="has clay figures\n"
          }
          if (this.cave.hasVolutedHorseShoeArch) {
            plasticalItems+="has voluted horse shoe arch\n"
          }
          if (this.cave.hasHolesForFixationOfPlasticalItems) {
            plasticalItems+="has holes for fixation of plastical items Horse Shoe Arch\n"
          }
          if (this.cave.hasWoodenConstruction) {
            plasticalItems+="has wooden construction\n"
          }
          if (description!=""){
            caveInfo["Description"]=description
          }
          return caveInfo
    }
  },
  methods: {
    getCaveRes(item){
      var res="http://127.0.0.1:8182/iiif/2/kucha%2Fcavesketches%2F"+item.caveSketchID+"."+item.imageType+"/full/700,/0/default.jpg"
      console.log(res);
      return res
    },
    getCaveType(ID){
      return this.$store.state.dic.caveType.find(ct => ct.caveTypeID===ID).nameEN
    },
    getSite(ID){
        return getSiteLabel(ID)
    },
    getRegion(ID){
        return getRegionLabel(ID)
    },
    getDistrict(ID){
        return getDistrictLabel(ID)
    },
    getCaveLabel(entry){
      console.log("cave:",entry);
      return getCaveLabel(entry)
    }



  },

}
</script>

<style lang="css" scoped>

.v-list-item__title{
  margin-bottom: 5px;
}
.v-tab {
  padding: 8px;
  min-width: 20px;
}
</style>
