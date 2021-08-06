<template>
  <tourInf :idealTypicals="idealTypicals"></tourInf>
</template>

<script>
import tourInf from '@/components/tourInf'

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
      idealTypicals: []
    }
  },
  methods: {

  },
  mounted:function () {
    console.log("started Virtual Tour");
    let idealTypicals = this.$store.state.dic.ornaments.filter(el => el.accessLevel === 2)
    let idealTypicalsFreePics = []
    for (let idealTypical of idealTypicals){
      let free = true
      for (let img of idealTypical.images){
        if (img.accessLevel < 2){
          free = false
        }
      }
      if (free){
        idealTypicalsFreePics.push(idealTypical)

      }
    }
    this.idealTypicals = idealTypicalsFreePics
    console.log("idealTypicals", this.idealTypicals);
  },
}

</script>

<style></style>
