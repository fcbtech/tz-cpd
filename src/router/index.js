import { createRouter, createWebHistory } from "vue-router";
import LoginPage from '../views/LoginPage.vue';
import HelloWorld from '../components/HelloWorld.vue';

const routes = [
    {
        path: '/LoginPage',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router;
