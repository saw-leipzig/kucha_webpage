<template>
  <v-stepper v-model="iniFormStep" alt-labels non-linear>
    <v-card-title class="primary white--text">
      Enter Search Term
    </v-card-title>
    <v-stepper-header>
      <v-stepper-step
        step="1"
        :complete="iniFormStep > 1"
        editable
      >
        Input
      </v-stepper-step>
      <v-divider/>
      <v-stepper-step
        step="2"
        :complete="iniFormStep > 2"
        editable
      >
       Output
      </v-stepper-step>

    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-form
          v-model="forms.desc"
          ref="search"
          lazy-validation
        >
          <v-text-field
            v-model="ini.title"
            hint=""
            label="test6"
            class="field-required"
          ></v-text-field>
          <v-combobox
            v-model="ini.editor"
            :items="[]"
            hint=""
            chips
            deletable-chips
            :delimiters="[',', ';']"
            hide-no-data
            label="test7"
            multiple
            class="field-required"
          >
            <!-- We want no menu, so we also need no appended icon action
                 and that's why we override the append slot content -->
            <template v-slot:append>
              <div></div>
            </template>
          </v-combobox>
          <v-text-field
            v-model="ini.publisher"
            hint=""
            label="test8"
            class="field-required"
          ></v-text-field>
        </v-form>
        <v-btn
          color="primary"
          @click="iniFormStep = 2; validateForm('desc')"
        >
          test9
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-form
          v-model="forms.editions"
          ref="editions"
          lazy-validation
        >
          <template v-for="(edition, idx) in ini.editions">
            <v-card
              :key="idx"
              outlined
              class="mb-8"
            >
              <v-card-text>
                <v-row dense>
                  <v-col cols="2">
                    <v-text-field
                      v-model="edition.id"
                      hint=""
                      :label="test10"
                      class="field-required"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="10">
                    <v-text-field
                      v-model="edition.title"
                      hint=""
                      label="test11"
                      class="field-required"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-radio-group
                      v-model="edition.type"
                      label="test12"
                      row
                      mandatory
                    >
                      <v-radio
                        v-for="type in edition_types"
                        :key="type"
                        :label="type"
                        :value="type"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-btn
                fab
                outlined
                small
                color="grey lighten-2"
                @click="deleteEdition(idx)"
                absolute
                bottom
                elevation="0"
                class="btn-delete"
              >
                <v-icon small color="error">mdi-delete</v-icon>
              </v-btn>
            </v-card>
          </template>
        </v-form>
        <v-btn
          color="primary"
          @click="iniFormStep = 3; validateForm('editions')"
        >
          test13
        </v-btn>
        <v-btn
          @click="addEdition"
        >
          <v-icon small>mdi-plus</v-icon>test14
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-form
          v-model="forms.options"
          ref="options"
        >
          <v-switch
            v-for="[key, ] in Object.entries(csvOptions)"
            :key="'opt-' + key"
            label="test20"
            v-model="csvOptions[key]"
            hint="test21"
            persistent-hint
            :disabled="key === 'v'"
          ></v-switch>
        </v-form>
        <v-btn
          color="primary"
          @click="iniFormStep = 4"
        >
          test15
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-form
          v-model="forms.file"
          ref="file"
          lazy-validation
        >
          <v-file-input
            v-model="csv_file"
            label="test16"
            hint=""
            chips
            counter
            multiple
            show-size
            accept="text/csv"
            class="field-required"
          ></v-file-input>
          <v-text-field
            v-model="ini.extra_delimiter"
            hint=""
            label="test17"
          ></v-text-field>
          <v-text-field
            v-model="ini.file_url"
            hint=""
            label="test18"
          ></v-text-field>
        </v-form>

        <v-btn
          color="primary"
          @click="submit"
          :disabled="!valid"
        >test19</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
export default {

  name: 'IniForm',

  data () {
    return {
      forms: {
        desc: false,
        editions: false,
        file: false,
        options: true
      },
      iniFormStep: 1,
      ini: {
        title: '',
        editor: [],
        publisher: '',
        file_url: '',
        extra_delimiter: '',
        type: '',
        editions: []
      },
      csv_file: null,
      csvOptions: {
        a: false,
        n: false,
        'line-numbers': false,
        v: false
      },
      jobs: [],
      edition_types: [
        'print',
        'online',
        'hybrid'
      ],
    }
  },

  computed: {
    moreThanOneEdition () {
      return this.ini.editions.length > 1
    },
    valid () {
      return this.forms.desc && this.forms.editions && this.forms.file
    },
    uniqueIds () {
      const ids = []
      this.ini.editions.forEach(e => {
        if (ids.indexOf(e.id) === -1) {
          ids.push(e.id)
        }
      })
      return ids
    }
  },

  methods: {
    submit () {
      this.validateForm('desc')
      this.validateForm('editions')
      this.validateForm('file')
      if (this.valid) {
        const url = process.env.VUE_APP_ROOT_API + '/upload'
        const formData = new FormData()
        formData.append('ini_json', JSON.stringify(this.ini))
        if (this.csv_file && this.csv_file.length) {
          formData.append('csv_file', this.csv_file[0], this.csv_file[0].name)
        }
        if (this.csvOptions.a) { formData.append('a', this.csvOptions.a) }
        if (this.csvOptions.n) { formData.append('n', this.csvOptions.n) }
        if (this.csvOptions['line-numbers']) { formData.append('line-numbers', this.csvOptions['line-numbers']) }
        if (this.csvOptions.v) { formData.append('v', this.csvOptions.v) }
        this.axios.post(url, formData)
          .then(response => {
            const taskIni = Object.assign({}, this.ini)
            const taskOptions = Object.assign({}, this.csvOptions)
            const task = Object.assign(
              {
                '@id': response.data['@id'],
                id: response.data.id,
                ini: taskIni,
                csvOptions: taskOptions
              })
            this.$store.dispatch('addTask', task)
            // reset forms if all went successfully
            this.$refs.desc.reset()
            this.$refs.editions.reset()
            this.$refs.file.reset()
            Object.keys(this.csvOptions).forEach(k => { this.csvOptions[k] = false })
            this.iniFormStep = 1
            // multiple editions needs manual reset
            this.ini.editions.splice(0)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    validateForm (ref) {
      this.forms[ref] = this.$refs[ref].validate()
    },
    addEdition () {
      const editionTemplate = { id: '', title: '', type: '' }
      this.ini.editions.push(editionTemplate)
    },
    deleteEdition (idx) {
      this.ini.editions.splice(idx, 1)
    }
  }
}
</script>

<style lang="css">
.field-required label:after {
  content: '*';
}
.btn-delete {
  background-color: #fff;
  margin: 0 auto;
  left: 0;
  right: 0;
}
</style>
