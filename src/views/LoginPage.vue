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
          <v-text-field v-model="emailData
        " :rules="userIdRules" label="Tranzact UserID" required></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="passwordData"
            :rules="passwordRules"
            label="Tranzact Password"
            required
            type="password"
          />
        </v-col>
        <v-col cols="12">
          <v-btn
            type="submit"
            block
            class="text-white mt-2"
            style="background: #06AE6E;"
            @click="loginSubmit"
            @keyup.enter="loginSubmit"
            :disabled="isDisabled"
          >
          Sign In
        </v-btn>
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
  
<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProfileStore } from '@/piniaStore/common/auth/profile';

const route = useRoute();
const router = useRouter();
const profileStore = useProfileStore();
const submitLoginAction = profileStore.submitLoginAction;
const redirectLoginUser = profileStore.redirectLoginUser;


const publicPath = import.meta.env.BASE_URL;
let showPassword = ref(false);
let valid = false;
let emailData = ref('');
let passwordData = ref('');
let userIdRules = [
  value => {
    if (value) return true

    return 'UserId is required.'
  }
];
let passwordRules = [
  value => {
    if (value) return true

    return 'Password is required.'
  }
];


const loginSubmit = async () => {
  try {
    console.log("DUBEY: ", emailData
  .value + " " + passwordData.value);
    const userDataPayload = {
      email: emailData
    .value,
      password: passwordData.value,
    };

    let loginResponse = await submitLoginAction(userDataPayload);
    
    // redirectLoginUser({
    //   version: route.query.version,
    //   query: route.query,
    // });
    redirectLoginUser();

  } catch (error) {
    console.log('DUBEY ERROR: ', error);
  }
};
  const isDisabled = computed(() => {
    return emailData
  .value === '' || passwordData.value === ''
  })

</script>