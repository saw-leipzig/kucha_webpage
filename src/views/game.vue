<template>
<div style="width:100%" class="d-flex align-self-stretch align-self-stretch flex-grow-1">
  <v-card raised width="98%" class="d-flex flex-grow-1 align-self-stretch align-stretch flex-column ">
    <gameinf/>
  </v-card>
</div>
</template>

<script>
import gameinf from '@/components/gameinf'
export default {
  name: 'game',
  components: {
    gameinf,
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods:{
  },
  mounted() {
  },
  watch: {
  },
};
</script>