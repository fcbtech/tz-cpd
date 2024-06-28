<template>
  <v-sheet id="theSheet" class="h-100 w-100 bg-grey-lighten-4">
    
      <v-snackbar v-model="snackbar" :timeout="timeout" color="red-lighten-3">
        {{  loginError }}
      </v-snackbar>
    <v-container
      class="bg-white w-25 border-sm rounded-lg"
      style="margin-top: 100px"
      @keyup.enter="loginSubmit"
    >
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-img :src="`img/Logo.svg`" max-width="250" max-height="60" />
        </v-col>
        <v-col cols="12" class="d-flex justify-center px-0 pt-0">
          <div class="text-caption text-center">
            Digitizing Manufacturing & Trading SMEs
          </div>
        </v-col>
        <v-col cols="12" class="pa-3">
          <v-text-field
            v-model="emailData"
            :rules="userIdRules"
            label="Tranzact UserID"
            variant="outlined"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="pa-0 px-3 pt-3">
          <v-text-field
            v-model="passwordData"
            :rules="passwordRules"
            label="Tranzact Password"
            required
            variant="outlined"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          />
        </v-col>
        <v-col cols="12">
          <v-btn
            type="submit"
            block
            class="text-white mt-2"
            style="background: #06ae6e"
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
            <div class="text-caption">100% Safe & Secure<br /></div>
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
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProfileStore } from "@/piniaStore/common/auth/profile";
import { removeJWTTokensToLocalStorage } from '@/utils/authentication'

const route = useRoute();
const router = useRouter();
const profileStore = useProfileStore();
const submitLoginAction = profileStore.submitLoginAction;
const redirectLoginUser = profileStore.redirectLoginUser;

const publicPath = import.meta.env.BASE_URL;
let snackbar = ref(false)
const timeout = 5000
let showPassword = ref(false);
let valid = false;
let emailData = ref("");
let passwordData = ref("");
let loginError = ref("Something Went Wrong")
let userIdRules = [
  (value) => {
    if (value) return true;

    return "UserId is required.";
  },
];
let passwordRules = [
  (value) => {
    if (value) return true;

    return "Password is required.";
  },
];

const loginSubmit = async () => {
  try {
    if(isDisabled.value) {
      loginError.value = 'Username Password cannot be empty'
      this.snackbar = true
      return
    }
    removeJWTTokensToLocalStorage('access_token')
    removeJWTTokensToLocalStorage('refresh_token')
    const userDataPayload = {
      email: emailData.value,
      password: passwordData.value,
    };

    let loginResponse = await submitLoginAction(userDataPayload);
    if (loginResponse.message !== '') {
      loginError.value = 'The Login ID and Password are incorrect'
      snackbar.value = true
    }
    redirectLoginUser();
  } catch (error) {
    snackbar.value = true
    console.log("Error in loginSubmit: ", error);
  }
};
const isDisabled = computed(() => {
  return emailData.value === "" || passwordData.value === "";
});
</script>