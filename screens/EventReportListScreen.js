import React, {useEffect, useState} from 'react';
import {Image, Platform, ScrollView, Text, TouchableOpacity, View} from "react-native";
import api from "../services/api/api";
import storages from "../services/storage/storages";
import Colors from "../constants/Colors";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import {toBuddhistYear} from "../constants/Buddhist-year";
import moment from "moment/moment";
import EventCardList from "../components/eventCardList";

const EventReportListScreen = (props) => {

  const [userData, setUserData] = useState(null)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if(event !== null){
        setEvent(null)
        console.log('Reload Event')
        setTimeout(()=>{
          getAllEventReport()
        },300)
      }
    });

    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    checkHasUser()
  }, [])

  useEffect(() => {
    getAllEventReport()
  }, [userData])

  const getAllEventReport = () =>{
    if (userData !== null) {
      api.getAllEventReport(userData.id).then(res => {
        if (res.status === 200) {
          setEvent(res.data)
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

  const renderCardList = (id, name, start, end, img) => (
    <TouchableOpacity key={name} style={{width: '95%'}} activeOpacity={1}
                      onPress={() => props.navigation.navigate('EventReport', {eveId: id, memId: userData?.id})}>
      <View style={{
        flexDirection: 'row',
        width: '100%',
        height: 100,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: Colors.white,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
        <View style={{
          flex: 0.4,
          height: 80,
          borderRadius: 10,
          marginLeft: 12,
          overflow: 'hidden'
        }}>
          <Image
            style={{width: "100%", height: "100%"}}
            source={{
              uri: img ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1034872227377717278/no-image-available-icon-6.png'
            }}
          />
        </View>
        <View style={{flex: 1, height: 75, marginLeft: 12, marginRight: 10, justifyContent: 'center'}}>
          <Text style={{
            fontFamily: fonts.bold,
            fontSize: fontSize.small,
          }}>{`${toBuddhistYear(moment(start), "dd DD hh:mm น.")} - ${toBuddhistYear(moment(end), "dd DD hh:mm น.")}`}</Text>
          <Text numberOfLines={1} style={{fontFamily: fonts.bold, fontSize: fontSize.medium}}>{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={{flex: 1, marginTop: (Platform.OS === 'ios' ? 80 : 60)}}>
      <ScrollView
        style={{marginTop: 20}}
        contentContainerStyle={{paddingBottom: 300}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {
          event?.map((eve, index) => (
            <EventCardList key={index} item={eve} onPress={() => props.navigation.navigate('EventReport', {
              eveId: eve.id,
              memId: userData?.id
            })}/>
          ))
        }
      </ScrollView>
    </View>
  );
};

export default EventReportListScreen;