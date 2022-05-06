  <template>

    <v-dialog v-model="registerDialog" :persistent="true" max-width="600px" @click:outside="registerDialog=false">

      <template v-slot:activator="{ on }">
         <slot name="activator" v-bind:on="on">
            <v-btn color="grey lighten-2" @click="doRegister()"  >Register</v-btn>
        </slot>

      </template>

      <v-card>
        <v-form  @submit.prevent="validate" ref="form">
          <v-card-title>
            <span class="headline"> Apply for User Account </span>
          </v-card-title>
          <v-card-text>
            As dating of the caves of the Kucha region is contested, we would like to give other scholars the possibility to discuss the dating of the caves in this forum. However. The Discussion is only accessible for Scholars. Therefore, we kindly ask you, to register with your official e-mail.
          </v-card-text>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                  label="Fist Name"
                  v-model="firstName"
                  :rules="[rules.required]"
                  v-if="registerDialog"
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  label="Last Name"
                  v-model="lastName"
                  :rules="[rules.required]"
                  v-if="registerDialog"
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  label="Official Email Address"
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  v-if="registerDialog"
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  label="Affilation"
                  v-model="affilation"
                  :rules="[rules.required]"
                  v-if="registerDialog"
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12 class="error--text"  v-if="loginerror">
                 'You did not fill all fields.'
               </v-flex>
               <v-alert v-model="postError" dismissible color="red"> {{errorText}}</v-alert>
             </v-layout>
           </v-container>
         </v-card-text>
         <v-card-actions>
          <v-btn color="grey lighten-2" @click="closeDialog($refs.form)">  Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit">  Submit</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

  </v-dialog>
</template>

<script>

import EventBus from '@/utils/eventBus'
import {regUser} from '@/services/repository'
export default {

  data: () => ({
    registerDialog: false,
    firstName: "",
    lastName: "",
    email: "",
    affilation:"",
    loginerror: false,
    postError:false,
    errorText: "An error occured!",
    rules: {
      required: value => !!value || "Required.",
      password: value => {
        // eslint-disable-next-line
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        return (
          pattern.test(value) ||
          "Min. 8 characters with at least one capital letter, a number and a special character."
        );
      },
      email: value => {
        var re = /\S+@\S+\.\S+/;
        return (re.test(value) || "Please enter a valid E-Mail!");
      }
    }
  }),

  methods : {
    doRegister(){
      this.registerDialog = true
      EventBus.$emit("doRegister", null)
    },
    closeDialog: function(formComponent) {
      this.registerDialog = false;
    },

    validate: function () {
      if (this.$refs.form.validate()) {
        this.register();
      } else {
        this.errorText = "The Form is not filled out correctly!"
        this.postError = true
      }
    },

    register: function() {
      regUser(this.firstName, this.lastName, this.email, this.affilation)
        .then((res) => {
          this.registerDialog = false
        })
        .catch((err) => {
          console.log("error!", err.response);
          this.errorText = err.response.data.message
          this.postError = true
        })
    }

  },
  mounted: function(){
  }
}

</script>

