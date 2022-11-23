import decode from "../services/jwt/decode";
import storages from "../services/storage/storages";
import {GET_USERINFO, REGISTER_SUCCESS, SIGN_IN_SUCCESS, SIGN_OUT} from "./types";
import api from "../services/api/api";

export const SignIn = (accessToken, refreshToken, idToken) => (dispatch) => {
  const user = decode.jwt(idToken)
  storages.save('userToken', JSON.stringify({
    accessToken: accessToken,
    refreshToken: refreshToken,
    idToken: idToken
  }))
  dispatch({type: SIGN_IN_SUCCESS, payload: user})
}

export const SignOut = () => (dispatch) => {
  console.log("SIGN_OUT")
  storages.remove('userToken')
  storages.remove('Token')
  storages.remove('userInfo')
  dispatch({type: SIGN_OUT})
}

export const RegisterSuccess = (data) => (dispatch) => {
  console.log(data)
  storages.save('userInfo', JSON.stringify(data))
  dispatch({type: REGISTER_SUCCESS, payload: data})
}

export const UpdateProfileData = (memId) => (dispatch) => {
  console.log("UpdateData!!")
  if(memId !== null){
    api.getUserDataById(memId).then(res => {
      if(res.status === 200){
        storages.save('userInfo', JSON.stringify(res.data))
        dispatch({type: REGISTER_SUCCESS, payload: res.data})
      }
    })
  }
}

export const getUserInfo = () => (dispatch) => {
  storages.getData('userInfo').then(res =>{
    if(res !== undefined){
      console.log("GET USERINFO!!")
      dispatch({type: GET_USERINFO, payload: JSON.parse(res)})
    }
  })
}