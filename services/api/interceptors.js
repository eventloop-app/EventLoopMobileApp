import axiosInstance from "./config";
import storages from "../storage/storages";

const setup = (store) => {

  axiosInstance.interceptors.request.use(
    async (config) => {
      try{
        await storages.getData('userToken').then(res => {
          console.log(JSON.parse(res).idToken)
          if (res !== undefined) {
            config.headers["Authorization"] = JSON.parse(res).idToken;
            config.headers["content-type"] = 'application/json';
          }
        });
      }catch (e) {
        console.log('can not read idToken!!!')
      }

      return config
    }, error => {
      return Promise.reject(error);
    })

  // axiosInstance.interceptors.response.use((res) => {
  //   return res;
  // }, (error) => {
  //   if (error.response.status === 404) {
  //     console.error(`URL: ${error.config.url} | msg: ${error.response.data.reason}`)
  //   }else{
  //     // console.log(error.response)
  //   }
  //   return Promise.reject(error);
  // });
}
export default setup;