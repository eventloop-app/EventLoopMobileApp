import apis from "./config"

// apis.interceptors.request.use( (config) => {
//   // console.log(config)
//   return config;
// },  (error) => {
//   return Promise.reject(error);
// });
//
// apis.interceptors.response.use( (res) =>{
//   return res;
// },  (error) => {
//   if(error.response.status === 404){
//     console.error(`URL: ${error.config.url} | msg: ${error.response.data.reason}`)
//   }
//   return Promise.reject(error);
// });

class api {

  getAllEvents(){
     return apis({method: "get", url: `events?pageSize=100`})
  }

  checkUserEmail(email){
    return apis({
      method: "post",
      url: `members/hasEmail`,
      data: {email: email}
    })
  }

  checkUsername(username){
    return apis({
      method: "post",
      url: `members/hasUsername`,
      data: {username: username}
    })
  }

  transferMemberData(data){
    return apis({
      method: "post",
      url: `members/transferMemberData`,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    })
  }

  getUserDataById(id){
    return apis({
      method: "get",
      url: `members/${id}`
    })
  }
}
export default  new api();