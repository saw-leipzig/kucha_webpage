<template>
<div style="width:100%" class="d-flex align-stretch align-self-stretch flex-grow-1">
  <v-card class="d-flex flex-column mx-3 align-self-stretch flex-grow-1" width="100%" raised >
  <div class="mt-2 bg-transparent text-center" :style="$vuetify.breakpoint.mdAndDown ?'font-size:3vh;':'font-size:3vw;'" v-html="getTitle"> </div>
  <v-progress-circular
    :width="9"
    color="primary"
    style="margin: auto;"
    v-if="loading"
    :value="gameLoaded"
    size="100"
  ></v-progress-circular>
  <div v-show="!loading" :v-show="gameData.length>0"  :class="{'shake' : animated, 'align-stretch': true, 'flex-grow-1': true, 'my-2': true, 'mx-1': true}" style="min-height:50vh" id="openseadragon">
        <div v-show="confetti" :attach="'#openseadragon'" class="confetti-land">
          <div class="confetti" v-bind:key="n" v-for="n in 100 + (10 * getMultiplier)"></div>
        </div>
        <v-dialog
          class="align-center justify-center"
          v-model="winDialog"
          activator="parent"
          :attach="'#openseadragon'"
          width="auto"
          hide-overlay
          max-width="80vw"
        >
          <v-card color="white" style="rgba(255, 255, 255, 1) !important;">
            <v-card-title>
              Gratulation!
            </v-card-title>
            <v-card-text>
              {{getNextLevelText}}
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" style="background-color: #007d40;" block @click="closeWinDialog()">{{getNextLevelButtonText}}</v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>
            <div class="d-flex justify-space-around " style="-ms-flex-pack: distribute !important;justify-content: space-around !important;">
              <v-bottom-sheet
                v-model="levelSheet"
                inset
                :attach="'#openseadragon'"
                class="justify-center d-flex"
              >
                <template class="justify-center d-flex" v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    class="justify-center d-flex"
                    :attach="'#openseadragon'"
                    color="orange"
                    style="background-color: orange;"
                    dark
                    :disabled="gameData.length===0"
                    v-bind="attrs"
                    v-on="on">
                    {{$vuetify.breakpoint.mdAndDown? 'Level' : 'Wähle Level' }}
                  </v-btn>
                </template>
                <v-sheet
                  :attach="'#openseadragon'"
                  class="px-3 text-center"
                >
                  <v-btn
                    :disabled="gameData.length===0"
                    small
                    class="my-3"
                    :attach="'#openseadragon'"
                    @click="levelSheet = !levelSheet">
                    Schließen
                  </v-btn>
                  <v-switch v-model="is18Plus" class="d-flex justify-center" label="18+ Levels"></v-switch>
                  <v-list dense style="height:70vh;overflow-y: scroll;">
                    <v-list-item-group
                      v-model="selectedGameID"
                      color="primary"
                    >
                      <v-list-item
                        :disabled="getDisables(item)"
                        v-for="(item, i) in gameData"
                        :key="i"
                        @click="selectLevel(item)"
                        :style="'color: '+getColor(item.value.difficulty)+';'"
                      >
                        {{item.text + " (" + statistics[item.value.gameID].annotations.length + "/" + statistics[item.value.gameID].number + ")"}}
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-sheet>
              </v-bottom-sheet>
              <v-bottom-sheet
                v-model="beschreibungSheet"
                inset
                :attach="'#openseadragon'"
              >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :disabled="gameData.length===0"
                  small
                  :attach="'#openseadragon'"
                  color="orange"
                  style="background-color: orange;"
                  dark
                  v-bind="attrs"
                  v-on="on">
                  {{$vuetify.breakpoint.mdAndDown? 'Tipp' : 'Beschreibung' }}
                </v-btn>
              </template>
              <v-sheet
                :attach="'#openseadragon'"
                class="text-center"
                style="height:70vh;overflow-y: scroll;"
              >
              <v-row>
                <v-col>
                  <v-btn
                    :disabled="gameData.length===0"
                    small
                    class="my-3"
                    :attach="'#openseadragon'"
                    @click="beschreibungSheet = !beschreibungSheet">
                    Schließen
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="mb-4">
                <v-col>
                  <v-tooltip class="mt-4" right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" style="background:rgba(255, 220, 229,0.3)" color="yellow-lighten-4" dense @click="getHelp()">{{hint? "Ich brauche keine Hilfe mehr!" : "Ich brauche Hilfe!"}}
                      </v-btn>
                    </template>
                    <span>Ist es zu schwer? Klick hier und wir geben eine kleine Hilfestellung!</span>
                  </v-tooltip>
                </v-col>
              </v-row >
              <v-card-text style="line-height: 2rem !important;" v-html="selectedGame === null ? 'Bitte wählen Sie ein Level aus!' : selectedGame.value.description">
              </v-card-text>
            </v-sheet>
            </v-bottom-sheet>
            <v-bottom-sheet
              v-model="statsSheet"
              inset
              :attach="'#openseadragon'"
            >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="gameData.length===0"
                small
                :attach="'#openseadragon'"
                color="orange"
                style="background-color: orange;"
                dark
                v-bind="attrs"
                v-on="on">
                {{$vuetify.breakpoint.mdAndDown ? 'Statistiken' : 'Spiel-Statistiken' }}
              </v-btn>
            </template>
            <v-sheet
              :attach="'#openseadragon'"
              class="text-center"
              style="height:70vh;overflow-y: scroll;"
            >
              <v-btn
                :disabled="gameData.length===0"
                small
                class="my-3"
                :attach="'#openseadragon'"
                @click="statsSheet = !statsSheet">
                Schließen
              </v-btn>
              <v-list  v-show="gameData.length > 0">
                <div
                  v-for="(value, name, index) in statistics"
                  :key="index"
                >
                <v-list-item-title>{{ "Level " + name}}</v-list-item-title>
                <v-list-item-group
                :value="true"
                >
                  <v-list-item
                    v-html="getRights(value)"
                  >
                  </v-list-item>
                  <v-list-item
                    v-html="getFails(value)"
                  >
                  </v-list-item>
                </v-list-item-group>
              </div>
            </v-list>
          </v-sheet>
        </v-bottom-sheet>
        <v-btn :disabled="gameData.length===0" @click="clear()" color="orange" dark dense small style="background-color: orange;">
          {{$vuetify.breakpoint.mdAndDown ? '' : 'Reset' }}
          <v-icon>mdi-restart</v-icon>
        </v-btn>
      </div>
      <div class="d-flex justify-end mr-1" v-if="selectedGame" style="position: absolute;right: 3%;top: 12%;z-index: 1;background:rgba(255, 255, 255, 0.5);">
        <div class="d-flex flex-shrink-1 w-auto mx-1" style="color: rgb(1, 10, 109);">
          {{selectedGame.text}}
        </div>
        <div class="d-flex flex-shrink-1 w-auto mx-1" style="color: green;">
          {{"Gefunden: " + statsRight}}
        </div>
        <div class="d-flex flex-shrink-1 w-auto mx-1" style="color:green"
          v-html="getFails(statistics[selectedGame.value.gameID])"
        >
        </div>
      </div>
    </div>
  </v-card>
</div>
</template>

<script>
import OpenSeadragon from "openseadragon";
import { getGames } from "@/services/repository";
import Annotorious from "../../static/openseadragon-annotorious.min.js";
import SelectorPack from "../../static/annotorious-selector-pack.min.js";
import "../../static/annotorious.min.css";

export default {
  data() {
    return {
      imageViewer: null,
      annotoriousplugin: null,
      gameData: [],
      gameDataStorage: [],
      selectedGame: null,
      selectedGameFull: null,
      is18Plus:false,
      selectedGameID: null,
      drag:false,
      lastDown:0,
      hint: false,
      animated:false,
      confetti:false,
      confettiPlayers: [],
      winDialog:false,
      annotationFound:true,
      levelSheet:false,
      beschreibungSheet:false,
      statsSheet:false,
      statsRight:"",
      loading:false
    };
  },
  computed: {
    getNextLevelButtonText(){
      if (this.selectedGame){
        if (this.selectedGame.value.gameID === this.gameData.length){
          return "Schließen"
        } else {
          return "Nächstes Level"
        }
      } else {
        return ""
      }
    },
    getNextLevelText(){
      if (this.selectedGame){
        if (this.gameData.length === this.selectedGame.value.gameID){
          return "Wow! Das war das schwerste Level! Du bist ein richtiger Meister."
        } else {
          return "Du hast das Level gemeistert, wähle das nächste!"
        }
      } else {
        return ""
      }
    },
    getMultiplier(){
      if (this.selectedGame){
        return this.selectedGame.value.gameID
      } else {
        return 1
      }
    },
    getTitle(){
      if (this.selectedGame === null || this.selectedGame === undefined){
        return "Finde ... in den Kuča-Gemälden"
      } else {
        return "Finde <span style='color:red;''>" + this.selectedGame.value.name + "</span> in den Kuča-Gemälden!"
      }
    },
    statistics:{
      get: function(){
        return this.$store.state.statistics;
      },
      set: function (newValue){
        this.$store.commit("setStatistics", newValue)
      }
    },
    gameLoaded:{
      get: function(){
        return this.$store.state.gameLoaded;
      },
      set: function (newValue){
        this.$store.commit("setSetGameLoaded", newValue)
      }
    },
  },
  methods:{
    getDisables(item){
      if (this.statistics[item.value.gameID].annotations.length === this.statistics[item.value.gameID].number){
        return true
      } else {
        return false
      }
    },
    getColor(item){
      if (item === 1) {
        return "rgb(0, 0, 200)"
      } else if (item === 2) {
        return "rgb(253, 159, 12)"
      } else {
        return "rgb(255, 0, 0)"
      }
    },
    selectLevel(item){
      console.log("selectLevel", item)
      this.selectedGameID = item
      this.levelSheet = false
      this.hint = false
      this.beschreibungSheet = true
    },
    getHelp(){
      this.hint = !this.hint
      this.loadLevel(this.selectedGame, false)
      this.beschreibungSheet = false
    },
    closeWinDialog(){
      this.stopItConfetti()
      this.winDialog = false
      let gameID = this.selectedGame.value.gameID
      while (gameID <= this.gameData.length){
        if (this.statistics[gameID + 1].annotations.length === this.statistics[gameID + 1].number){
          gameID += 1
        } else {
          break
        }
      }
      if (gameID < this.gameData.length){
        this.selectedGame = this.gameData[gameID]
        this.levelSheet = false
        this.beschreibungSheet = true
      } else {
        this.selectedGame = null
        this.annotoriousplugin.clearAnnotations()
        this.imageViewer.close()
        this.stopItConfetti()
      }
    },
    stopItConfetti(){
      for (let confplayer of this.confettiPlayers){
        confplayer.animate = 'unset'
        confplayer.innerHTML = ''
      }
      this.confetti = false
    },
    initViewer(){
      let options = {
        id: "openseadragon",
        prefixUrl:
          "https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/",
        showRotationControl: true,
        showFlipControl: true,
        maxZoomLevel: 100,
        visibilityRatio: 1.0,
        defaultZoomLevel: 0,
        minZoomLevel: 0.001,
        loadTilesWithAjax: true,
      };
      options["showNavigationControl"] = true;
      this.imageViewer = OpenSeadragon(options);
      var MyHighlightFormatter = function (annotation) {
        if (annotation.motivation === "highlight") {
          return {
            style:
              "stroke-width:5px;stroke: gold; fill: rgba(0, 128, 0,0.55);vector-effect: none;cursor: auto;",
          }
        } else if (annotation.motivation === "hint") {
          return {
            style:
              "stroke-width:0px;stroke: gold; fill: rgba(255, 210, 219,0.30);vector-effect: none;cursor: auto;",
          }
        } else {
          return {
            style:
              "stroke-width:0px;stroke: gold; fill: rgba(0, 128, 0,0);vector-effect: none;cursor: auto;",
          };
        }
      };
      var config = {};
      config["readOnly"] = true;
      config["disableSelect"] = true
      config["disableEditor"] = true
      config["widgets"] = [
        "COMMENT",
        { widget: "TAG", vocabulary: [], showDelete: false },
      ];
      config["image"] = this.imageViewer;
      config["formatter"] = [MyHighlightFormatter];
      this.annotoriousplugin = Annotorious(this.imageViewer, config);
      SelectorPack(this.annotoriousplugin);
      var _self = this;
      this.imageViewer.setControlsEnabled(true);
      this.imageViewer.setMouseNavEnabled(true);
      this.imageViewer.gestureSettingsMouse.clickToZoom = false
      this.imageViewer.addHandler('canvas-press', () => {
        _self.lastDown = new Date().getTime()
      }
      );
      this.imageViewer.addHandler('canvas-click', (e) =>  {
        const timeSinceMouseDown = new Date().getTime() - _self.lastDown;
        // Real click (no drag)
        if (timeSinceMouseDown < 250) {
          setTimeout(function(){
            if (_self.annotationFound === false){
              _self.animated = true
              _self.statistics[_self.selectedGame.value.gameID].fails += 1
            } else {
              _self.annotationFound = false
            }
          }, 250);
          setTimeout(function(){
            _self.animated = false
          }, 1000);
        }
      })
      this.annotoriousplugin.on("clickAnnotation", function (annotation, evt) {
        if ((annotation.motivation === "hide" || annotation.motivation === "hint")) {
          _self.annotationFound = true
          annotation.motivation = "highlight";
          // _self.statistics[_self.selectedGame.value.gameID].fails -= 1
          _self.statistics[_self.selectedGame.value.gameID].annotations.push(annotation.id)
          _self.statsRight = _self.statistics[_self.selectedGame.value.gameID].annotations.length + "/" + _self.statistics[_self.selectedGame.value.gameID].number
          _self.annotoriousplugin.format(annotation);
          if (_self.statistics[_self.selectedGame.value.gameID].annotations.length === _self.statistics[_self.selectedGame.value.gameID].number){
            _self.makeItConfetti()
            _self.winDialog = true
          }
        }
      });
    },
    makeItConfetti() {
      this.confetti = true
      var confetti = document.querySelectorAll('.confetti');
      if (!confetti[0].animate) {
        return false;
      }

      for (var i = 0, len = confetti.length; i < len; ++i) {
        var candycorn = confetti[i];
        candycorn.innerHTML = '<div class="rotate"><div class="askew"></div></div>';
        var scale = Math.random() * 0.7 + 0.3;
        var player = candycorn.animate([
          { transform: `translate3d(${(i / len * 100)}vw,-5vh,0) scale(${scale}) rotate(0turn)`, opacity: scale },
          { transform: `translate3d(${(i / len * 100 + 10)}vw,105vh,0) scale(${scale}) rotate(${Math.random() > 0.5 ? '' : '-'}2turn)`, opacity: 1 }
        ], {
          duration: Math.random() * 3000 + 5000,
          iterations: Infinity,
          delay: -(Math.random() * 7000)
        });
        this.confettiPlayers.push(player);
      }
    },
    loadLevel(newLevel, isNew){
      if (this.selectedGame){
        this.annotoriousplugin.clearAnnotations();
        if (isNew){
          this.imageViewer.close()
          this.imageViewer.open(
            process.env.VUE_APP_IIIFAPI + "/iiif/2/kucha%2Fimages%2F" +
            newLevel.value.imageID +
            "/info.json"
          );
        }
        for (let anno of newLevel.value.annotations) {
          let w3cAnno = JSON.parse(anno.w3c)
          if (this.statistics[newLevel.value.gameID].annotations.includes(anno.annotoriousID)){
            console.log("anno ", anno.annotoriousID, " was already found!" );
            w3cAnno["motivation"] = "highlight";
          } else {
            if (this.hint){
              w3cAnno["motivation"] = "hint";
            } else {
              w3cAnno["motivation"] = "hide";
            }
          }
          this.annotoriousplugin.addAnnotation(w3cAnno);
        }

      }
    },
    clear(){
      this.statistics = {}
      for (let level of this.gameData){
        this.statistics[level.value.gameID] = {
          fails : 0,
          number: level.value.annotations.length,
          annotations: []
        }
      }
      this.loadLevel(this.selectedGame, false)
      this.statsRight = this.statistics[this.selectedGame.value.gameID].annotations.length + "/" + this.statistics[this.selectedGame.value.gameID].number
    },
    buildGameData(){
      this.gameData = []
      for (var level of this.gameDataStorage){
        if (!this.is18Plus){
          if (!level.value.is18){
            this.gameData.push(level)
          }
        } else {
          this.gameData.push(level)
        }
      }
    },
    getRights(item){
      if (item){
        return "<span style='color:green;'>Gefunden: " + item.annotations.length + "/" + item.number + "</span>"
      } else {
        return ""
      }
    },
    getFails(item){
      if (item){
        return "<span style='color:red;'>Daneben: " + item.fails + "</span>"
      } else {
        return ""
      }
    }
  },
  mounted() {
    this.loading = true
    getGames()
      .then((res) => {
        this.loading = false
        this.initViewer()
        console.log("data recieved:", res);
        this.gameData = [];
        this.gameDataStorage = []
        for (var level of res.data) {
          var newLevel = {
            text: "Level " + level.gameID + " - Finde " + level.name + "!",
            title: "Level " + level.gameID + " - Finde " + level.name + "!",
            value: level
          };
          if (level.is18){
            newLevel.title = newLevel.title + " (18+)"
            newLevel.text = newLevel.text + " (18+)"
          }

          let annotations = []
          let annotationIDs = []
          for (let anno of level.annotations){
            if (!annotationIDs.includes(anno.annotoriousID)){
              annotationIDs.push(anno.annotoriousID)
              annotations.push(anno)
            }
          }
          level.annotations = annotations
          if (!this.statistics[newLevel.value.gameID]){
            this.statistics[newLevel.value.gameID] = {
              fails : 0,
              number: newLevel.value.annotations.length,
              annotations: []
            }
          } else {
            this.statistics[newLevel.value.gameID].number = newLevel.value.annotations.length
          }
          this.gameDataStorage.push(newLevel);
        }
        this.buildGameData()
        this.selectedGame = this.gameData[0]
        this.selectedGameID = 0
        this.statsRight = this.statistics[this.selectedGame.value.gameID].annotations.length + "/" + this.statistics[this.selectedGame.value.gameID].number
      })
      .catch((err) => {
        console.log("error!", err);
      });
  },
  watch: {
    selectedGameID(newVal, oldVal) {
      this.selectedGame = this.gameData[newVal]
      this.levelSheet = false
      this.beschreibungSheet = true
    },
    selectedGame(newVal, oldVal) {
      this.stopItConfetti()
      this.winDialog = false
      this.hint = false
      this.loadLevel(newVal, true)
      if (this.selectedGame){
        this.statsRight = this.statistics[this.selectedGame.value.gameID].annotations.length + "/" + this.statistics[this.selectedGame.value.gameID].number
      }
    },
    is18Plus(newVal, oldVal) {
      this.buildGameData()
    }
  },
};
</script>
<style lang="css">
.shake {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
}
.confetti {
  width: 1rem;
  height: 1rem;
  display: inline-block;
  position: absolute;
  top: -3rem;
  left: 0;
  z-index: 50;
}
.confetti .rotate {
  animation: driftyRotate 1s infinite both ease-in-out;
  perspective: 1000;
}


.confetti:nth-of-type(7n) .askew {
  animation-delay: -.6s;
  animation-duration: 2.25s;
}
.confetti:nth-of-type(7n + 1) .askew {
  animation-delay: -.879s;
  animation-duration: 3.5s;
}
.confetti:nth-of-type(7n + 2) .askew {
  animation-delay: -.11s;
  animation-duration: 1.95s;
}
.confetti:nth-of-type(7n + 3) .askew {
  animation-delay: -.246s;
  animation-duration: .85s;
}
.confetti:nth-of-type(7n + 4) .askew {
  animation-delay: -.43s;
  animation-duration: 2.5s;
}
.confetti:nth-of-type(7n + 5) .askew {
  animation-delay: -.56s;
  animation-duration: 1.75s;
}
.confetti:nth-of-type(7n + 6) .askew {
  animation-delay: -.76s;
  animation-duration: 1.5s;
}

.confetti:nth-of-type(9n) .rotate {
  animation-duration: 2s;
}
.confetti:nth-of-type(9n + 1) .rotate {
  animation-duration: 2.3s;
}
.confetti:nth-of-type(9n + 2) .rotate {
  animation-duration: 1.1s;
}
.confetti:nth-of-type(9n + 3) .rotate {
  animation-duration: .75s;
}
.confetti:nth-of-type(9n + 4) .rotate {
  animation-duration: 4.3s;
}
.confetti:nth-of-type(9n + 5) .rotate {
  animation-duration: 3.05s;
}
.confetti:nth-of-type(9n + 6) .rotate {
  animation-duration: 2.76s;
}
.confetti:nth-of-type(9n + 7) .rotate {
  animation-duration: 7.6s;
}
.confetti:nth-of-type(9n + 8) .rotate {
  animation-duration: 1.78s;
}
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

@keyframes drifty {
  0% {
    transform: skewY(10deg) translate3d(-250%, 0, 0);
  }
  100% {
    transform: skewY(-12deg) translate3d(250%, 0, 0);
  }
}
@keyframes driftyRotate {
  0% {
    transform: rotateX(0);
  }
  100% {
    transform: rotateX(359deg);
  }
}


.confetti:nth-child(7n) {
  color: hsl(18, 100%, 50%);
}
.confetti:nth-child(7n + 1) {
  color: hsl(183, 100%, 50%);
}
.confetti:nth-child(7n + 2) {
  color: hsl(122, 100%, 50%);
}
.confetti:nth-child(7n + 3) {
  color: hsl(59, 100%, 50%);
}
.confetti:nth-child(7n + 4) {
  color: hsl(133, 100%, 90%);
}
.confetti:nth-child(7n + 5) {
  color: hsl(240, 100%, 36%);
}
.confetti:nth-child(7n + 6) {
  color: hsl(31, 100%, 50%);
}
.theme--light.v-list-item--disabled {
  color: rgba(2, 95, 2, 0.603)!important;
  background-color: rgba(0,0,0, 0.2);
}

.confetti .askew {
  background: currentColor;
  width: 1rem;
  height: 2rem;
  clip-path: polygon(evenodd,
  0% 0%, 100% 0%, 100% 100%, 50% 90%, 0% 100%
  );
}
</style>