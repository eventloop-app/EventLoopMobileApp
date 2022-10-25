import { combineReducers } from "redux";
import auth from "./auth";
import token from "./token";
export default combineReducers({
  auth,
  token
});
