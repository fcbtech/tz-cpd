import { createRouter, createWebHistory } from "vue-router";
import LoginPage from '../views/LoginPage.vue';
import { useProfileStore } from '@/piniaStore/common/auth/profile'
import HelloWorld from '../components/HelloWorld.vue';
import { isJWTTokenValid, getRefreshToken } from '@/utils/authentication';
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
        let response = await getRefreshToken({ refresh_token: refreshToken });

        if (response) {
            useProfileStore().setUserDetails(response);
        }
    } catch {
        localStorage.removeItem('refresh_token');
        throw new Error('There was an error refreshing the token');
    }
}
    ;
const routerV3 = (path, queryParams, newTab = false, returnUrl = false) => {
    let finalPath = `${vue3BaseUrl}${path}`;
    if (queryParams) {
        finalPath += '?';
        for (let param in queryParams) {
            if (queryParams[param].replace('/', '')) finalPath += `${param}=${encodeURIComponent(queryParams[param])}&`;
        }
        finalPath = finalPath.slice(0, -1);
    }
    if (returnUrl) {
        return finalPath;
    }
    if (newTab) {
        window.open(finalPath);
    } else {
        window.location.href = finalPath;
    }
    return '';
};

async function checkAuthentication() {
    try {
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

        // routerV3('/LoginPage', { nextUrl: to.fullPath });
        return false;

    } catch (error) {
        console.log('ERROR IN REROUTING: ', error)
        return false;
        // routerV3('/LoginPage', { nextUrl: to.fullPath });


    }
}
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    // ...
    // explicitly return false to cancel the navigation
    // return true;
    const isAuthenticated = await checkAuthentication(to, next);
    console.log('IsAuthenticated: ', isAuthenticated)
    console.log('Rerouting to : ', to.fullPath)
    if (isAuthenticated)
        next()

    else if (to.name !== 'LoginPage') {
        next({ name: 'LoginPage' });
    } else {
        next()
    }

})

export default router;
