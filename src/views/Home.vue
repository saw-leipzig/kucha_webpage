<template>
<div>
  <search/>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="10" sm="4" md="4" xl="3" v-for="(stats, index) in annoStatsDetailsApex" :key="index">
        <v-card class="statistic-card text-center" >
          <v-card-text>
              <apexchart width="100%"  :height="$vuetify.breakpoint.xs? '300px' : ''" type="donut" :options="stats.chartOptions" :series="stats.series"></apexchart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


  </v-container>
</div>
</template>

<script>
import Search from '@/components/Search'
import { getDepictionStats, getDicStats } from '@/services/repository'
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'Home',
  components: {
    Search,
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
          //colors: [],
          dataLabels: {
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
      let fontSizeText = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md? '12px' : '16px'
      let fontSizeValue = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md? '24px' : '42px'
      let offsetText = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md? -10 : -15
      let offsetValue = this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md? 0 : 10
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
                   // color: '#B9F6CA',
                    offsetY: offsetText
                  },
                  value: {
                    show: true,
                    fontSize: fontSizeValue,
                    fontFamily: 'Roboto, Arial, sans-serif',
                    color: color,
                 //  color: '#B9F6CA',
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
      console.log("kuchaStats: ",this.kuchaStats);
      if (Object.keys(this.kuchaStats).length>0) {
        console.log(" anno is, kuchaStats: ",this.kuchaStats);
        data.series= [this.kuchaStats[1], this.kuchaStats[2], this.kuchaStats[3]]
        data.chartOptions.labels= ["Iconography","Pictorial Elemtents", "Ornaments"]
      }
      console.log("data for Stats: ",data);

      return data
    },


  },
  computed: {
    annoStatsDetailsApex () {
      let allStats=[]
      let stats = {
        series: [], 
        chartOptions: this.getChartOptions()
      }
      if (Object.keys(this.annoStats).length>0) {
        stats.series= [this.annoStats["1"], this.annoStats["2"], this.annoStats["3"]]
        stats.chartOptions.labels= ["Iconography","Pictorial Elemtents", "Ornaments"]
      }
      stats.chartOptions.plotOptions.pie.donut.labels.total.label = "Annotations"
      stats.chartOptions.colors = ['#99C784', '#3f888f','#ff9999','#ff9999']
      allStats.push(stats)
      let statsDepiction= {
        series: [],
        chartOptions: this.getChartOptions()
      }
      console.log("kuchaStats: ",this.kuchaStats, Object.keys(this.kuchaStats));
      if (Object.keys(this.kuchaStats).length>0) {
        console.log(" anno is, kuchaStats: ",this.kuchaStats);
        statsDepiction.series= []
        statsDepiction.chartOptions.labels=[]
        for (const [key, value] of Object.entries(this.kuchaStats)) {
          statsDepiction.series.push(value)
          statsDepiction.chartOptions.labels.push(this.$store.state.dic.sites.find(element => element.siteID === parseInt(key)).name)

        }
        
        console.log("stats.series", statsDepiction.series);
      }
      statsDepiction.chartOptions.plotOptions.pie.donut.labels.total.label = "Painted Representations"
      statsDepiction.chartOptions.colors = ['#99C784', '#3f888f','#ff9999','#ffb90f',"#6495ed"]
      allStats.push(statsDepiction)
      let statsbib= {
        series: [],
        chartOptions: this.getChartOptions()
      }
      console.log("dicStats", this.bibStats, Object.keys(this.bibStats).length );

      if (Object.keys(this.bibStats).length>0) {
        statsbib.series= []
        statsbib.chartOptions.labels=[]
        for (const [key, value] of Object.entries(this.bibStats)) {
          console.log(key, value);
          statsbib.series.push(value)
          if (key==="1"){
           (statsbib.chartOptions.labels.push("With Annotation")) 
          }
          else{
            statsbib.chartOptions.labels.push("Without Annotation")
          }
        }
        
      }
      statsbib.chartOptions.plotOptions.pie.donut.labels.total.label = "Bibliography"
      statsbib.chartOptions.colors = ['#99C784', '#3f888f','#ff9999','#ffb90f',"#6495ed"]
      console.log("statsbib: ",statsbib);

      allStats.push(statsbib)

return allStats
    },
  },
   mounted:function () {
    getDepictionStats()
      .then( res => {
        let stats={}
        for (let stat of res.data.aggregations.relatedAnnotationList.tags.genres.buckets){
          stats[stat.key]=stat.doc_count
        }
        this.annoStats=stats;
        let statsDepictions={}
        for (let stat of res.data.aggregations.genres.buckets){
          statsDepictions[stat.key]=stat.doc_count
        }
        this.kuchaStats=statsDepictions
      }).catch(function (error) {
        console.log(error)
        return null
      })
    getDicStats()
      .then( res => {
        let dicStats={}
        for (let stat of res.data.aggregations.annotatedBibliography.genres.buckets){
          dicStats[stat.key]=stat.doc_count
        }
        this.bibStats=dicStats;
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



/*.mobileExtraSmall  .statistic-card {
  height: 150px;
}*/

</style>
