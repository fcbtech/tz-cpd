<template>
  <v-app-bar color="#343A40">
    <v-container class="mx-5 pa-0" :fluid="true">
      <v-row>
        <v-col class="d-flex align-center justify-start">
          <img src="https://tranzact.s3.amazonaws.com/static/assets/layouts/layout/img/logo.png" width="140px"
            alt="Logo" />
        </v-col>
        <v-col class="d-flex justify-end">
          <v-img src="@/assets/navbarCompanyLogo.svg" :max-height="40" :max-width="40" />
          <v-btn :ripple="false" class="text-none" variant="plain" append-icon="mdi-chevron-down">
            Name
            <v-menu class="pa-0" activator="parent" :open-on-hover="true" :open-delay="10" :close-delay="10"
              :open-on-click="false" :open-on-focus="false">
              <!-- <v-list class="pa-0" height="40">
                <v-list-item variant="plain" class="pa-0">
                  <v-list-item-title class="text-center">Sign Out</v-list-item-title>
                </v-list-item>
              </v-list> -->
              <v-btn class="text-none">
                Sign Out
              </v-btn>
            </v-menu>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>