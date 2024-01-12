<template>
  <v-sheet id="theSheet" class="h-100 w-100 bg-grey-lighten-4">
    <!-- 
      TODO:
        validation using Vue documentation for form 
        Token for user authentication
    -->
    <v-container class="bg-white w-25 border-sm rounded-lg" style="margin-top:100px">
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-img :src="`img/Logo.svg`" max-width="250" max-height="60" />
        </v-col>
        <v-col cols="12" class="d-flex justify-center px-0 pt-0">
          <div class="text-caption text-center">
            Digitizing Manufacturing & Trading SMEs
          </div>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="firstname" :rules="nameRules" :counter="10" label="Tranzact UserID" required
          hide-details></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="lastname" :rules="nameRules" :counter="10" label="Tranzact Password" hide-details
          required></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn type="submit" block class="text-white mt-2" style="background: #06AE6E;">Sign In</v-btn>
        </v-col>
        <v-col cols="12" class="mt-3">
          <v-row class="d-flex justify-center align-center">
            <v-img class="mr-1" :src="`img/shield.svg`" max-width="20" />
            <div class="text-caption">
              100% Safe & Secure<br>
            </div>
          </v-row>
        </v-col>
        <v-col class="mb-3">
          <v-row class="text-caption d-flex justify-center">
            Trusted By 10,000+ Manufacturing & Trading SMEs
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>
  
<script>
import VButton from '../../../vuetify_001/src/components/VButton.vue';
const publicPath = import.meta.env.BASE_URL;
export default {
  components: { VButton },
  data: () => ({
    valid: false,
    firstname: '',
    lastname: '',
    nameRules: [
      value => {
        if (value) return true

        return 'Name is required.'
      },
      value => {
        if (value?.length <= 10) return true

        return 'Name must be less than 10 characters.'
      },
    ],
    email: '',
    emailRules: [
      value => {
        if (value) return true

        return 'E-mail is requred.'
      },
      value => {
        if (/.+@.+\..+/.test(value)) return true

        return 'E-mail must be valid.'
      },
    ],
  }),
}
</script>