// import { axiosPost } from '@/api/axiosBase';
import axios from 'axios';
import { defineStore } from 'pinia'
import router from '@/router'
import Constants from '@/utils/constants'
import { setJWTTokensToLocalStorage, parseJwt, removeJWTTokensToLocalStorage } from '@/utils/authentication'

export const useProfileStore = defineStore('profile', () => {
  const submitLoginAction = async (payload) => {

    try {
      let response = await axios.post('https://be.letstranzact.com/main/login/password-login/', payload)


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
    if (response.data.data.refresh_token) {
      setJWTTokensToLocalStorage('refresh_token', response.data.data.refresh_token);
      setUserDetailsToLocalStorage(response.data.data.refresh_token)
    }
    if (response.data.data.access_token) {
      setJWTTokensToLocalStorage('access_token', response.data.data.access_token);
    }


  };

  const redirectLoginUser = async (payload) => {

    let nextUrl = '/HomePage';

    console.log("Redirecting login user: ", nextUrl);
    router.push(nextUrl)
  };

  const logoutUserAction = async () => {
    removeJWTTokensToLocalStorage(Constants.ACCESS_TOKEN)
    removeJWTTokensToLocalStorage(Constants.REFRESH_TOKEN)
    removeUserDetailsFromLocalStorage()
    router.push('/')
  }
  const setUserDetailsToLocalStorage = (token) => {
    try {
      const parsedToken = parseJwt(token)
      if (!parsedToken)
        return false

      const firstName = parsedToken[Constants.FIRST_NAME]
      const lastName = parsedToken[Constants.LAST_NAME]
      const email = parsedToken[Constants.EMAIL]
      const contactNo = parsedToken[Constants.CONTACT_NO]
      const companyName = parsedToken[Constants.COMPANY_NAME]
      const companyId = parsedToken[Constants.COMPANY_ID]
      localStorage.setItem(Constants.FIRST_NAME, firstName)
      localStorage.setItem(Constants.LAST_NAME, lastName)
      localStorage.setItem(Constants.EMAIL, email)
      localStorage.setItem(Constants.CONTACT_NO, contactNo)
      localStorage.setItem(Constants.COMPANY_NAME, companyName)
      localStorage.setItem(Constants.COMPANY_ID, companyId)

    } catch (error) {
      console.log(error)
    }
  }

  const removeUserDetailsFromLocalStorage = () => {
    localStorage.removeItem(Constants.FIRST_NAME)
    localStorage.removeItem(Constants.LAST_NAME)
    localStorage.removeItem(Constants.EMAIL)
    localStorage.removeItem(Constants.CONTACT_NO)
    localStorage.removeItem(Constants.COMPANY_NAME)
    localStorage.removeItem(Constants.COMPANY_ID)
  }

  const getUserFirstName = () => {
    return localStorage.getItem(Constants.FIRST_NAME)
  }

  const getUserLastName = () => {
    return localStorage.getItem(Constants.LAST_NAME)
  }

  const getUserCompanyName = () => {
    return localStorage.getItem(Constants.COMPANY_NAME)
  }

  return {
    setUserDetails,
    submitLoginAction,
    logoutUserAction,
    redirectLoginUser,
    getUserCompanyName,
    getUserFirstName,
    getUserLastName
  };

});


