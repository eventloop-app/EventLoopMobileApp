import apis from "./config"

apis.interceptors.request.use( (config) => {
  // console.log(config)
  return config;
},  (error) => {
  return Promise.reject(error);
});

apis.interceptors.response.use( (res) =>{
  return res;
},  (error) => {
  if(error.response.status === 404){
    console.error(`URL: ${error.config.url} | msg: ${error.response.data.reason}`)
  }
  return Promise.reject(error);
});

class api {
  getAllEvents(){
     return apis({method: "get", url: `events?pageSize=100`})
  }
}
export default new api();