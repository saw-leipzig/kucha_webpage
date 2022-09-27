<template>
  <div :style="loading? 'margin: auto;' : ''" class="d-flex flex-row align-stretch flex-grow-1">
    <v-progress-circular
    :size="120"
    :width="9"
    color="primary"
    style="margin: auto;"
    v-if="loading"
    indeterminate
  ></v-progress-circular>
  <tourInf v-if="!loading" :idealTypicals="idealTypicals"></tourInf>
  </div>
</template>

<script>
import tourInf from '@/components/tourInf'
import { getDepictionByAnnotation, getIdeals } from '@/services/repository'

export default {
  name: 'tour',
  components:{
    tourInf
  },
  props: {
    source: String,
  },
  data () {
    return {
      idealTypicalsWithoutDepictions: [],
      idealTypicals: [],
      loading: true
    }
  },
  methods: {
    getAnnos(depiction){
      let annos = []
      if (depiction){
        for (var img of depiction.relatedImages){
          if (depiction.relatedAnnotationList.find(element => element.image === img.filename) && img.accessLevel === 2) {
            annos.push(img)
          }
        }
      }
      return annos
    },
    setRelatedDepictions(idealTypicalIDs){
      var params = {}
      params.iconographyID = idealTypicalIDs
      this.$log.debug("params of getDepictions", params);
      getDepictionByAnnotation(params)
        .then( res => {
          this.$log.debug("anno.tags, git results");
          for (let typical of this.idealTypicalsWithoutDepictions){
            for ( var entry of res.data.hits.hits){
              if (this.getAnnos(entry._source).length > 0){
                let newAnnos = []
                for (let anno of entry._source.relatedAnnotationList){
                  let tagDummy = []
                  let found = false
                  for (let tag of anno.tags){
                    if (tag.iconographyID === typical.iconographyID){
                      const img = entry._source.relatedImages.find(element => element.filename === anno.image)
                      if (img) {
                        if (img.accessLevel === 2){
                          found = true
                          tagDummy.push(tag)
                          break
                        }
                      }
                    }
                  }
                  if (found) {
                    anno.tags = tagDummy
                    this.$log.debug("anno.tags:", anno.tags);
                    newAnnos.push(anno)
                  }
                }
                if (newAnnos.length > 0){
                  let newDepiction = Object.assign({}, entry._source)
                  newDepiction.relatedAnnotationList = newAnnos
                  typical.relatedDepictions.push(newDepiction)
                }
              }
            }
          }
          function compare (a, b) {
            if (a.oe.virtualTourOrder === b.oe.virtualTourOrder ){
              if (a.iconographyID < b.iconographyID) {
                return -1;
              }
              if (a.iconographyID > b.iconographyID) {
                return 1;
              }
            }
            if (a.oe.virtualTourOrder < b.oe.virtualTourOrder) {
              return 1;
            }
            if (a.oe.virtualTourOrder > b.oe.virtualTourOrder) {
              return -1;
            }
            return 0
          }
          this.loading = false;
          this.idealTypicals = this.idealTypicalsWithoutDepictions.sort(compare)
          this.$log.debug("Typicals", this.idealTypicals);
          // Vue.set(this.relatedDepictions, idealTypical.iconographyID, newDepictions)
        }).catch(function (error) {
          this.$log.debug(error)
        })
    },

  },
  mounted:function () {
    this.loading = true
    this.$log.debug("started Virtual Tour");
    getIdeals()
      .then( res => {
        this.$log.debug("res", res);
        let idealTypicals = []
        if (res.data.hits.hits.length > 0){
          for (let hit of res.data.hits.hits) {
            idealTypicals.push(hit._source)
          }
        }
        const idealTypicalIDs = []
        for (let idealTypical of idealTypicals){
          let free = true
          for (let img of idealTypical.oe.images){
            if (img.accessLevel < 2){
              free = false
            }
          }
          if (idealTypical.root === 3 ){
            free = false
          }
          if (free){
            idealTypical['relatedDepictions'] = []
            this.idealTypicalsWithoutDepictions.push(idealTypical)
            idealTypicalIDs.push(idealTypical.iconographyID)
          }
        }
        this.$log.debug("idealTypicalsWithoutDepictions", this.idealTypicalsWithoutDepictions);
        this.setRelatedDepictions(idealTypicalIDs)
      })
  },
}

</script>

<style></style>
