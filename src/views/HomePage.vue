<template>
    <div>
        <NavBar />
        <v-container style="margin-top: 70px;">
            {{ useProfileStore().getUserFirstName() + ' ' + useProfileStore().getUserLastName() }}
            <v-row>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
import { useProfileStore } from '@/piniaStore/common/auth/profile';
</script>