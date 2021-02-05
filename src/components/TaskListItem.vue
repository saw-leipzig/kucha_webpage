<template>
  <v-list-item
    :inactive="waiting"
    :class="color"
  >
    <v-list-item-avatar
      size="48"
    >
      <v-progress-circular
        :value="progress"
        size="48"
        :color="iconColor"
      >
        <v-icon
          v-text="icon"
          :color="iconColor"
        ></v-icon>
      </v-progress-circular>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        <h3><router-link :to="'task/' + task.id" :class="classTextColor">{{ task.ini.title }}</router-link></h3>
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ task.id }}
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        {{ status.completion + ' ' + $t('of') + ' ' + status.total + ' ' + $t('letters') + ' (' + progress + '%)' }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        :href="status['@ini']"
        target="_blank"
        icon
        small
        v-if="status['@ini'] !== undefined"
      >
        <v-icon>mdi-file-document</v-icon>
      </v-btn>
      <v-btn
        :href="status['@xml']"
        target="_blank"
        icon
        small
        v-if="status['@xml'] !== undefined"
      >
        <v-icon>mdi-file-code</v-icon>
      </v-btn>
      <v-btn
        @click="cancelTask(task.id)"
        icon
        small
        v-if="waiting || processing"
      >
        <v-icon>mdi-cancel</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import Task from '@/mixins/Task'
export default {

  name: 'TaskListItem',

  mixins: [Task],

  props: {
    color: null
  }
}
</script>
