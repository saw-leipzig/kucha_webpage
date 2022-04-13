<template>
  <v-card raised :width="setWidth ? '98%': 'unset'" style="margin: auto;button:20px;">
    <v-card-title ><a :href="getCaveURL()" style="flex-wrap: wrap;font-size: 1.25rem;font-weight: 500;letter-spacing: .0125em;line-height: 2rem;color: rgba(0,0,0,.87);;word-break: break-all;">Information for cave {{getCaveLabel(cave)}} </a> </v-card-title>
    <v-card class="mx-10">
      <v-tabs
      v-model="tab" v-if="Object.keys(caveInfo).length>0"

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
          <v-col v-if="cave.caveSketchList">
            <v-row v-for="(item,key) in caveScatches" :key="key">
              <v-img v-resize="getCaveRes" contain width="inherit" :src="item"></v-img>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-card>

    <hideRelatedItems v-if="(relatedDepictions.length>0 && showRelatedDepictions)" title="Related Painted Representations" :items="relatedDepictions"></hideRelatedItems>
    <hideRelatedItems v-if="(cave.relatedBibliographyList && cave.relatedBibliographyList.length>0)" title="Related Annotated Bibliography" :items="cave.relatedBibliographyList"></hideRelatedItems>
    <v-card-actions v-if="(versions.length>1 && showRelatedDepictions)">
      <v-btn @click="showVersions = !showVersions"
        color="orange lighten-2"
        text
      >
        Versions
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="showVersions = !showVersions"
      >
        <v-icon>{{ showVersions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
      </v-card-actions>
      <v-expand-transition v-if="versions.length>1">
        <div v-show="showVersions">
          <v-divider></v-divider>
           <v-card class="d-flex pa-2 mx-10" style='background-color: rgba(255, 255, 255, 1) !important'>
            <v-combobox
            style="width:50%"
              class="d-flex justify-center align-center "
              v-model="version"
              :items="versions"
              label="Select Version"
              outlined
              dense
              item-text = "date"
              item-value="_id"
            ></v-combobox>
           </v-card>
        </div>
      </v-expand-transition>

</v-card>

</template>

<script>
import {getCaveLabel} from  "@/utils/helpers"
import {getItemById, getVersionsOfEntry, getVersionOfEntry} from '@/services/repository'

export default {

  name: 'caveInf',
  props: {
    caveDefault: {},
    showRelatedDepictions: {
      type: Boolean,
      default: true
    },
    setWidth: true
  },
  components: {

  },
  data () {
    console.log("cave started.");
    console.log("cave:", this.cave);
    return {
      show: false,
      tab:[],
      cave:{},
      relatedDepictions:[],
      caveScatches:[],
      version:null,
      versions:['current'],
      showVersions: false,
    }
  },
  computed: {
    caveInfo (){
      var caveInfo = {}
      var basciInf = {}
      if (this.cave.officialNumber){
        basciInf["Official Number"] = this.cave.officialNumber
      }
      if (this.cave.historicName){
        basciInf["Historical Name"] = this.cave.historicName
      }
      if (this.cave.optionalHistoricName){
        basciInf["Optional Historical Name"] = this.cave.optionalHistoricName
      }
      if (this.cave.firstDocumentedBy){
        basciInf["First Documented By"] = this.cave.firstDocumentedBy
      }
      if (this.cave.firstDocumentedInYear){
        basciInf["First Documented in Year"] = this.cave.firstDocumentedInYear
      }
      if (this.cave.caveGroupID){
        basciInf["Cave Group"] = this.cave.caveGroupID
      }
      if (this.cave.siteID){
        basciInf["Site"] = this.cave.site.name
      }
      if (this.cave.districtID){
        basciInf["District"] = this.cave.district.name
      }
      if (this.cave.regionID){
        basciInf["Region"] = this.cave.region.englishName
      }
      if (Object.keys(basciInf).length > 0){
        caveInfo['Basic Information'] = basciInf
      }
      var caveLayout = {}
      var caveMeasurements = {}
      if (this.cave.caveType){
        caveLayout["Cave Type"] = this.cave.caveType.nameEN
      }
      var ceilingTypes = ""
      var plasticalItems = ""
      if ( this.cave.caveAreaList){
        for (var caveArea of this.cave.caveAreaList){
          var mesures = ""
          if (caveArea.ceilingType1){
            ceilingTypes += caveArea.caveAreaLabel + ": " + caveArea.ceilingType1.name + "\n"
          }
          if (caveArea.ceilingType2){
            ceilingTypes += caveArea.caveAreaLabel + ": " + caveArea.ceilingType1.name + "(optional second type)\n"
          }
          if (caveArea.expeditionLength > 0){
            mesures += "Length (Expedition Measurement): " + caveArea.expeditionLength.toString() + " m\n";
          }
          if (caveArea.expeditionWidth > 0){
            mesures += "Width (Expedition Measurement): " + caveArea.expeditionWidth.toString() + "m \n";
          }
          if (caveArea.expeditionTotalHeight > 0){
            mesures += "Total Height (Expedition Measurement): " + caveArea.expeditionTotalHeight.toString() + "m \n";
          }
          if (caveArea.expeditionWallHeight > 0){
            mesures += "Wall Height (Expedition Measurement): " + caveArea.expeditionWallHeight.toString() + "m \n";
          }
          if (caveArea.modernMaxHeight > 0){
            mesures += "Maximal Height (Modern Measurement): " + caveArea.modernMaxHeight.toString() + " m\n";
          }
          if (caveArea.modernMaxHeight > 0){
            mesures += "Maximal Height (Modern Measurement): " + caveArea.modernMaxHeight.toString() + " m\n";
          }
          if (caveArea.modernMaxLength > 0){
            mesures += "Maximal Length (Modern Measurement): " + caveArea.modernMaxLength.toString() + " m\n";
          }
          if (caveArea.modernMaxWidth > 0){
            mesures += "Maximal Width (Modern Measurement): " + caveArea.modernMaxWidth.toString() + " m\n";
          }
          if (caveArea.modernMinHeight > 0){
            mesures += "Minimal Height (Modern Measurement): " + caveArea.modernMinHeight.toString() + " m\n";
          }
          if (caveArea.modernMinLength > 0){
            mesures += "Minimal Length (Modern Measurement): " + caveArea.modernMinLength.toString() + " m\n";
          }
          if (caveArea.modernMinWidth > 0){
            mesures += "Minimal Width (Modern Measurement): " + caveArea.modernMinWidth.toString() + " m\n";
          }
          if (mesures !== ""){
            caveMeasurements["Measurements of " + caveArea.caveAreaLabel] = mesures
          }
        }
      }
      ceilingTypes += ""
      caveLayout["Ceiling Types"] = ceilingTypes
      if (Object.keys(caveLayout).length > 0){
        caveInfo['Layout'] = caveLayout
      }
      if (Object.keys(caveMeasurements).length > 0){
        caveInfo['Measurements'] = caveMeasurements
      }
      var description = ""
      if (this.cave.findings){
        description["findings"] = this.cave.findings
      }
      if (this.cave.notes){
        description["notes"] = this.cave.notes
      }
      if (this.cave.hasSculptures) {
        plasticalItems += "has sculptures\n"
      }
      if (this.cave.hasClayFigures) {
        plasticalItems += "has clay figures\n"
      }
      if (this.cave.hasVolutedHorseShoeArch) {
        plasticalItems += "has voluted horse shoe arch\n"
      }
      if (this.cave.hasHolesForFixationOfPlasticalItems) {
        plasticalItems += "has holes for fixation of plastical items Horse Shoe Arch\n"
      }
      if (this.cave.hasWoodenConstruction) {
        plasticalItems += "has wooden construction\n"
      }
      if (plasticalItems !== ""){
        caveInfo["Additional Objects"] = plasticalItems
      }
      if (description !== ""){
        caveInfo["Description"] = description
      }
      return caveInfo
    }
  },
  methods: {
    getCaveURL(){
      return "/cave/" + this.cave.caveID
    },
    getRelatedDepictions(){
      var params = {}
      params['type'] = "cave.caveID"
      if (this.cave.caveID){
        params['id'] = this.cave.caveID
      } else {
        params['id'] = this.$route.params.id
      }
      getItemById(params)
        .then( res => {
          let results = []
          for (let result of res.data.hits.hits){
            results.push(result._source)
          }
          console.log("relatedDepictions", results)
          this.relatedDepictions = results
        }).catch(function (error) {
          console.log(error)
        })
    },
    getCaveWidth(){
      console.log("window.innerWidth", window.innerWidth);
      return parseInt((window.innerWidth / 2) - 70)
    },
    getCaveRes(){
      this.caveScatches = []
      if (this.cave.caveSketchListcaveSketchList){
        for (let item of this.cave.caveSketchList){
          var res = process.env.VUE_APP_IIIFAPI + "/iiif/2/kucha%2Fcavesketches%2F" + item.caveSketchID + "." + item.imageType + "/full/" + this.getCaveWidth() + ",/0/default.jpg"
          this.caveScatches.push(res)
        }
      }
    },
    getCaveLabel(entry){
      console.log("cave:", entry);
      return getCaveLabel(entry)
    }
  },
  mounted:function () {
    this.getCaveRes()
    if (this.showRelatedDepictions){
      this.getRelatedDepictions()
    }

  },
  beforeMount:function () {
    console.log("beforemount:", this.caveDefault);
    this.cave = this.caveDefault
    getVersionsOfEntry(this.caveDefault)
      .then( res => {
        console.log("recieved versions.", res.data.hits.hits)
        this.versions = res.data.hits.hits
        for (let v of this.versions){
          v.date = new Date(v._source.timestamp)
        }
        this.versions[this.versions.length - 1].date = this.versions[this.versions.length - 1].date + " - (current)"
        this.version = this.versions[this.versions.length - 1]
        console.log("versions:", this.versions);
      }).catch(function (error) {
        console.log(error)
        return null
      })
  },
  watch: {
    version(newVal, oldVal){
      if (newVal != null){
        getVersionOfEntry(newVal._id)
          .then( res => {
            this.cave = res.data._source.content
          }).catch(function (error) {
            console.log(error)
            return null
          })
      }
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
