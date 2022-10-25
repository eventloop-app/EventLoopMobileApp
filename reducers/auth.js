import {SIGN_IN_SUCCESS, SIGN_IN_FAIL, SIGN_OUT, REGISTER_SUCCESS} from '../actions/types'
import storages from "../services/storage/storages";
import AsyncStorage from "@react-native-async-storage/async-storage";



const initialState = {
  authData: null,
  authError: null,
  userInfo: storages.getData('userInfo').then(res => {
    return res
  }),
};

export default function auth(state = initialState, action) {

  const {type, payload} = action;
  switch (type) {
    case SIGN_IN_SUCCESS:
      return {...state, authData: payload};
    case REGISTER_SUCCESS:
      return {...state, userInfo: payload};
    case SIGN_OUT:
      return {...state, userInfo: null, authData: null};
    default:
      return {...state};
  }
}
