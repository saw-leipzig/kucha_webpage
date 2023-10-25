<template>
  <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
    <v-breadcrumbs
      :items="$store.state.breadcrumb"
    >
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :href="item.href"
          :disabled="item.disabled"
        >
          <span style="color: black;">
            {{item.text}}
          </span>
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-card width="98%" style="margin:auto">
     <v-card-title class="text-h3" raised width="98%" style="margin: auto;padding-bottom: 15px;">About the Database</v-card-title>
      <v-card-text></v-card-text>
      <v-card-title class="text-h5">Video Tutorials</v-card-title>
      <v-row class="px-10">
        <v-col :cols="!$vuetify.breakpoint.smAndDown ? 4 : 12">
          <v-card>
            <v-card-title class="text-h6">Virtual Tour</v-card-title>
            <div class="mx-5">
              <video ref="video1" id=player1 controls style="width: 100%; border: none" mx-5 src="/static/video_1_VirtualTour.mp4?autoplay=0"/>
            </div>
          </v-card>
        </v-col>
        <v-col :cols="!$vuetify.breakpoint.smAndDown ? 4 : 12">
          <v-card>
            <v-card-title class="text-h6">General Search</v-card-title>
            <div class="mx-5">
              <video ref="video2"  id=player2 controls style="width: 100%; border: none" mx-5 src="/static/video_3_generalSearch.mp4?autoplay=0"/>
            </div>
          </v-card>
        </v-col>
        <v-col :cols="!$vuetify.breakpoint.smAndDown ? 4 : 12">
          <v-card>
            <v-card-title class="text-h6">Specialized Search Options</v-card-title>
            <div class="mx-5">
              <video ref="video3" id=player3 controls style="width: 100%; border: none" mx-5 src="/static/video_3_SpecificSearch.mp4?autoplay=0"/>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-card-title class="text-h5">Statistics</v-card-title>
      <v-row class="justify-center" >
        <v-col cols="10" sm="4" md="4" xl="3" v-for="(stats, index) in annoStatsDetailsApex" :key="index">
            <v-card-text>
                <apexchart width="100%"  :height="$vuetify.breakpoint.xs? '150px' : '150px'" type="donut" :options="stats.chartOptions" :series="stats.series" @dataPointSelection="stats.jumpTo"  style="opacity:0.9"></apexchart>
            </v-card-text>
        </v-col>
      </v-row>
      <v-card-title class="text-h5">If you want to find out more about our project, please follow this link:  <a href="https://www.saw-leipzig.de/de/projekte/wissenschaftliche-bearbeitung-der-buddhistischen-hoehlenmalereien-in-der-kucha-region-der-noerdlichen-seidenstrasse/introduction/kucha-murals" target="_blank" style="margin-left: 10px;">  About the project </a></v-card-title>
    </v-card>
  </v-card>
</template>

<script>
import { getDepictionStats, getBibStats } from '@/services/repository'
import VueApexCharts from 'vue-apexcharts'
import Embed from 'v-video-embed'

export default {
  name: 'About',
  components: {
    'apexchart': VueApexCharts,
    'embed': Embed
  },
  props: {
    source: String,
  },
  data () {
    return {
      annoStats: {},
      kuchaStats:{},
      bibStats:{}
    }
  },
  computed:{
    team(){
      return "<p><a href=\"https://www.saw-leipzig.de/de/mitglieder/francoe\">Eli Franco, Prof. Dr. phil. habil. </a> [Project Leader] </p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/zinm\">Monika Zin, Prof. Dr. phil. habil. </a> [Research Team Leader] </p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/jaegeru\">Ulf Jäger, Dr. phil. </a> [Research Associate] </p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/nageli\">Ines Konczak-Nagel, Dr. phil. </a> [Research Associate] </p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/wangf\">Fang Wang, M.A. </a> [Research Associate] </p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/arltr\">Robert Arlt, M.A. </a> [Research Assistant] </p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/kienzlero\">Olga Kienzler, B.A. </a> [Research Assistant] </p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/schulzr\">Robert Schulz, M.A. </a> [Research Assistant] </p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/hyamas\">Satomi Hiyama, Dr. phil. </a> [External Colleague] </p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/kleina\">Astrid Klein, M.A. </a> [Ph.D. Candidate]</p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/yi\">Ji Ho Yi, M.A. </a> [Ph.D. Candidate] </p>"
    },
    commission(){
      return "<p><a href=\"https://www.saw-leipzig.de/de/mitglieder/berlejunga\">Angelika Berlejung, Prof. Dr. theol.</a> [Leipzig]</p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/deegm\">Max Deeg, Prof. Dr. habil.</a> [Cardiff]</p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/granoffp\">Phyllis Granoff, Prof. Dr.</a> [Yale] </p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/maued\">Dieter Maue, Dr. phil.</a> [Cölbe-Schwarzenborn]</p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/modem\">Markus Mode, Prof. Dr. phil. habil.</a> [Halle/Saale]</p>" +
              "<p><a href=\"https://www.saw-leipzig.de/de/mitarbeiter/zimmermannm\">Michael Zimmermann, Prof. Dr.</a> [Hamburg] </p>"
    },
    images(){
      return "Für die Weiterverwendung der Abbildungen ist die Genehmigung der in den Bildbeischriften (unter dem Button „I“ einsehbar) aufgeführten Rechteinhaber erforderlich.<p>Sofern bei Abbildungen nichts anders angegeben ist, liegen die Verwertungsrechte bei der SAW.</p>"
    },
    further(){
      return "Für die Inhalte der von den wissenschaftlichen Projekten unterbreiteten Angebote liegt die Verantwortung bei den Projektleitern. Die SAW, ihre Mitglieder und Mitarbeiter bemühen sich um korrekte Informationen, können aber keinerlei rechtliche Haftung irgendwelcher Art dafür übernehmen. Die Akademie respektiert das Urheberrecht. Sollten Sie der Ansicht sein, dass Ihre Rechte verletzt wurden, bitten wir um Mitteilung.<p>Die Verwendung von Gestaltungselementen der Internetseiten der Sächsischen Akademie der Wissenschaften ist nur mit ausdrücklicher Genehmigung der Verwaltung der Akademie zulässig.</p>"
    },
    privacy(){
      return "Diese Seite erhebt und verwendet Daten in Log Files, die der Internet-Browser des Benutzers übermittelt. Dies sind:<p>Browsertyp / -version, verwendetes Betriebssystem, Referrer URL (die zuvor besuchte Seite), Uhrzeit der Server-Anfrage.</p><p>Diese Daten sind bestimmten Personen nicht zuzuordnen. Sie sind notwendig, um den Inhalt des Online-Angebots beim Nutzer darzustellen. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Die Daten werden nach einer anonymen statistischen Auswertung gelöscht.</p>"
    },
    cookies(){
      return "Im Zusammenhang mit der Bereitstellung von Online-Angeboten werden sogenannte \"Cookies\"; verwendet. \"Cookies\" sind Textdateien, die beim Besuch einer Internetseite auf dem Computer des Besuchers gespeichert werden. \"Cookies\" werden einmalig bzw. längerwährend verwendet, je nach Browsereinstellung, um dem Besucher bestimmte Funktionen des Online-Angebots zu ermöglichen. Die Textdateien enthalten keinerlei personenbezogene Daten und werden auch nicht mit anderen Datenquellen verbunden.<p>Diese Website benutzt Piwik, eine Open-Source-Software zur statistischen Auswertung der Besucherzugriffe. Piwik verwendet Cookies, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieses Internetangebotes werden auf dem Server des Anbieters in Deutschland gespeichert. Die IP-Adresse wird sofort nach der Verarbeitung und vor deren Speicherung anonymisiert.</p><p>Sie können die Installation der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich nutzen können.</p><p>Möchten Sie nicht, dass Piwik Informationen über Ihren Besuch auf dieser Webseite auswertet, können Sie diese Funktion hier deaktivieren.</p><p>"
    },
    links(){
      return "Die Webseite enthält sogenannte \"externe Links\" (Verlinkungen) zu anderen Webseiten, auf deren Inhalt der Anbieter der Webseite keinen Einfluss hat. Aus diesem Grund kann der Anbieter für diese Inhalte auch keine Gewähr übernehmen. Für die Inhalte und Richtigkeit der bereitgestellten Informationen ist der jeweilige Anbieter der verlinkten Webseite verantwortlich. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Bei Bekanntwerden einer solchen Rechtsverletzung wird der Link umgehend entfernt.<p>Diese Maßnahme wird mitfinanziert durch Steuermittel auf der Grundlage des vom Sächsischen Landtag beschlossenen Haushaltes.</p>"
    },
    annoStatsDetailsApex () {
      let allStats = []
      let stats = {
        series: [],
        chartOptions: this.getChartOptions()
      }
      if (Object.keys(this.annoStats).length > 0) {
        stats.series = [this.annoStats["1"], this.annoStats["2"], this.annoStats["3"]]
        stats.chartOptions.labels = ["Iconography", "Pictorial Elements", "Decoration & Ornaments"]
      }
      stats.chartOptions.plotOptions.pie.donut.labels.total.label = "Annotations"
      stats.chartOptions.colors = ['#99C784', '#3f888f', '#ff9999', '#ff9999']
      stats["jumpTo"] = this.pushToFilteredAnnos
      allStats.push(stats)
      let statsDepiction = {
        series: [],
        chartOptions: this.getChartOptions()
      }
      this.$log.debug("kuchaStats: ", this.kuchaStats, Object.keys(this.kuchaStats));
      if (Object.keys(this.kuchaStats).length > 0) {
        this.$log.debug(" anno is, kuchaStats: ", this.kuchaStats);
        statsDepiction.series = []
        statsDepiction.chartOptions.labels = []
        for (const [key, value] of Object.entries(this.kuchaStats)) {
          statsDepiction.series.push(value)
          statsDepiction.chartOptions.labels.push(this.$store.state.sites.find(element => element.siteID === parseInt(key)).name)
        }
        this.$log.debug("stats.series", statsDepiction.series);
      }
      statsDepiction.chartOptions.plotOptions.pie.donut.labels.total.label = "Painted Representations"
      statsDepiction.chartOptions.colors = ['#99C784', '#3f888f', '#ff9999', '#ffb90f', "#6495ed"]
      statsDepiction["jumpTo"] = this.pushToFilteredDepictions
      allStats.push(statsDepiction)
      let statsbib = {
        series: [],
        chartOptions: this.getChartOptions()
      }
      this.$log.debug("bibStats", this.bibStats, Object.keys(this.bibStats).length );

      if (Object.keys(this.bibStats).length > 0) {
        statsbib.series = []
        statsbib.chartOptions.labels = []
        for (const [key, value] of Object.entries(this.bibStats)) {
          this.$log.debug(key, value);
          statsbib.series.push(value)
          if (key === "1"){
            (statsbib.chartOptions.labels.push("With Annotation"))
          } else {
            statsbib.chartOptions.labels.push("Without Annotation")
          }
        }
      }
      statsbib.chartOptions.plotOptions.pie.donut.labels.total.label = "Bibliography"
      statsbib.chartOptions.colors = ['#99C784', '#3f888f', '#ff9999', '#ffb90f', "#6495ed"]
      statsbib["jumpTo"] = this.pushToFilteredBibs
      allStats.push(statsbib)
      this.$log.debug("allStats");
      return allStats
    }
  },
  methods: {
    pushToFilteredDepictions(event, chartContext, config) {
      this.$log.debug("Chosen depiction");
      this.$log.debug("chartContext", chartContext);
      this.$log.debug("config", config.w.config.labels[config.dataPointIndex]);
      this.$log.debug("chosen", config.dataPointIndex);
      this.$router.push({path: '/pr',
        query:{
          "sites": [config.w.config.labels[config.dataPointIndex]]
        }})
    },
    pushToFilteredBibs(event, chartContext, config) {
      this.$log.debug("Chosen Bib");
      this.$log.debug("chartContext", chartContext);
      this.$log.debug("config", config.w.config.labels[config.dataPointIndex]);
      this.$log.debug("chosen", config.dataPointIndex);
      this.$router.push({path: '/bibliography',
        query:{
          "annotation": config.dataPointIndex
        }})
    },
    pushToFilteredAnnos(event, chartContext, config) {
      this.$log.debug("Chosen Anno");
      this.$log.debug("chartContext", chartContext);
      this.$log.debug("config", config.w.config.labels[config.dataPointIndex]);
      this.$log.debug("chosen", config.dataPointIndex);
      this.$router.push({path: '/pr',
        query:{
          "iconography": [config.w.config.labels[config.dataPointIndex]]
        }})
    },
    getChartOptions() {
      return  {
        stroke: {
          width: 0,
        },
        labels: [],
        legend: { show: false },
        tooltip: {
          enabled: false
        },
        dataLabels: {
          position: 'bottom',
          enabled: false,
          enabledOnSeries: undefined,
          formatter: function (val) {
            return val
          }
        },
        plotOptions: this.getPlotOptions()
      }
    },
    onPlay(player){
      if (player.explicitOriginalTarget.id !== "player1"){
        this.$refs.video1.pause()
      }
      if (player.explicitOriginalTarget.id !== "player2"){
        this.$refs.video2.pause()
      }
      if (player.explicitOriginalTarget.id !== "player3"){
        this.$refs.video3.pause()
      }
    },
    getPlotOptions() {
      let color = this.$vuetify.theme.dark ? '#FFF' : '#000'
      let fontSizeText = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md ? '12px' : '16px'
      let fontSizeValue = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md ? '20px' : '35px'
      let offsetText = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md ? 90 : 80
      let offsetValue = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md ? 0 : 0
      return {
        pie: {
          expandOnClick: false,
          donut: {
            labels: {
              show: true,
              color: '#B9F6CA',
              name: {
                show: true,
                fontSize: fontSizeText,
                fontFamily: 'Roboto, Arial, sans-serif',
                color: color,
                offsetY: offsetText
              },
              value: {
                show: true,
                fontSize: fontSizeValue,
                fontFamily: 'Roboto, Arial, sans-serif',
                color: color,
                offsetY: offsetValue,
                formatter: function (val) {
                  return val
                }
              },
              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                color: color,
                // color: '#000000',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                }
              }
            }
          }
        }
      }
    },

    getAnnoStatsApex() {
      let data = {
        series: [],
        chartOptions: this.getChartOptions()
      }
      this.$log.debug("kuchaStats: ", this.kuchaStats);
      if (Object.keys(this.kuchaStats).length > 0) {
        this.$log.debug(" anno is, kuchaStats: ", this.kuchaStats);
        data.series = [this.kuchaStats[1], this.kuchaStats[2], this.kuchaStats[3]]
        data.chartOptions.labels = ["Iconography", "Pictorial Elements", "Decoration & Ornaments"]
      }
      this.$log.debug("data for Stats: ", data);

      return data
    },


  },
  mounted:function () {
    if (this.$store.state.sites.length === 0){
      this.$store.dispatch('getSites')
    }
    this.$log.debug(this.$refs);
    this.$refs.video1.onplay = this.onPlay
    this.$refs.video2.onplay = this.onPlay
    this.$refs.video3.onplay = this.onPlay
    getDepictionStats()
      .then( res => {
        let depictionCount = res.data.aggregations.depiction_count.doc_count
        let stats = {}
        for (let stat of res.data.aggregations.relatedAnnotationList.tags.genres.buckets){
          stats[stat.key] = stat.doc_count
        }
        this.annoStats = stats;
        let statsDepictions = {}
        for (let stat of res.data.aggregations.genres.buckets){
          statsDepictions[stat.key] = stat.doc_count
          depictionCount = depictionCount - stat.doc_count
        }
        this.$log.debug("depictionCount:", depictionCount);
        this.$log.debug("depictionCount: sites", this.$store.state.sites);
        statsDepictions[0] = depictionCount
        this.kuchaStats = statsDepictions
      }).catch(function (error) {
        this.$log.debug(error)
        return null
      })
    getBibStats()
      .then( res => {
        this.$log.debug("bibStats res", res);
        let dicStats = {}
        dicStats[1] = res.data.aggregations.bibliography.doc_count - res.data.hits.total.value
        dicStats[0] = res.data.hits.total.value
        this.bibStats = dicStats;
      }).catch(function (error) {
        console.log(error);
        return null
      })

  },
}

</script>

<style></style>
