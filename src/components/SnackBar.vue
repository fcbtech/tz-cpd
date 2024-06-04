<template>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="barColor">
        {{  messageText }}
    </v-snackbar>
</template>

<script>
export default {
  props: {
    messageText: {
      type: String,
      required: true
    },
    barColor: {
      type: String,
      required: false,
      default: 'blue-darken-1'
    },
    snackbar: {
      type: Boolean,
      required: true
    }
  },

  data: () => ({
  timeout: 5000
  })
}
</script>