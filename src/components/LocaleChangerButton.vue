<template>
  <v-menu
    left
    bottom
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-flag</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(locale, idx) in $i18n.availableLocales"
        :key="'lang' + idx"
        @click="$root.$i18n.locale = locale"
        :disabled="$i18n.locale === locale"
      >
        <v-list-item-title>{{ locale }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {

  name: 'LocaleChangerButton',

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
</style>
