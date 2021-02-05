<template>
  <span>
    <template v-if="getRef(entity.value)">
      <v-icon small>{{ typeIconMap[entity.key] }}</v-icon>
      <a :href="getRef(entity.value)" target="_blank">{{ getText(entity.value) }}</a>
    </template>
    <template v-else-if="entity.key === 'date'">
      <span class="grey--text">{{ getText(entity.value) }}</span>
      <span
        v-for="(date, idx) in getDates(entity.value)"
        :key="'date-' + idx"
        class="d-block"
      ><v-icon small>{{ typeIconMap[entity.key] }}</v-icon>{{ date.value }} <small class="float-right">({{ date.key }})</small></span>
    </template>
    <template v-else>
      <v-icon small>{{ typeIconMap[entity.key] }}</v-icon>{{ getText(entity.value) }}
    </template>
  </span>
</template>

<script>
export default {

  name: 'Entitiy',

  props: {
    entity: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      typeIconMap: {
        persName: 'mdi-account',
        orgName: 'mdi-home-city',
        placeName: 'mdi-earth',
        date: 'mdi-calendar-text'
      }
    }
  },

  methods: {
    getText (entityValue) {
      if (typeof entityValue === 'object') {
        return entityValue['#text']
      }
      return entityValue
    },
    getRef (entityValue) {
      if (typeof entityValue === 'object' && Object.keys(entityValue).indexOf('@ref') > -1) {
        return entityValue['@ref']
      }
      return null
    },
    getDates (entityValue) {
      const dates = []
      const dateAttr = [
        '@when',
        '@from',
        '@to',
        '@notBefore',
        '@notAfter'
      ]
      dateAttr.forEach(d => {
        if (Object.keys(entityValue).indexOf(d) > -1) {
          dates.push({
            key: d,
            value: entityValue[d]
          })
        }
      })
      return dates
    }
  }
}
</script>

<style lang="css" scoped>
</style>
