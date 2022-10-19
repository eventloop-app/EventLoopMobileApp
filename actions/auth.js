import decode from "../services/jwt/decode";
import storages from "../services/storage/storages";
import {SIGN_IN_SUCCESS} from "./types";

export const SignIn = (accessToken, refreshToken, idToken) => (dispatch) => {
  const user = decode.jwt(idToken)
  storages.save('userToken', JSON.stringify({
    accessToken: accessToken,
    refreshToken: refreshToken,
    idToken: idToken
  }))
  dispatch({type: SIGN_IN_SUCCESS, payload: {user: user}})
}