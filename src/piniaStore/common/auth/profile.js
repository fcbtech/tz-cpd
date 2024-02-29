// import { axiosPost } from '@/api/axiosBase';
import axios from 'axios';
import { defineStore } from 'pinia'
import router from '@/router'
import { setJWTTokensToLocalStorage, getJWTTokenFromLocalStorage } from '@/utils/authentication'




export const useProfileStore = defineStore('profile', () => {
  const submitLoginAction = async (payload) => {

    try {
      let response = await axios.post('http://127.0.0.1:8001/main/login/password-login/', payload)


      console.log("Response: ", JSON.stringify(response));

      setUserDetails(response);
      return {
        message: response.data.message,
        data: response.data.data
      };
    } catch (error) {
      console.log('Error in submitLoginAction: ', error)
      throw error
    }
  };


  const setUserDetails = (response) => {
    if (response.data.data.refresh_token) setJWTTokensToLocalStorage('refresh_token', response.data.data.refresh_token);
    if (response.data.data.access_token) {
      setJWTTokensToLocalStorage('access_token', response.data.data.access_token);
    }
  };

  const redirectLoginUser = async (payload) => {

    let nextUrl = '/HomePage';

    console.log("Redirecting login user: ", nextUrl);
    router.push(nextUrl)
  };

  return {
    setUserDetails,
    submitLoginAction,
    redirectLoginUser,
  };
});


