<template>
<div style="height:100%;opacity:1;">
<v-card style="height:100%" color="transparent">
  <v-container fluid style="opacity:0.85">
    <v-row class="justify-center" >
      <v-col style="height:200px">
      </v-col>
    </v-row>
    <v-row class="justify-center" align="center" >
      <v-col align-self=centerc>
      <div :absolute=true >
        <va-global-search :xlarge="true"></va-global-search>
      </div>
      </v-col>


    </v-row>
    <v-row class="justify-center" >
      <v-col cols="10" sm="4" md="4" xl="3" v-for="(stats, index) in annoStatsDetailsApex" :key="index">
          <v-card-text>
              <apexchart width="100%"  :height="$vuetify.breakpoint.xs? '300px' : ''" type="donut" :options="stats.chartOptions" :series="stats.series" @dataPointSelection="stats.jumpTo"  style="opacity:0.9"></apexchart>
          </v-card-text>
      </v-col>
    </v-row>


  </v-container>
</v-card>
</div>
</template>

<script>
import { getDepictionStats, getBibStats } from '@/services/repository'
import VueApexCharts from 'vue-apexcharts'
import GlobalSearch  from '@/components/GlobalSearch';

export default {
  name: 'Home',
  components: {
    'va-global-search': GlobalSearch,
    'apexchart': VueApexCharts
  },
  data(){
    return {
      annoStats: {},
      kuchaStats:{},
      bibStats:{}
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
    getPlotOptions() {
      let color = this.$vuetify.theme.dark ? '#FFF' : '#000'
      let fontSizeText = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md ? '12px' : '16px'
      let fontSizeValue = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md ? '24px' : '42px'
      let offsetText = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md ? 90 : 9
      let offsetValue = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md ? 0 : 10
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
  computed: {
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
    },
  },
  mounted:function() {
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
  }
}

</script>
<style lang="css" scoped>

.statistic-card {
  height: 100%;
}
.v-sheet.v-card {
  opacity: 0.85;
}



/*.mobileExtraSmall  .statistic-card {
  height: 150px;
}*/

</style>
