<template>
    <div v-html="svg" ></div>
</template>

<script>
  import anthology from '!raw-loader!../img/icons/anthology.svg'
  import article from '!raw-loader!../img/icons/article.svg'
  import av_source from '!raw-loader!../img/icons/av_source.svg'
  import book from '!raw-loader!../img/icons/book.svg'
  import catalog from '!raw-loader!../img/icons/catalog.svg'
  import certificate from '!raw-loader!../img/icons/certificate.svg'
  import diary from '!raw-loader!../img/icons/diary.svg'
  import edition from '!raw-loader!../img/icons/edition.svg'
  import letter from '!raw-loader!../img/icons/letter.svg'
  import manuscript from '!raw-loader!../img/icons/manuscript.svg'
  import newspaper from '!raw-loader!../img/icons/newspaper.svg'
  import newspaper_article from '!raw-loader!../img/icons/newspaper_article.svg'
  import official_document from '!raw-loader!../img/icons/official_document.svg'
  import online_source from '!raw-loader!../img/icons/online_source.svg'
  import patent_specification from '!raw-loader!../img/icons/patent_specification.svg'
  import picture from '!raw-loader!../img/icons/picture.svg'
  import protocol from '!raw-loader!../img/icons/protocol.svg'
  import publication_other from '!raw-loader!../img/icons/publication_other.svg'
  import publication_series from '!raw-loader!../img/icons/publication_series.svg'
  import record from '!raw-loader!../img/icons/record.svg'
  import report from '!raw-loader!../img/icons/report.svg'
  import review from '!raw-loader!../img/icons/review.svg'
  import source_other from '!raw-loader!../img/icons/source_other.svg'
  import unknown from '!raw-loader!../img/icons/undefined.svg'

  import dc_external from '!raw-loader!../img/icons/dc-external.svg'
  import dc_local from '!raw-loader!../img/icons/dc-local.svg'

  import { icon_database, icon_fact } from "@/utils/constants"

export default {

  name: 'svg-icon',

  props: ['name'],

  data () {
    return {
    }
  },

  computed: {
    svg() {

    switch(this.name) {
         //Sources
      case 'record': return record
      case 'source_other': return source_other
      case 'av_source': return av_source
      case 'report': return report
      case 'letter': return letter
      case 'manuscript':return  manuscript
      case 'protocol': return protocol
      case 'diary':return diary
      case 'certificate': return certificate
      case 'picture': return picture
      case 'review': return review
      case 'online_source': return online_source


      //Publications
      case 'anthology': return anthology
      case 'article': return article
      case 'book': return book
      case 'catalog': return catalog
      case 'newspaper':return newspaper
      case 'newspaper_article':return newspaper_article
      case 'official_document': return official_document
      case 'patent_specification':return  patent_specification
      case 'publication_other': return publication_other
      case 'publication_series': return publication_series
      case 'edition': return edition

      //digital_copy
      case 'dc_external': return dc_external
      case 'dc_local': return dc_local

      //person network
      case 'icon_database': return icon_database
      case 'icon_fact': return icon_fact

      default: return unknown
     }
    }
  },

}
</script>

<style lang="css" scoped>
</style>