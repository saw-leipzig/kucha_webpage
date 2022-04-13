<template>
  <tourInf :idealTypicals="idealTypicals"></tourInf>
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
      idealTypicals: []
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
      // console.log("params of getDepictions", params);
      getDepictionByAnnotation(params)
        .then( res => {
          console.log("parinirvana got results", res.data.hits.hits);
          for (let typical of this.idealTypicalsWithoutDepictions){
            for ( var entry of res.data.hits.hits){
              if (this.getAnnos(entry._source).length > 0){
                let newAnnos = []
                if (typical.iconographyID === 1069 && entry._source.depictionID === 400){
                  console.log("parinirvana", entry._source.relatedAnnotationList);
                }
                for (let anno of entry._source.relatedAnnotationList){
                  let found = false
                  for (let tag of anno.tags){
                    if (tag.iconographyID === typical.iconographyID){
                      const img = entry._source.relatedImages.find(element => element.filename === anno.image)
                      if (img) {
                        if (img.accessLevel === 2){
                          found = true
                        }
                      }
                    }
                  }
                  if (found) {
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
          this.idealTypicals = this.idealTypicalsWithoutDepictions.sort(compare)
          console.log("Typicals", this.idealTypicals);
          // Vue.set(this.relatedDepictions, idealTypical.iconographyID, newDepictions)
        }).catch(function (error) {
          console.log(error)
        })
    },

  },
  mounted:function () {
    console.log("started Virtual Tour");
    getIdeals()
      .then( res => {
        console.log("res", res);
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
        console.log("idealTypicalsWithoutDepictions", this.idealTypicalsWithoutDepictions);
        this.setRelatedDepictions(idealTypicalIDs)
      })
  },
}

</script>

<style></style>
