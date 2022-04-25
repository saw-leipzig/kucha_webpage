  <template>

    <v-dialog v-model="registerDialog" :persistent="true" max-width="600px" @click:outside="registerDialog=false">

      <template v-slot:activator="{ on }">
         <slot name="activator" v-bind:on="on">
            <v-btn text @click="doRegister()"  >Register</v-btn>
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
                  required
                  v-if="registerDialog"
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  label="Last Name"
                  v-model="lastName"
                  required
                  v-if="registerDialog"
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  label="Official Email Address"
                  v-model="email"
                  required
                  v-if="registerDialog"
                  autofocus></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                  label="Affilation"
                  v-model="affilation"
                  required
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
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog($refs.form)">  Cancel</v-btn>
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
      }
    },

    register: function() {
      regUser(this.firstName, this.lastName, this.email, this.affilation)
        .then((res) => {
          console.log("sent!", res);
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

