<template>
   <v-app id="inspire">
         <v-container fluid fill-height>
            <v-row class="align-center justify-center">
               <v-col  sm="12" md="10" lg="8">
                  <v-card class="elevation-10">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Kucha Information System (Test Version)</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        This page is in test phase and is thus only accessible to a limited audience. You can register here. <Register @click.stop="doRegister()"></Register> Or login here.<LoginComponent/>
                     </v-card-text>
                  </v-card>
               </v-col>
            </v-row>
         </v-container>
   </v-app>
</template>

<script>
import Register from '@/components/Register'
import LoginComponent from '@/components/LoginDialog'

export default {
  name: 'Login',
  components:{
    Register,
    LoginComponent
  },
  props: {
    source: String,
  },
  data () {
    return {
      pWord: ""
    }
  },
  methods: {
    login(){
      this.$log.debug('blubb', process.env.VUE_APP_PW);
      if (this.pWord === process.env.VUE_APP_PW){
        this.$store.commit('setAuthenticated', true)
      }
      this.$router.push({name: 'Home'})
    }
  },
  mounted:function () {
    this.$log.debug("started login");

  },
}

</script>

<style></style>
