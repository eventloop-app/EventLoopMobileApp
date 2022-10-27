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
    console.log(memberId)
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

  createEvent(data){
    return apis({
      method: "post",
      url: `events/createEvent`,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    })
  }

  getEventByOrg(memId){
    return apis({
      method: "get",
      url: `members/${memId}/createEvent`
    })
  }

  suspendEvent(data){
    console.log(data)
    return apis({
      method: "post",
      url: `admin/stampEventStatus`,
      data: data,
    })
  }

  getEventById(eveId){
    return apis({
      method: "get",
      url: `events/${eveId}`
    })
  }

  editEvent(data){
    return apis({
      method: "put",
      url: `events/editEvent`,
      data: data,
      headers: { "Content-Type": "multipart/form-data" },
    })
  }

  stampBookMark(data){
    return apis({
      method: "post",
      url: `members/bookmark`,
      data: data,
    })
  }

  getBookMark(memId){
    return apis({
      method: "post",
      url: `members/getBookmark`,
      data: memId
    })
  }

  reportEvent(data){
    return apis({
      method: "post",
      url: `reports/submit`,
      data: data,
    })
  }

  registerEvent(data){
    return apis({
      method: "post",
      url: `events/registerEvent`,
      data: data
    })
  }

  isRegisterEvent(data){
    return apis({
      method: "post",
      url: `events/isRegister`,
      data: data
    })
  }

  unRegisterEvent(data){
    return apis({
      method: "post",
      url: `events/unregisterEvent`,
      data: data
    })
  }

  generateCode(data){
    return apis({
      method: "post",
      url: `events/generateCode`,
      data: data
    })
  }

  checkIn(data){
    return apis({
      method: "post",
      url: `events/checkIn`,
      data: data
    })
  }

  getCheckInMem(data){
    return apis({
      method: "get",
      url: `events/getCheckIn`,
      data: data
    })
  }

  getRegMem(data){
    return apis({
      method: "post",
      url: `events/getRegisterMember`,
      data: data
    })
  }

  isCheckIn(data){
    return apis({
      method: "post",
      url: `events/isCheckIn`,
      data: data
    })
  }

  getOrgEvent(memId){
    return apis({
      method: "get",
      url: `members/${memId}/registerEvent?pageSize=100`,
    })
  }

  reviewEvent(data){
    return apis({
      method: "post",
      url: `/events/submitFeedback`,
      data: data
    })
  }

  isReview(data){
    return apis({
      method: "post",
      url: `/events/isReview`,
      data: data
    })
  }

  getEventBySearch(keyword){
    return apis({
      method: "get",
      url: `events/getEventByKeyword?keyword=${keyword}&pageSize=100`,
    })
  }













}
export default  new api();