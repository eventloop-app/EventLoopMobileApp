import storages from "../services/storage/storages";
import {SAVE_TOKEN_SUCCESS} from "./types";

export const Token = (token) => (dispatch) => {
  console.log("SAVE TOKEN")
  storages.save('Token', token)
  dispatch({type: SAVE_TOKEN_SUCCESS, payload: token})
  return;
}

