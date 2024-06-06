<template>
    <!-- <div v-if="loading" class="loading-page">
      <p>Loading...</p>
    </div> -->
    <v-overlay
        :model-value="loading"
        class="align-center justify-center"
        :persistent="true"
      >
        <img src="@/assets/gif/tz-loader.gif" height="200px">
        <!-- <v-progress-circular
          color="primary"
          :size="65"
          :width="8"
          indeterminate
        ></v-progress-circular> -->
      </v-overlay>
  </template>
  
  <script>
    export default {
      props: {
        loading: {
          type: Boolean,
          required: true
        }
      },
      methods: {
        start() {
          this.loading = true
        },
        finish() {
          this.loading = false
        }
      }
    }
  </script>
  
  <style scoped>
    .loading-page {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      text-align: center;
      padding-top: 200px;
      font-size: 30px;
      z-index: 99999;
    }
  </style>