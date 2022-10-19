import {SIGN_IN_SUCCESS, SIGN_IN_FAIL, SIGN_OUT} from '../actions/types'

const initialState = {
  authData: null,
  authError: null
};

export default function auth(state = initialState, action) {

  const {type, payload} = action;
  switch (type) {
    case SIGN_IN_SUCCESS:
      return {...state, authData: payload};
    case SIGN_IN_FAIL:
      return {...state, authError: payload};
    case SIGN_OUT:
      return {...state, authData: null};
    default:
      return {...state};
  }
}
