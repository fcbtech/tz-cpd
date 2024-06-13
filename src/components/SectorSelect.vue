<template>
    <v-select
      v-model="selectedSector"
      label="Sector"
      :items="sectorList"
      @update:modelValue="emitEvent($event)"
      
    ></v-select>
</template>

<script>
export default {
  props: {
    currentSector: {
      type: String,
      required: true
    }
  },
  methods: {
    emitEvent (industry) {
      this.$emit('sectorUpdated', industry)
    }
  },
  data: () => ({
    selectedSector: '',
    sectorList: [
      "Manufacturing",
      "Service",
      "Retail",
      "Trading",
      "Projects",
      "Other"
    ]
  }),
  mounted () {
    this.selectedSector = this.currentSector
  }
}
</script>