import { createRouter, createWebHashHistory } from "vue-router";
import LoginPage from '../views/LoginPage.vue';
import HomePage from '../views/HomePage.vue';
import { useProfileStore } from '@/piniaStore/common/auth/profile'
import HelloWorld from '../components/HelloWorld.vue';
import { checkAuthentication } from '@/utils/authentication';
import { ref } from "vue";

const routes = [
    {
        path: '/HelloWorld',
        name: 'HelloWorld',
        component: HelloWorld
    },
    {
        path: '/',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/HomePage',
        name: 'HomePage',
        component: HomePage
    }
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    // ...
    // explicitly return false to cancel the navigation
    // return true;
    const isAuthenticated = await checkAuthentication();
    console.log('IsAuthenticated: ', isAuthenticated)
    if (isAuthenticated) {

        if(to.name === 'LoginPage') {
            console.log('Rerouting to : HomePage')
            next({ name: 'HomePage' })
        } else {
            console.log('Rerouting to : ', to.fullPath)
            next()
        }
    }

    else if (to.name !== 'LoginPage') {
        console.log('Rerouting to : LoginPage')
        next({ name: 'LoginPage' });
    } else {
        console.log('Rerouting to : ', to.fullPath)
        next()
    }

})

export default router;
