  <template>

    <v-dialog v-model="dialog" :persistent="true" max-width="600px" @click:outside="dialog=false">

      <template v-slot:activator="{ on }">
         <slot name="activator" v-bind:on="on">
            <v-btn icon @click="dialog=!dialog" >
             <v-icon color="white">account_circle</v-icon>
            </v-btn>
        </slot>

      </template>

      <v-card>
        <v-form  @submit.prevent="validate" ref="form">
          <v-card-title>
            <span class="headline">  User Login </span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-row wrap>
                <v-col>
                  <v-text-field
                  label="User Login"
                  v-model="user"
                  :rules="[() => !!user || 'login-error-user-required']"
                  required
                  v-if="dialog"
                  autofocus></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field label="login-field-password" type="password" v-model="password"
                  :rules="[() => !!password || 'login-error-password-required']"
                  required></v-text-field>
                </v-col>
                <!--   <small>* {{ $t('login-field-explanation') }} </small> -->
                <v-col xs12 class="error--text"  v-if="loginerror">
                 'login-error-wrongcredentials'
               </v-col>
             </v-row>
           </v-container>
         </v-card-text>
         <v-card-actions>
          <Register @click.stop="doRegister()"></Register>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog($refs.form)">  Cancel</v-btn>
          <v-btn color="primary" type="submit">  Submit</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

  </v-dialog>
</template>

<script>
import mitt from 'mitt';
const EventBus = mitt();
import Register from '@/components/Register'
export default {

  data: () => ({
    dialog: false,
    user: "",
    password:"",
    loginerror: false
  }),
  components: {
    Register
  },
  methods : {
    doRegister(){
      console.log("blubb");
      this.dialog = false
    },
    closeDialog: function(formComponent) {
      console.log("form", formComponent);
      formComponent.reset();
      this.dialog = false;
    },

    validate: function () {
      if (this.$refs.form.validate()) {
        this.login();
      }
    },

    login: function() {
      const formComponent = this.$refs.form
      let login = this.user;
      let password = this.password;
      let messageSuccess = "login-success"
      // let messageError = this.$t("login-failed")
      let self = this

      this.$store.dispatch("login", { login, password })
        .then(() => {
          self.closeDialog(formComponent);
          EventBus.emit("showMessage", messageSuccess)
        })
        .catch((err) => {
          this.$log.error("error at login", err);

          // Do not show snackbar, because there are closing issues
          // (snackbar also closing this dialog when snackbar is closed)
          // see https://github.com/vuetifyjs/vuetify/issues/7310

          // EventBus.$emit("showErrorMessage", messageError)

          this.loginerror = true;
        })
    }

  },
  mounted: function(){
    EventBus.on('doRegister', (message) => {
      console.log("close login dialog");
      this.dialog = false
    });

  }
}
</script>

