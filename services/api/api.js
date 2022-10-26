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

  getAllEventReport(memberId){
    return apis({
      method: "post",
      url: `reports/getReports`,
      data: {memberId: memberId},
    })
  }

  getReportDetailById(memberId,eventId){
    console.log("getReportDetailById: "+ memberId)
    return apis({
      method: "post",
      url: `reports/getReports`,
      data: {memberId: memberId, eventId: eventId},
    })
  }

  stampReport(memberId,reportId,isReview){
    console.log(memberId,reportId,isReview)
    return apis({
      method: "put",
      url: `reports`,
      data: { reportId: reportId, memberId: memberId, isReview: isReview},
    })
  }
}
export default  new api();