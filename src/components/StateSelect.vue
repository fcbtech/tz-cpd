<template>
    <v-select
      v-model="selectedState"
      label="States"
      :items="statesList"
      @update:modelValue="emitEvent($event)"
      
    ></v-select>
</template>

<script>
export default {
  props: {
    currentState: {
      type: String,
      required: true
    }
  },
  methods: {
    emitEvent (state) {
      this.$emit('stateUpdated', state)
    }
  },
  data: () => ({
    selectedState: '',
    statesList: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttarakhand",
      "Uttar Pradesh",
      "West Bengal",
      "Andaman and Nicobar Islands",
      "Chandigarh",
      "Dadra and Nagar Haveli",
      "Daman and Diu",
      "Delhi",
      "Lakshadweep",
      "Puducherry"
    ]
  }),
  mounted () {
    this.selectedState = this.currentState
  }
}
</script>