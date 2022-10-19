import axios from "react-native-axios";
import {API_URL} from "@env"

const instance = axios.create({
  baseURL: API_URL,
});


export default instance;
