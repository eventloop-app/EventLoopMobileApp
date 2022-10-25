import {SAVE_TOKEN_SUCCESS} from "../actions/types";
import storages from "../services/storage/storages";

const initialState = {
  token: null,
};

export default function token(state = initialState, action) {
  const {type, payload} = action;
  switch (type) {
    case SAVE_TOKEN_SUCCESS:
      return {...state, token: payload};
    default:
      return storages.getData('Token').then(res => {
        return res
      })
  }
}
