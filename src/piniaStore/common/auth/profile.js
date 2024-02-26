// import { axiosPost } from '@/api/axiosBase';
import axios from 'axios';
import { defineStore } from 'pinia'
import router from '@/router'




export const useProfileStore = defineStore('profile', () => {
  const submitLoginAction = async (payload) => {
    // function to handle username/pwd login

    // let response = await axiosPost('/main/login/password-login/', payload, {
    //   unauthorized: true,
    //   // baseUrl: config.baseUrl,
    //   baseUrl: "arbitrary",
    // });
    let response = await axios.post('http://127.0.0.1:8001/main/login/password-login/', payload)
    // .then((res) => {

    //   console.log("Res.data ", JSON.stringify(res.data))
    //   console.log("Res ", JSON.stringify(res))
    //   // success = true
    // }).catch((error) => {
    //   // error = error.data.message
    //   console.log('ERROR: ', error)
    // })

    console.log("Response: ", JSON.stringify(response));

    // setUserDetails(response.data.data);

    return {
      message: response.data.message,
      data: response.data.data
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
    let { nextUrl = '/HelloWorld/' } = (payload.query ? payload.query : {});

    // if (nextUrl.includes('/v2')) {
    //   nextUrl = nextUrl.replace('/v2', '');
    //   routerV2(nextUrl, payload.query);
    // } else {
    //   nextUrl = nextUrl.replace('/v3', '');
    //   router.push(nextUrl);
    // }

    router.push(nextUrl)

    console.log("Redirecting user");
  };

  return {
    setUserDetails,
    submitLoginAction,
    redirectLoginUser,
  };
});


