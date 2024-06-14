<template>
    <v-select
      v-model="selectedTurnover"
      label="Turnover"
      :items="turnoverList"
      @update:modelValue="emitEvent($event)"
      
    ></v-select>
</template>

<script>
export default {
  props: {
    currentTurnover: {
      type: String,
      required: true
    }
  },
  methods: {
    emitEvent (turnover) {
      this.$emit('turnoverUpdated', turnover)
    }
  },
  data: () => ({
    selectedTurnover: '',
    turnoverList:
    [
      "1) Rs 0 to 40 Lakhs",
      "2) Rs 40 Lakhs to 1.5 Cr",
      "3) Rs 1.5 Cr to 5 Cr",
      "4) Rs 5 Cr to 25 Cr",
      "5) Rs 25 Cr to 100 Cr",
      "6) Rs 100 Cr to 500 Cr",
      "7) Rs 500 Cr and above",
      "8) Other"
    ]
  }),
  mounted () {
    this.selectedTurnover = this.currentTurnover
  }
}
</script>