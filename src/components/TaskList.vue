<template>
  <v-card
    min-height="100%"
  >
    <v-card-title class="primary white--text">
      {{ $t('header.tasklist') }}
    </v-card-title>
    <v-list>
      <task-list-item
        v-for="(task, idx) in $store.state.tasks"
        :key="task.id"
        :task="task"
        :color="(idx % 2) && 'grey lighten-3'"
      >
      </task-list-item>
    </v-list>
  </v-card>
</template>

<script>
import TaskListItem from '@/components/TaskListItem'
export default {

  name: 'TaskList',

  components: {
    TaskListItem
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>
</style>
