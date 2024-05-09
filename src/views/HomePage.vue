<template>
  <div>
    <NavBar />
    <v-container style="margin-top: 70px;">
      {{ useProfileStore().getUserFirstName() + ' ' + useProfileStore().getUserLastName() }}
      <v-row>
        <v-col>
          <span>
            Connect your Tally
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field v-model="tallyIP" label="Tally IP" variant="outlined" :height="70" value="localhost"
            required></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="tallyPort" type="number" value="9000" label="Port Number" variant="outlined"
            required></v-text-field>
        </v-col>
        <v-col>
          <v-checkbox v-model="isTally3dot0" label="Tally 3.0" value="Tally 3.0"></v-checkbox>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue';
import { useProfileStore } from '@/piniaStore/common/auth/profile';

const isTally3dot0 = ref(false)
const tallyIP = ref('localhost')
const tallyPort = ref(9000)
</script>