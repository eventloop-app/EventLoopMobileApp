import React, {useEffect, useState} from 'react';
import api from "../services/api/api";
import storages from "../services/storage/storages";
import {Image, Platform, ScrollView, Text, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import {toBuddhistYear} from "../constants/Buddhist-year";
import moment from "moment";
import EventCardList from "../components/eventCardList";

const EventListForOrgScreen = (props) => {
  const [userData, setUserData] = useState(null)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if(event !== null){
        setEvent(null)
        console.log('Reload Event')
        setTimeout(()=>{
          getEventOrg()
        },300)
      }
    });

    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    checkHasUser()
  }, [])

  useEffect(() => {
    getEventOrg()
  }, [userData])

  const getEventOrg = () =>{
    if (userData !== null) {
      api.getOrgEvent(userData.id).then(res => {
        if (res.status === 200) {
          setEvent(res.data.content)
        }
      })
    }
  }

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
    <View style={{flex: 1, marginTop: (Platform.OS === 'ios' ? 80 : 60)}}>
      <ScrollView
        style={{marginTop: 20}}
        contentContainerStyle={{paddingBottom: 300}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {
          event?.map((eve, index) => (
            <EventCardList key={index} item={eve} onPress={() => props.navigation.navigate('EventDetail', {event: eve})}/>
          ))
        }
      </ScrollView>
    </View>
  );
};

export default EventListForOrgScreen;