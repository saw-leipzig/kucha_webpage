<template>
  <v-list>
    <v-subheader class="px-2">
      <v-list-item-title
        class="pl-3"
      >{{ $t('server_status') }}</v-list-item-title>
    </v-subheader>

    <v-list-item
      class="px-2"
    >
      <v-list-item-avatar tile>
        <v-badge
          :content="available_worker"
          :value="available_worker"
          color="secondary"
          left
          bottom
          overlap
          class="badge-tiny"
        >
          <v-icon>
            mdi-kettle-steam
          </v-icon>
        </v-badge>
      </v-list-item-avatar>
      <v-list-item-title>
        {{ $t('status.worker.available') }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item
      class="px-2"
    >
      <v-list-item-avatar tile>
        <v-badge
          :content="active_worker"
          :value="active_worker"
          color="secondary"
          left
          bottom
          overlap
          class="badge-tiny"
        >
          <v-icon>
            mdi-account-hard-hat
          </v-icon>
        </v-badge>
      </v-list-item-avatar>
      <v-list-item-title>
        {{ $t('status.worker.active') }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item
      class="px-2"
    >
      <v-list-item-avatar tile>
        <v-badge
          :content="pending_tasks"
          :value="pending_tasks"
          color="secondary"
          left
          bottom
          overlap
          class="badge-tiny"
        >
          <v-icon>
            mdi-clipboard-text
          </v-icon>
        </v-badge>
      </v-list-item-avatar>
      <v-list-item-title>
        {{ $t('status.worker.pending') }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
export default {

  name: 'Status',

  data () {
    return {
      loading: false,
      max_threads: 0,
      active_threads: [],
      pending_tasks: 0
    }
  },

  computed: {
    active_worker () {
      return this.active_threads.length
    },
    available_worker () {
      return this.max_threads - this.active_worker
    }
  },

  methods: {
    fetchState () {
      this.loading = true
      const url = process.env.VUE_APP_ROOT_API + '/status'
      this.axios.get(url)
        .then(response => {
          this.max_threads = response.data.max_threads
          this.active_threads = response.data.active_threads
          this.pending_tasks = response.data.pending_tasks
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    }
  },

  mounted () {
    console.log(process.env)
    this.fetchState()
    // fetch state regularly
    window.setInterval(
      this.fetchState, 5000
    )
  }
}
</script>

<style lang="css">
.badge-tiny .v-badge__badge {
  font-size: 10px;
  padding: 4px;
  height: 16px;
  min-width:  16px;
  top: calc(100% - 8px);
}
</style>
