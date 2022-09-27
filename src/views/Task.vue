<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <h1 class="display-2 font-weight-bold mb-3">
          {{ $t('header.task') }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card min-height="100%">
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('label.id') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ id }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('label.state') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ status.state }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $t('label.progress') }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ status.completion + ' ' + $t('of') + ' ' + status.total + ' ' + $t('letters') + ' (' + progress + '%)' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card min-height="100%">
          <v-subheader>{{ $t('Yout generated files') }}</v-subheader>
          <v-list>
            <v-list-item
              :href="status['@ini']"
              target="_blank"
              v-if="status['@ini'] !== undefined"
            >
              <v-list-item-avatar>
                <v-icon>mdi-file-document</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('task.ini_file') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ status['@ini'] }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ $t('task.open_ini') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              :href="status['@xml']"
              target="_blank"
              v-if="status['@xml'] !== undefined"
            >
              <v-list-item-avatar>
                <v-icon>mdi-file-code</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('task.cmif_file') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ status['@xml'] }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ $t('task.open_cmif') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-actions>
            <v-btn
              :disabled="!completed"
              @click="fetchCMIF"
            >
              {{ $t('task.cmif_preview') }}
            </v-btn>
          </v-card-actions>
          <template v-if="cmif !== null">
            <v-card-title>
              {{ cmif.TEI.teiHeader.fileDesc.titleStmt.title['#text'] }}
            </v-card-title>
            <v-card-text class="text-center">
              <p>
                {{ $t('pagination.results', [paginationResultLower, paginationResultUpper, correspondences.length]) }}
              </p>
              <div>
                <v-pagination
                  v-model="pagination.page"
                  :length="Math.ceil(correspondences.length / pagination.ipp)"
                ></v-pagination>
              </div>
            </v-card-text>
            <v-list>
              <cmif-corresp-description
                v-for="correspondence in paginatedCorrespondences"
                :key="correspondence['@xml:id']"
                :letter-number="correspondence['@key']"
                :corresp-actions="getCorrespActions(correspondence)"
                :editions="getEditions(correspondence)"
              ></cmif-corresp-description>
            </v-list>
            <v-card-text class="text-center">
              <div>
                <v-pagination
                  v-model="pagination.page"
                  :length="Math.ceil(correspondences.length / pagination.ipp)"
                ></v-pagination>
              </div>
              <p>
                {{ $t('pagination.results', [paginationResultLower, paginationResultUpper, correspondences.length]) }}
              </p>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Task from '@/mixins/Task'
import CmifCorrespDescription from '@/components/CmifCorrespDescription'

export default {

  name: 'Task',

  mixins: [Task],

  components: {
    CmifCorrespDescription
  },

  data () {
    return {
      cmif: null,
      pagination: {
        ipp: 25, // items per page
        page: 1 // current page
      }
    }
  },

  computed: {
    correspondences () {
      return this.cmif.TEI.teiHeader.profileDesc.correspDesc
    },
    paginatedCorrespondences () {
      return this.correspondences.filter((c, i) => {
        return i >= this.paginationIndexLower && i < this.paginationIndexUpper
      })
    },
    paginationIndexLower () {
      return this.pagination.ipp * (this.pagination.page - 1)
    },
    paginationIndexUpper () {
      return this.pagination.ipp * this.pagination.page
    },
    paginationResultLower () {
      return this.paginationIndexLower + 1
    },
    paginationResultUpper () {
      if (this.paginationIndexUpper < this.correspondences.length) {
        return this.paginationIndexUpper
      } else {
        return this.correspondences.length
      }
    },
    editions () {
      /* Returns an object of bibl objects where keys are the bibl ids */
      const editions = {}
      const bibl = this.cmif.TEI.teiHeader.fileDesc.sourceDesc.bibl
      if (Array.isArray(bibl)) {
        bibl.forEach(b => {
          editions[b['@xml:id']] = b
        })
      } else {
        editions[bibl['@xml:id']] = bibl
      }
      return editions
    }
  },

  methods: {
    fetchCMIF () {
      this.loading = true
      const url = process.env.VUE_APP_ROOT_API + '/' + this.id + '/json'
      this.axios.get(url)
        .then(response => {
          this.cmif = response.data
          this.loading = false
        })
        .catch(error => {
          this.$log.debug(error)
          this.loading = false
        })
    },
    getSourceIds (correspDesc) {
      if (Object.keys(correspDesc).indexOf('@source') >= 0) {
        return correspDesc['@source'].trim().replace('#', '').split(' ')
      }
      return undefined
    },
    getEditions (correspDesc) {
      const editions = []
      const ids = this.getSourceIds(correspDesc)
      if (Array.isArray(ids)) {
        ids.forEach(id => { editions.push(this.editions[id]) })
      }
      return editions
    },
    getCorrespActions (correspDesc) {
      const ca = correspDesc.correspAction
      if (Array.isArray(ca)) {
        return ca
      } else {
        return [ca]
      }
    }
  }
}
</script>
