<template>
  <v-app-bar color="#343A40">
    <v-container class="mx-5 pa-0" :fluid="true">
      <v-row>
        <v-col class="d-flex align-center justify-start">
          <img src="https://tranzact.s3.amazonaws.com/static/assets/layouts/layout/img/logo.png" width="140px"
            alt="Logo" />
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn v-if="userType==='Cluster Team'" class="mx-2 btn-color" color="primary" @click="$emit('uploadData')">
            Upload Data
          </v-btn>
          <v-btn v-if="showAllotDataBtn" color="primary" class="btn-color mx-2 px-1" @click="$emit('allotData')">
            Allot Data
          </v-btn>
          <v-img src="@/assets/navbarCompanyLogo.svg" :max-height="40" :max-width="40" />
          <v-btn :ripple="false" class="text-none text-start" variant="plain" append-icon="mdi-chevron-down">
            {{ useProfileStore().getUserFirstName() + ' ' + useProfileStore().getUserLastName() }}
            <br>
            <!-- {{ useProfileStore().getUserCompanyName() }} -->
            {{ userType }}
            <!-- <v-menu class="pa-0" activator="parent" :open-on-hover="true" :open-delay="10" :close-delay="10"
              :open-on-click="false" :open-on-focus="false"> -->
            <v-menu class="pa-0" activator="parent">
              <!-- <v-list class="pa-0" height="40">
                <v-list-item variant="plain" class="pa-0">
                  <v-list-item-title class="text-center">Sign Out</v-list-item-title>
                </v-list-item>
              </v-list> -->
              <v-btn class="text-none" @click="useProfileStore().logoutUserAction">
                Sign Out
              </v-btn>
            </v-menu>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { useProfileStore } from "@/piniaStore/common/auth/profile";
const props = defineProps({
  userType: String,
  showAllotDataBtn: Boolean
})
</script>

<style scoped>
.btn-color {
  background-color: #1976d2 !important;
  color: #fff !important;
}
</style>