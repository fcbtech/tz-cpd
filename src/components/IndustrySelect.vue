<template>
    <v-select
      v-model="selectedIndustry"
      label="Industry"
      :items="industryList"
      @update:modelValue="emitEvent($event)"
      
    ></v-select>
</template>

<script>
export default {
  props: {
    currentIndustry: {
      type: String,
      required: true
    }
  },
  methods: {
    emitEvent (industry) {
      this.$emit('industryUpdated', industry)
    }
  },
  data: () => ({
    selectedIndustry: '',
    industryList:
    [
      'Fashion Accessories & Supplies',
      'Food and Beverage',
      'Gems, Jewellery & Astrology',
      'Industrial Machinery and Supplies',
      'Mechanical Tools and Supplies',
      'Automotive, Parts & Spares',
      'Electrical and Electronics',
      'Chemicals and Solvents',
      'Plastic and Polymers',
      'Packaging Machines and Materials',
      'Metals, Alloys & Minerals',
      'Instruments and Equipments',
      'Petroleum',
      'Drugs and Medical',
      'Building and Construction',
      'Apparel and Garments',
      'Textiles, Yarn & Fabrics',
      'Paper and Paper Products',
      'Agriculture and Farming',
      'Cosmetics and Personal care',
      'FMCG',
      'Handicrafts and Decoratives',
      'Furniture & Supplies',
      'House and Office Supplies',
      'Others'
    ]
  }),
  mounted () {
    this.selectedIndustry = this.currentIndustry
  }
}
</script>