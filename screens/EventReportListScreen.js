import React, {useEffect, useState} from 'react';
import {Platform, Text, TouchableOpacity, View} from "react-native";
import api from "../services/api/api";
import storages from "../services/storage/storages";

const EventReportListScreen = (props) => {

  const [userData, setUserData] = useState(null)
  const [event, setEvent] = useState(null)

  useEffect(()=>{
    checkHasUser()
  },[])

  useEffect(()=>{
    if(userData !== null){
      api.getAllEventReport(userData.memberId).then(res => {
        if(res.status === 200){
          setEvent(res.data)
        }
      })
    }
  },[userData])

  const checkHasUser = () => {
    storages.getUserData().then(res => {
      api.getUserDataById(res?.memberId).then(user => {
        if (user.status === 200) {
          setUserData(user.data)
        }
      }).catch(error => {
        setUserData(null)
        console.log("GET USER")
        console.log(error)
      })
    })
  }

  return (
    <View style={{flex: 1, marginTop: (Platform.OS === 'ios' ? 80 : 80)}}>
      {
        event?.map((en,index) => (
          <TouchableOpacity key={index} style={{margin: 5}} onPress={()=> props.navigation.navigate('EventReport', {eveId: en.id, memId: userData?.id})}>
            <Text>{en.id}</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  );
};

export default EventReportListScreen;