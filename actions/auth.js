import decode from "../services/jwt/decode";
import storages from "../services/storage/storages";
import {REGISTER_SUCCESS, SIGN_IN_SUCCESS, SIGN_OUT} from "./types";

export const SignIn = (accessToken, refreshToken, idToken) => (dispatch) => {
  const user = decode.jwt(idToken)
  storages.save('userToken', JSON.stringify({
    accessToken: accessToken,
    refreshToken: refreshToken,
    idToken: idToken
  }))
  dispatch({type: SIGN_IN_SUCCESS, payload: user})
  return;
}

export const SignOut = () => (dispatch) => {
  console.log("SIGN_OUT")
  dispatch({type: SIGN_OUT, payload: null})
  return;
}

export const RegisterSuccess = (data) => (dispatch) => {
  console.log(data)
  storages.save('userInfo', JSON.stringify(data))
  dispatch({type: REGISTER_SUCCESS, payload: data})
  return;
}