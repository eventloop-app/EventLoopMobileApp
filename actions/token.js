import storages from "../services/storage/storages";
import {GET_TOKEN, SAVE_TOKEN_SUCCESS} from "./types";


export const Token = (token) => (dispatch) => {
  if(token !== undefined && token !== null){
    console.log("SAVE TOKEN")
    storages.save('Token', token)
    dispatch({type: SAVE_TOKEN_SUCCESS, payload: token})
  }
}

export const getToken = (token) => (dispatch) => {
  console.log("GET TOKEN")
  storages.getData('Token').then(res =>{
    dispatch({type: GET_TOKEN, payload: res})
  })
}

