// import { axiosPost } from '@/api/axiosBase';
import axios from 'axios';
import { defineStore } from 'pinia'




export const useProfileStore = defineStore('profile', () => {
  const submitLoginAction = async (payload) => {
    // function to handle username/pwd login
    
    // let response = await axiosPost('/main/login/password-login/', payload, {
    //   unauthorized: true,
    //   // baseUrl: config.baseUrl,
    //   baseUrl: "arbitrary",
    // });
    
    let response = axios.post('https://be.letstranzact.com/main/login/password-login/', payload)
    .then((res) => {

      console.log("Res.data ", res.data)
      success = true
    }).catch((error) => {
      error = error.data.message
    })

    console.log("Response: ", response);
    if (!response)
      console.log("Dubey: no response received");

    // throw new DisplayableError('No response received.');
    if (!response.data.status)
      console.log("Dubey: response data status is false ", response.data.message)
    // throw new DisplayableError(response.data.message);

    if (!response.payload)
      console.log("Dubey: no data received from server")
    // throw new DisplayableError('No data received from server.');

    if (!response.payload.access_token)
      console.log("Dubey: message not present in response ", response.data.message)
    // throw new DisplayableError(response.data.message);

    setUserDetails(response.payload);

    return {
      data: { message: '', user: state.user },
      payload: response.payload,
      error: '',
      login: true,
    };
  };


  const setUserDetails = (payload) => {
    if (payload.refresh_token) setJWTTokensToLocalStorage('refresh_token', payload.refresh_token);
    if (payload.access_token) {
      Object.assign(state.user, jwtDecode(payload.access_token));
      setJWTTokensToLocalStorage('access_token', payload.access_token);
    }
  };

  const redirectLoginUser = async (payload) => {
    // let { nextUrl = '/home/' } = (payload.query ? payload.query : {});
  
    // if (nextUrl.includes('/v2')) {
    //   nextUrl = nextUrl.replace('/v2', '');
    //   routerV2(nextUrl, payload.query);
    // } else {
    //   nextUrl = nextUrl.replace('/v3', '');
    //   router.push(nextUrl);
    // }

    console.log("Redirecting user");
  };

  return {
    setUserDetails,
    submitLoginAction,
    redirectLoginUser,
  };
});


