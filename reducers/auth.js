import {SIGN_IN_SUCCESS, SIGN_IN_FAIL, SIGN_OUT, REGISTER_SUCCESS, GET_USERINFO} from '../actions/types'
import storages from "../services/storage/storages";

const initialState = {
  authInfo: null,
  authError: null,
  userInfo: null
};

export default function auth(state = initialState, action) {
  const {type, payload} = action;
  switch (type) {
    case SIGN_IN_SUCCESS:
      return {...state, authInfo: payload};
    case REGISTER_SUCCESS:
      return {...state, userInfo: payload};
    case GET_USERINFO:
      return {...state, userInfo: payload};
    case SIGN_OUT:
      return {...state, userInfo: null, authInfo: null};
    default:
      return {...state};
  }
}
