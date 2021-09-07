<template>
  <v-card raised width="98%" style="margin: auto;padding-bottom: 15px;">
    <v-card>
     <v-card-title class="text-h3" raised width="98%" style="margin: auto;padding-bottom: 15px;">About the Project</v-card-title>
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
            <v-card-title class="text-h6">Spezialized Search Options</v-card-title>
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
      <v-card-title class="text-h5">About the project</v-card-title>
      <v-card-text>
  The Buddhist cave complexes in the region of Kucha, located on the northern Silk Road (in the Xinjiang Uyghur Autonomous Region, People’s Republic of China) house impressive wall paintings dating approximately from the 5th to 10th centuries. These are currently, for the first time ever, being fully made accessible, documented, and scientifically evaluated. In a project of the Saxon Academy of Sciences in Leipzig, research associates are engaged in recording and scientifically annotating all the paintings of this region in a database information system. As such, fragments preserved in museums and collections from around the world, as well as paintings which are only preserved in the form of photographs, drawings, or descriptions, are also consulted. The goal is to document and evaluate the iconographic programme as well as the image content of the paintings in an historico-cultural manner, including their literary basis, and where applicable, their affiliation to Buddhist schools. In the process, influences of pictorial traditions from India, Iran, classical antiquity, and China are also examined.
  This project will create the world’s largest centre for research on the Kucha paintings at the Academy in Leipzig, in cooperation with scholars in various European countries, China, Japan, and the USA. For the first time, Buddhist cave paintings can be made fully accessible for research on religious, aesthetic, and cultural aspects of Buddhism and its spread to East Asia.
      </v-card-text>
      <v-card-title class="text-h5">Buddhism in the region of Kucha</v-card-title>
      <v-card-text>
  Kucha was a Tocharian kingdom in eastern Central Asia, named after its capital city, which had been an important trade centre between the 2nd century BC and the 11th century AD, owing to its location on the northern branch of the ancient Silk Road that passed along the Taklamakan Desert. At this important junction of the ancient caravan routes between the Mediterranean region and the Far East, not only was there an exchange of goods from the East and the West, but it was also here that various peoples and religions encountered each other.

  Originating in India, Buddhism became the dominant religion in the Kucha region in the 3rd century AD at the latest. In the following period, Buddhist cave complexes arose, lasting until the arrival of Islam in the 10th/11th century. Partly decorated with magnificent wall paintings, they were at the centre of Buddhist community life, and till today are witness to a living Buddhism in the region.    </v-card-text>
      <v-card-title class="text-h5">The paintings</v-card-title>
      <v-card-text>
  In total, there are ten Buddhist cave complexes in the Kucha region. The largest and most well-known one is the cave complex of Kizil with nearly 400 caves (of which 339 are numbered). The remaining caves are as follows: Kumtura (114 numbered caves), Simsim (57 numbered caves), Kizilgaha (64 numbered caves), Mazabaha (44 numbered caves), Wenbashi (26 numbered caves), Tuohulake‘aiken (20 numbered caves), Taitai‘er (18 numbered caves), Subashi (5 numbered caves) and A’ai (1 numbered cave). About a third of all caves is decorated with wall paintings.
  The paintings are closely related to Indian art, depicting narrative or devotional themes such as scenes from Buddhist stories and legends, or images of Buddhas, Bodhisatvas, and deities. In addition, they contain depictions of a purely decorative nature, such as stylised landscapes, architectural illustrations, and a variety of ornaments. While the paintings are largely traceable to Indian prototypes, they are fascinating as they are composed in a style blended with elements from the Mediterranean and Syro-Iranian area, and later from East Asia as well.
      </v-card-text>
      <v-card-title class="text-h5">History of research</v-card-title>
      <v-card-text>
  Once the existence of bygone Buddhist life in eastern Central Asia became known to the world at the end of the 19th century, several nations sent research expeditions to the region. Of the four German expeditions between 1902 and 1914, three worked in 1902, 1906, and 1913 in the Buddhist cave complexes of Kucha. They discovered numerous manuscript fragments written in different languages and scripts. The majority of these are religious writings which, like the majority of the inscriptions on site, were composed either in Indian Sanskrit or in the Tocharian language (Tocharian B), which was indigenous at the time and is now extinct. Furthermore, the expeditions “salvaged” a large number of pieces of wall paintings from the caves which they sent to Berlin along with the manuscript fragments and other artefacts. One reason for this was to save the paintings in this manner, as they may have been prone to destruction by the Islamic population, or by forces of nature such as earthquakes. However, as history has shown, the paintings would have been safer on site than in Berlin, since several fragments fell victim to bombings during the Second World War.
  Today, many of the wall painting fragments and artefacts which had been brought to Berlin are at the Museum of Asian Art, comprising the largest collection of Chinese-Central Asian art outside Central Asia. Following the end of the Second World War, a considerable number of painting fragments reached Russia which are kept today at the Hermitage in St. Petersburg. Other fragments of the Berlin collection had been given away or sold before the outbreak of the Second World War, and are today scattered across at least 15 museums around the world.
  The tremendous significance of the wall paintings of Kucha as derivatives of Indian art and culture had already been recognised by the German scholars Grünwedel, von Le Coq, and Waldschmidt who interpreted the depictions on the basis of Sanskrit texts. Following the Cultural Revolution, exploration of the wall paintings also began in China. However, due to language barriers, hardly any German publications were consulted, and interpretations were made on the basis of Chinese sources. In turn, again due to language barriers, major research results of Chinese scholars, such as those of Su Bai, were hardly known in the West. Only in the last few years have both sides begun to open up to each other. In this context, an important cooperation developed between the Museum of Asian Art in Berlin and the Kucha Academy in Ürümqi.    </v-card-text>
      <v-card-title class="text-h5">Task fields of the Academy’s project “Buddhist Wall Paintings in the Region of Kucha on the northern Silk Road”</v-card-title>
      <v-card-text>
      </v-card-text>
      <v-card-title class="text-h6">Database information system</v-card-title>
      <v-card-text>
  It is planned to set up a database information system consisting of a “Database of the Kucha Paintings” and an “Encyclopaedia of Pictorial Elements in Kucha Paintings”. This is to be used for the work on the material, the publication of results, and as sustainable basis for all further explorations.
      </v-card-text>
      <v-card-title class="text-h6">Annotated bibliography</v-card-title>
      <v-card-text>
  An important component of the project is the preparation of an annotated bibliography, containing literature relevant to the wall paintings of Kucha in European languages as well as in Chinese, Japanese, and Korean. It encompasses writings on the style, contents, and state of preservation of Buddhist painting, including conservational measures and insights, as well as on the religion, history, and research history of Kucha. The respective works are accompanied by a short, critical summary in English, with references on further reading, thereby providing international experts easier access to the linguistically highly diverse literature.
      </v-card-text>
      <v-card-title class="text-h6">Publications</v-card-title>
      <v-card-text>
  Moreover, it is planned to initiate the publication series Leipziger Kutscha-Studien (“Kutcha Studies in Leipzig”) for publishing the (at least) 17 monographs which are to develop during the course of the project as books.
      </v-card-text>
      <v-card-title class="text-h6">Teaching and research</v-card-title>
      <v-card-text>
  In every semester, at least one course on Central Asian art is to take place.
      </v-card-text>
      <v-card-title class="text-h6">Project period: 2016–2030</v-card-title>
      <v-card-text>
      </v-card-text>
      <v-card-text>
  This research project is part of the Academies' Programme, a research funding programme co-financed by the German federal government and individual federal states. Coordinated by the Union of the German Academies of Sciences and Humanities, the Programme intends to retrieve and explore our cultural heritage, to make it accessible and highlight its relevance to the present, as well as to preserve it for the future. This research project is co-financed by the Saxon State government out of the State budget approved by the Saxon State Parliament.    </v-card-text>
      <v-img class="mx-15" max-width="30%" src="/static/logo.jpeg"></v-img>
      <v-card-title class="text-h5">Project Team</v-card-title>
      <v-card-text v-html="team">
      </v-card-text>
      <v-card-title class="text-h5">Monitoring Commission</v-card-title>
      <v-card-text v-html="commission">
      </v-card-text>
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
      console.log("kuchaStats: ", this.kuchaStats, Object.keys(this.kuchaStats));
      if (Object.keys(this.kuchaStats).length > 0) {
        console.log(" anno is, kuchaStats: ", this.kuchaStats);
        statsDepiction.series = []
        statsDepiction.chartOptions.labels = []
        for (const [key, value] of Object.entries(this.kuchaStats)) {
          statsDepiction.series.push(value)
          statsDepiction.chartOptions.labels.push(this.$store.state.dic.sites.find(element => element.siteID === parseInt(key)).name)
        }
        console.log("stats.series", statsDepiction.series);
      }
      statsDepiction.chartOptions.plotOptions.pie.donut.labels.total.label = "Painted Representations"
      statsDepiction.chartOptions.colors = ['#99C784', '#3f888f', '#ff9999', '#ffb90f', "#6495ed"]
      statsDepiction["jumpTo"] = this.pushToFilteredDepictions
      allStats.push(statsDepiction)
      let statsbib = {
        series: [],
        chartOptions: this.getChartOptions()
      }
      console.log("bibStats", this.bibStats, Object.keys(this.bibStats).length );

      if (Object.keys(this.bibStats).length > 0) {
        statsbib.series = []
        statsbib.chartOptions.labels = []
        for (const [key, value] of Object.entries(this.bibStats)) {
          console.log(key, value);
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
      return allStats
    }
  },
  methods: {
    pushToFilteredDepictions(event, chartContext, config) {
      console.log("Chosen depiction");
      console.log("chartContext", chartContext);
      console.log("config", config.w.config.labels[config.dataPointIndex]);
      console.log("chosen", config.dataPointIndex);
      this.$router.push({name: 'depictionFilter'})
    },
    pushToFilteredBibs(event, chartContext, config) {
      console.log("Chosen Bib");
      console.log("chartContext", chartContext);
      console.log("config", config.w.config.labels[config.dataPointIndex]);
      console.log("chosen", config.dataPointIndex);
      this.$router.push({name: 'bibliographyFilter'})
    },
    pushToFilteredAnnos(event, chartContext, config) {
      console.log("Chosen Anno");
      console.log("chartContext", chartContext);
      console.log("config", config.w.config.labels[config.dataPointIndex]);
      console.log("chosen", config.dataPointIndex);
      this.$router.push({name: 'depictionFilter',
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
      console.log("Hello", player.explicitOriginalTarget.id);
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
      console.log("kuchaStats: ", this.kuchaStats);
      if (Object.keys(this.kuchaStats).length > 0) {
        console.log(" anno is, kuchaStats: ", this.kuchaStats);
        data.series = [this.kuchaStats[1], this.kuchaStats[2], this.kuchaStats[3]]
        data.chartOptions.labels = ["Iconography", "Pictorial Elements", "Decoration & Ornaments"]
      }
      console.log("data for Stats: ", data);

      return data
    },


  },
  mounted:function () {
    console.log(this.$refs);
    this.$refs.video1.onplay = this.onPlay
    this.$refs.video2.onplay = this.onPlay
    this.$refs.video3.onplay = this.onPlay
    getDepictionStats()
      .then( res => {
        let stats = {}
        for (let stat of res.data.aggregations.relatedAnnotationList.tags.genres.buckets){
          stats[stat.key] = stat.doc_count
        }
        this.annoStats = stats;
        let statsDepictions = {}
        for (let stat of res.data.aggregations.genres.buckets){
          statsDepictions[stat.key] = stat.doc_count
        }
        this.kuchaStats = statsDepictions
      }).catch(function (error) {
        console.log(error)
        return null
      })
    getBibStats()
      .then( res => {
        console.log("bibStats res", res);
        let dicStats = {}
        for (let stat of res.data.aggregations.bibliography.Annotated.buckets){
          dicStats[stat.key] = stat.doc_count
        }
        this.bibStats = dicStats;
      }).catch(function (error) {
        console.log(error)
        return null
      })

  },
}

</script>

<style></style>
