  <template>
    <v-dialog v-model="userManagerDialog" :persistent="true" max-width="600px" @click:outside="userManagerDialog=false">
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
            <span class="headline">  User Information </span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                  label="First Name"
                  v-model="firstName"
                  required
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  label="Last Name"
                  v-model="lastName"
                  required
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  label="Official Email Adresse"
                  v-model="email"
                  required
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  label="Affiliation"
                  v-model="affiliation"
                  required
                  autofocus></v-text-field>
                </v-flex>
                <v-checkbox label="Set New Password." v-model="changePW"></v-checkbox>
                <v-flex xs12 v-if="changePW">
                  <v-text-field label="New Password" type="password" v-model="password" :rules="[rules.password]"
                  required></v-text-field>
                </v-flex>
                <v-flex xs12 v-if="changePW">
                  <v-text-field label="New Password Repeat" type="password" v-model="passwordRepeated"
                  required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Current Password for conformation" type="password" v-model="oldPassword"
                  required></v-text-field>
                </v-flex>
                <!--   <small>* {{ $t('login-field-explanation') }} </small> -->
                <v-flex xs12 class="error--text"  v-if="error">
                 'Blubb'
               </v-flex>
               <v-alert v-model="postError" dismissible color="red"> {{errorText}}</v-alert>
             </v-layout>
           </v-container>
         </v-card-text>
         <v-card-actions>
           <v-row>
             <v-col cols="6">
              <v-btn text @click="closeDialog()">  Cancel</v-btn>
             </v-col>
             <v-col class="text-right"  cols="6">
              <v-btn  color="primary" type="submit">  Submit</v-btn>
             </v-col>
           </v-row>
        </v-card-actions>
           <v-row>
             <v-col>
              <v-divider></v-divider>
             </v-col>
           </v-row>
           <v-row>
             <v-col class="text-right"  >
              <v-btn text @click="logout()">  Logout</v-btn>
             </v-col>
           </v-row>
      </v-form>
    </v-card>
    </v-dialog>
</template>

<script>
import MD5 from 'crypto-js/md5'
import {changeUserData} from '@/services/repository'

export default {
  data: () => ({
    firstName: "",
    lastName: "",
    email: "",
    changePW: false,
    affiliation: "",
    password:"",
    passwordRepeated: "",
    oldPassword: "",
    error: false,
    userManagerDialog: false,
    postError:false,
    errorText: "",
    rules: {
      required: value => !!value || "Required.",
      password: value => {
        // eslint-disable-next-line
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        return (
          pattern.test(value) ||
          "Min. 8 characters with at least one capital letter, a number and a special character."
        );
      }
    }
  }),

  methods : {
    doModify(){
      let newPW = ""
      if (this.changePW){
        newPW = MD5(this.password).toString()
      }
      console.log("new Password:", newPW);
      console.log("old Password:", MD5(this.oldPassword).toString());

      let updatedUser = {
        "firstname": this.firstName,
        "lastname": this.lastName,
        "email": this.email,
        "affiliation": this.affiliation,
        "sessionID": newPW,
        "granted": this.$store.state.user.granted
      }
      changeUserData(updatedUser, this.$store.state.user.email, MD5(this.oldPassword).toString())
        .then((res) => {
          this.userManagerDialog = false
        })
        .catch((err) => {
          this.errorText = "Due to error: " + err + ", the User Information could not be changed. Pleafe contact Admin."
          this.error = true
        })
    },
    closeDialog: function() {
      this.userManagerDialog = false
    },
    validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    validate: function () {
      let validated = true
      if ((this.firstName.length > 65) && (this.firstName.length < 2)){
        validated = false
      }
      if ((this.lastName.length > 65) && (this.lastName.length < 2)){
        validated = false
      }
      if (!this.validateEmail(this.email)){
        validated = false
      }
      if (validated){
        this.doModify()
      }

    },

    logout: function() {
      this.$store.commit("setUser", {})
      this.userManagerDialog = false

    }

  },
  mounted: function(){
    this.firstName = this.$store.state.user.firstname
    this.lastName = this.$store.state.user.lastname
    this.email = this.$store.state.user.email
    this.affiliation = this.$store.state.user.affiliation
  }
}
</script>

