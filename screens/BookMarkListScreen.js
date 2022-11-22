import React, {useEffect, useState} from 'react';
import {Image, Platform, ScrollView, Text, TouchableOpacity, View} from "react-native";
import fontSize from "../constants/FontSize";
import fonts from "../constants/Fonts";
import Colors from "../constants/Colors";
import api from "../services/api/api";
import storages from "../services/storage/storages";
import {toBuddhistYear} from "../constants/Buddhist-year";
import moment from "moment";
import EventCardList from "../components/eventCardList";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";

const BookMarkListScreen = (props) => {

  const [userData, setUserData] = useState(null)
  const [eventInfo, setEventinfo] = useState(null)
  const [bookMark, setBookMark] = useState(null)


  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     console.log('subscribe')
  //     checkHasUser()
  //
  //   });
  //
  //   return () =>{
  //     console.log('unsubscribe')
  //     return unsubscribe
  //   };
  // }, [props.navigation]);

  useEffect(() => {
    checkHasUser()
  }, [])

  const checkHasUser = () => {
    storages.getUserData().then(res => {
      api.getUserDataById(res?.memberId).then(user => {
        if (user.status === 200) {
          setUserData(user.data)
          getBookMark(user.data.id)
        }
      }).catch(error => {
        setUserData(null)

      })
    })
  }

  const getBookMark = (memId) => {
    api.getBookMark({memberId: memId}).then((res) => {
      setBookMark(res.data)
    })
  }

  const renderCardList = (id, name, start, end, img) => (
    <TouchableOpacity key={name} style={{width: '95%'}} activeOpacity={1} onPress={()=> props.navigation.navigate('EventDetail', {event: {id: id}})}>
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
    userData ?
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={{width: '100%', alignItems: 'center', marginTop: Platform.OS === 'ios' ? 60 : 40}}>
        <Text style={{fontFamily: fonts.bold, fontSize: fontSize.big}}>รายการกิจกรรมที่ชื่นชอบ</Text>
      </View>
      <ScrollView
        style={{marginTop: 20}}
        contentContainerStyle={{paddingBottom: 300}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
          {
            bookMark?.map((eve, index) => (
              <EventCardList key={index} item={eve} onPress={()=> props.navigation.navigate('EventDetail', {event: {id: eve.id}})}/>
            ))
          }
      </ScrollView>
    </View>
      :
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{
          marginLeft: 10,
          fontFamily: Fonts.bold,
          fontSize: FontSize.big,
          color: Colors.black
        }} >คุณยังไม่ได้เข้าสู่ระบบ</Text>
      </View>
  );
};

export default BookMarkListScreen;