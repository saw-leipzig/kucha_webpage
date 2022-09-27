  <template>
    <v-dialog v-model="dialog" :persistent="true" max-width="600px" @click:outside="dialog=false">
      <template v-slot:activator="{ on }">
         <slot name="activator" v-bind:on="on">
            <v-btn icon v-on="on" >
             <v-icon :color="$store.state.user.sessionID ? 'green': 'white'">account_circle</v-icon>
            </v-btn>
        </slot>

      </template>

      <v-card >
        <v-form  @submit.prevent="validate" ref="form">
          <v-card-title>
            <span class="headline">  User Login </span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                  label="User Login"
                  v-model="user"
                  :rules="[() => !!user || 'login-error-user-required']"
                  required
                  v-if="dialog"
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="User Password" type="password" v-model="password"
                  :rules="[() => !!password || 'Password is required']"
                  required></v-text-field>
                </v-flex>
                <!--   <small>* {{ $t('login-field-explanation') }} </small> -->
                <v-flex xs12 class="error--text"  v-if="loginerror">
                 'Email or Password is wrong.'
               </v-flex>
             </v-layout>
           </v-container>
         </v-card-text>
         <v-card-actions>
          <Register @click.stop="doRegister()"></Register>
          <v-spacer></v-spacer>
          <v-btn color="grey lighten-2"  @click="closeDialog($refs.form)">  Cancel</v-btn>
          <v-btn color="primary" type="submit">  Submit</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

  </v-dialog>
</template>

<script>
import MD5 from 'crypto-js/md5'
import EventBus from '@/utils/eventBus'
import Register from '@/components/Register'
import {validateUser} from '@/services/repository'
import Usermanager from './usermanager'
export default {

  data: () => ({
    dialog: false,
    user: "",
    password:"",
    loginerror: false
  }),
  components: {
    Register,
    Usermanager
  },
  methods : {
    doRegister(){
      this.$log.debug("blubb");
      this.dialog = false
    },
    closeDialog: function(formComponent) {
      this.$log.debug("form", formComponent);
      formComponent.reset();
      this.dialog = false;
    },

    validate: function () {
      if (this.$refs.form.validate()) {
        this.login();
      }
    },

    login: function() {
      let login = this.user;
      let password = this.password;
      let pwHash = MD5(password).toString();
      this.$log.debug("password is:", password, pwHash);
      validateUser( login, pwHash)
        .then((erg) => {
          this.$log.debug(erg.data);
          this.$store.commit("setUser", erg.data)
          this.$log.debug("User logged in as:", this.$store.state.user.firstname);
          this.dialog = false
        })
        .catch((err) => {
          this.$log.debug("error at login", err);

          this.loginerror = true;
        })
    }

  },
  mounted: function(){
    EventBus.$on('doRegister', (message) => {
      this.$log.debug("close login dialog");
      this.dialog = false
    });

  }
}
</script>

