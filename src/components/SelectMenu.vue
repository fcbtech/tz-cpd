<template>
    <v-select
      v-model="selectedValue"
      :label="menuText"
      :items="menuList"
      @update:modelValue="emitEvent($event)"
      
    ></v-select>
</template>

<script>
export default {
  props: {
    currentValue: {
      type: String,
      required: true
    },
    menuText: {
      type: String,
      required: true
    },
    menuList: {
      type: Array,
      required: true
    }
  },
  methods: {
    emitEvent (turnover) {
      this.$emit('menuUpdated', turnover)
    }
  },
  data: () => ({
    selectedValue: '',
    // menuList:
    // [
    //   "1) Rs 0 to 40 Lakhs",
    //   "2) Rs 40 Lakhs to 1.5 Cr",
    //   "3) Rs 1.5 Cr to 5 Cr",
    //   "4) Rs 5 Cr to 25 Cr",
    //   "5) Rs 25 Cr to 100 Cr",
    //   "6) Rs 100 Cr to 500 Cr",
    //   "7) Rs 500 Cr and above",
    //   "8) Other"
    // ]
  }),
  mounted () {
    this.selectedValue = this.currentValue
  }
}
</script>