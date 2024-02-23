/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */


import { registerPlugins } from '@/plugins'
import App from '@/App.vue';
import router from './router'
import { createApp } from 'vue'
import { pinia } from './piniaStore';


const app = createApp(App)
app.use(router)
app.use(pinia)

registerPlugins(app)

app.mount('#app')
