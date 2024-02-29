import { createRouter, createWebHistory } from "vue-router";
import LoginPage from '../views/LoginPage.vue';
import { useProfileStore } from '@/piniaStore/common/auth/profile'
import HelloWorld from '../components/HelloWorld.vue';
import { isJWTTokenValid, getRefreshToken, setJWTTokensToLocalStorage, removeJWTTokensToLocalStorage } from '@/utils/authentication';
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
    }
]
const fetchNewAccessToken = async (refreshToken) => {
    try {
        console.log('Refreshing token...');
        localStorage.removeItem('access_token');
        let fetchedAccessToken = await getRefreshToken({ refresh_token: refreshToken });

        if (fetchedAccessToken) {
            setJWTTokensToLocalStorage('access_token', fetchNewAccessToken)
        } else {
            removeJWTTokensToLocalStorage('refresh_token')
            removeJWTTokensToLocalStorage('access_token')
        }
    } catch {
        // localStorage.removeItem('refresh_token');
        throw new Error('There was an error refreshing the token');
    }
};

async function checkAuthentication() {
    console.log('Rerouting...')
    // localStorage.removeItem('access_token')
    // localStorage.removeItem('refres_token')
    const accessToken = isJWTTokenValid('access_token')
    const refreshToken = isJWTTokenValid('refresh_token')
    console.log('AccessToken: ', accessToken)
    console.log('RefreshToken: ', refreshToken)

    if (accessToken) {
        return true;
    }

    if (refreshToken) {
        await fetchNewAccessToken(refreshToken)
        return true;
    }

    return false;
}
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    // ...
    // explicitly return false to cancel the navigation
    // return true;
    const isAuthenticated = await checkAuthentication();
    console.log('IsAuthenticated: ', isAuthenticated)
    if (isAuthenticated) {
        console.log('Rerouting to : ', to.fullPath)
        next()
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
