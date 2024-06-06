import Constants from '@/utils/constants'
import axios from 'axios';

export const setJWTTokensToLocalStorage = (tokenType, token) => localStorage.setItem(tokenType, token);
export const removeJWTTokensToLocalStorage = (tokenType) => localStorage.removeItem(tokenType);

export const getJWTTokenFromLocalStorage = (tokenType = 'access_token') => localStorage.getItem(tokenType);

export const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

export const isJWTTokenValid = (tokenType) => {
    // console.log(tokenType)
    try {
        const token = getJWTTokenFromLocalStorage(tokenType);
        if (!token) return false;
        const extractedToken = parseJwt(token);
        // console.log('PARSED TOKEN: \n', extractedToken)
        const expirationTime = extractedToken.exp * 1000;
        const timediff = expirationTime - Date.now();
        // console.log("TOKEN EXPIRY: ", tokenType + ' --- ' + timediff)
        if (timediff <= 0) {
            return false;
        }
        return token;
    } catch (error) {
        console.log(`Error in validating token ${tokenType}: ${error}`)
        removeJWTTokensToLocalStorage(tokenType)
        return false;
    }
};

export const getRefreshToken = async (refreshToken) => {
    try {
        const fetchedTokenResponse = await axios.post("https://be.letstranzact.com/main/login/api-token-refresh/", refreshToken);
        return fetchedTokenResponse.data[Constants.ACCESS_TOKEN];
    } catch (error) {
        console.log('Error in refreshing token: ', error)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return false;
    }
}

const fetchNewAccessToken = async (refreshToken) => {
    try {
        // console.log('Refreshing token...');
        localStorage.removeItem('access_token');
        let fetchedAccessToken = await getRefreshToken({ refresh_token: refreshToken });

        if (fetchedAccessToken) {
            // console.log('Fetched Token: ', fetchedAccessToken)
            setJWTTokensToLocalStorage('access_token', fetchedAccessToken)
        } else {
            // console.log('Could not fetch Token: ', fetchedAccessToken)
            removeJWTTokensToLocalStorage('refresh_token')
            removeJWTTokensToLocalStorage('access_token')
        }
    } catch {
        // localStorage.removeItem('refresh_token');
        throw new Error('There was an error refreshing the token');
    }
};

export const checkAuthentication = async () => {
    // console.log('Rerouting...')
    // localStorage.removeItem('access_token')
    // localStorage.removeItem('refres_token')
    const accessToken = isJWTTokenValid('access_token')
    const refreshToken = isJWTTokenValid('refresh_token')
    // console.log('AccessToken: ', accessToken)
    // console.log('RefreshToken: ', refreshToken)

    if (accessToken) {
        return true;
    }

    if (refreshToken) {
        await fetchNewAccessToken(refreshToken)
        return true;
    }

    return false;
}