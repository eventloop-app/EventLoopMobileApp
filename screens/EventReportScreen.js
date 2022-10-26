import React, {useEffect, useState} from 'react';
import {Platform, Text, TouchableOpacity, View} from "react-native";
import api from "../services/api/api";

const EventReportScreen = (props) => {

  const [eventInfo, setEventInfo] = useState(null)
  const [reports, setReports] = useState(null)
  const [isLoad, setIsLoad] = useState(false)

  useEffect(()=>{
    console.log(props)
    api.getReportDetailById(props.route.params.memId,props.route.params.eveId).then(res => {
      if(res.status === 200){
        setEventInfo(res.data)
        setReports(res.data[0].reports)
      }
    })
  },[])

  const onStampReview = (eve) =>{
    setIsLoad(true)
    api.stampReport(props.route.params.memId, eve.id, !eve.isReview).then(res => {
      if(res.status === 200){
        let newReport = reports
        newReport[reports.findIndex(r => r.id === eve.id)] = {...eve, isReview: !eve.isReview}
        setReports(newReport)
        setIsLoad(false)
      }
    })
  }

  return ( !isLoad &&
    <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 80:80}}>
      {
        reports?.map((rep, inx) => (
          <TouchableOpacity key={inx} style={{margin: 5}} onPress={()=> onStampReview(rep)}>
            <Text style={{color: rep.isReview ? 'green' : 'red'}}>{rep.id}</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  );
};

export default EventReportScreen;