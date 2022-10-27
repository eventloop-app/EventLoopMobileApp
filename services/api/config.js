import axios from "react-native-axios";
import {API_URL} from "@env"
//'http://192.168.2.59:8080/eventService/'
const instance = axios.create({
  baseURL: API_URL
});


export default instance;
