export const setJWTTokensToLocalStorage = (tokenType, token) => localStorage.setItem(tokenType, token);

export const getJWTTokenFromLocalStorage = (tokenType = 'access_token') => localStorage.getItem(tokenType);

export const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

export const isJWTTokenValid = (tokenType) => {
    console.log(tokenType)
    const token = getJWTTokenFromLocalStorage(tokenType);
    if (!token) return false;
    const extractedToken = parseJwt(token);
    const expirationTime = extractedToken.exp * 1000;
    const timediff = expirationTime - Date.now();
    console.log("TOKEN EXPIRY: ", tokenType + ' --- ' + timediff)
    if (timediff <= 0) {
        return false;
    }
    return token;
};

export const getRefreshToken = async (refreshToken) => {
    try {
        return async () => await axios.post("http://127.0.0.1:8001/main/login/api-token-refresh/", refreshToken);
    } catch (error) {
        console.log('Error in refreshing token: ', error)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
}
