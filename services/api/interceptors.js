import axiosInstance from "./config";

const setup = (store) => {

  axiosInstance.interceptors.request.use(
    async (config) => {
      return config
    }, error => {

      return Promise.reject(error);
    })

  axiosInstance.interceptors.response.use((res) => {
    return res;
  }, (error) => {
    if (error.response.status === 404) {
      console.error(`URL: ${error.config.url} | msg: ${error.response.data.reason}`)
    }else{
      console.log(error.response)
    }
    return Promise.reject(error);
  });
}
export default setup;