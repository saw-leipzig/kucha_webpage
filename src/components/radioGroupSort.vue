<template>
  <v-card outlined class="pb-0">
    <v-row>
      <v-col>
        <v-list-item-subtitle>{{label}}</v-list-item-subtitle>
        <v-select multiple class="my-0  justify-center" style="display: flex;flex-direction: column;align-items: center;"
          row
          v-model="model"
          :items="radioGroupData"
          item-text="label"
          item-value="value"
          dense
          chips
        >
        </v-select>
      </v-col>
      <v-col>
        <v-list-item-subtitle>Direction</v-list-item-subtitle>
        <v-radio-group class="my-0  justify-center" style="display: flex;flex-direction: column;align-items: center;"
          row
          v-model="direction"
          dense
        >
          <v-radio
            class="mb-0"
            label="Ascending"
            value="asc"
          >
          </v-radio>
          <v-radio
            class="mb-0"
            label="Descending"
            value="desc"
          >
          </v-radio>
        </v-radio-group>

      </v-col>
    </v-row>
  </v-card>
</template>
<script>

export default {
  name: 'radioGroupFilter',
  components: {
  },
  props: {
    label: "",
    radioGroupData: {
      type: Array
    },
    startValue: {
      type: Array
    },
  },
  data () {
    return {

      model: null,
      direction:"asc"
    }
  },
  computed: {

  },
  methods: {

  },
  watch: {
    'model': function(newVal, oldVal) {
      console.log("new sort Model:", newVal);
      this.$emit('clicked', [newVal, this.direction])
    },
    'direction': function(newVal, oldVal) {
      console.log("new sort direction:", newVal);
      this.$emit('clicked', [this.model, newVal])
    },
  },
  mounted:function () {
    this.model = this.startValue
    console.log("radioGroupData:", this.radioGroupData);
    this.$emit('clicked', [this.model, this.direction])

  },
  beforeUpdate:function () {
  }
}
</script>

<style lang="css" >
</style>
