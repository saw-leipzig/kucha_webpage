<template>
   <v-app id="inspire">
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-10">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Kucha Information System (Test Version)</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form>
                           <v-text-field
                              id="password"
                              prepend-icon="lock"
                              name="password"
                              label="Password"
                              type="password"
                              @keydown.enter="login"
                              v-model="pWord"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="login">Login</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
   </v-app>
</template>

<script>
export default {
  name: 'Login',
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
      this.$log.debug(this.pWord);
      if (this.pWord === "kuchaTest"){
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
