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
      <v-card-title class="text-h3" raised width="98%" style="margin: auto;padding-bottom: 15px;">Impressum</v-card-title>
      <v-card-text></v-card-text>
      <v-card-title class="text-h5">Anbieter</v-card-title>
      <v-card-text>
        Anbieterkennzeichnung gemäß §5 Telemediengesetz
      </v-card-text>
      <v-card-title class="text-h5">Anschrift</v-card-title>
      <v-card-text v-html="address">
      </v-card-text>
      <v-card-title class="text-h5">Rechtsform</v-card-title>
      <v-card-text>
        Die Sächsische Akademie der Wissenschaften ist eine Körperschaft des Öffentlichen Rechts. Sie wird durch ihren Präsidenten gesetzlich vertreten.
      </v-card-text>
      <v-card-title class="text-h5">Rechtsaufsicht</v-card-title>
      <v-card-text>
        Sächsisches Staatsministerium für Wissenschaft, Kultur und Tourismus, Wigardstraße 17, 01097 Dresden
      </v-card-text>
      <v-card-title class="text-h4">Urheber</v-card-title>
      <v-card-title class="text-h5">Für den Inhalt</v-card-title>
      <v-card-text>
        Die Inhalte des Portals werden im Rahmen des Akademieprojekts "Wissenschaftliche Bearbeitung der buddhistischen Höhlenmalereien in der Kuča-Region der nördlichen Seidenstraße" erstellt von Monika Zin, Ines Konczak-Nagel, Luca De Fabritiis, Fang Wang, Astrid Klein, Ulf Jäger und Ji Ho Yi.
      </v-card-text>
      <v-card-title class="text-h5">Für die Website</v-card-title>
      <v-card-text v-html="website">
      </v-card-text>
      <v-card-title class="text-h4">Rechtliche Hinweise</v-card-title>
      <v-card-title class="text-h5">Texte</v-card-title>
      <v-card-text>
        <v-img class="mx-15" max-width="150px" src="/static/cc.png" ></v-img>
        Die Texte dieses Portals stehen unter der Creative Commons Lizenz CC BY-NC-ND. Erlaubt sind Download und Weiterverteilung der Texte unter Nennung des Namens, jedoch keinerlei Bearbeitung oder kommerzielle Nutzung.
      </v-card-text>
      <v-card-title class="text-h5">Abbildungen</v-card-title>
      <v-card-text v-html="images">
      </v-card-text>
      <v-card-title class="text-h5">Weiteres</v-card-title>
      <v-card-text v-html="further">
      </v-card-text>
      <v-card-title class="text-h5">Datenschutz</v-card-title>
      <v-card-text v-html="privacy">
      </v-card-text>
      <v-card-title class="text-h5">Cookies</v-card-title>
      <v-card-text v-html="cookies">
      </v-card-text>
      <v-card-title class="text-h9">Links</v-card-title>
      <v-card-text v-html="links">
      </v-card-text>
      <v-card-text >
This research project is part of the Academies' Programme, a research funding programme co-financed by the German federal government and individual federal states. Coordinated by the Union of the German Academies of Sciences and Humanities, the Programme intends to retrieve and explore our cultural heritage, to make it accessible and highlight its relevance to the present, as well as to preserve it for the future. This research project is co-financed by the Saxon State government out of the State budget approved by the Saxon State Parliament.
      </v-card-text>
      <v-row>

        <v-col><v-img class="mx-15" max-width="300px" src="/static/union_smwk.jpeg" ></v-img></v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: 'Impressum',
  props: {
    source: String,
  },
  data () {
    return {
      pWord: ""
    }
  },
  computed:{
    address(){
      return "Sächsische Akademie der Wissenschaften zu Leipzig (SAW)<br>Karl-Tauchnitz-Straße 1<br>04107 Leipzig<p>Tel.: +49 341 69764213<br>Fax: +49 341 69764244</p><p>E-Mail: sekretariat (at) saw-leipzig.de</p>"
    },
    website(){
      return "Programmierung: Erik Radisch <p> Design: Kati Ruscher</p>"
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
    }
  },
  methods: {
  },
  mounted:function () {

  },
}

</script>

<style></style>
