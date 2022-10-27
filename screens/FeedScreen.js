import React, {useEffect, useState} from 'react';
import {Dimensions, Image, Platform, ScrollView, StatusBar, Text, View} from "react-native";
import api from "../services/api/api";
import EventCards from "../components/eventCards";
import Colors from "../constants/Colors";
import {FlashList} from "@shopify/flash-list";
import storages from "../services/storage/storages";
import {useDispatch, useSelector} from "react-redux";
import {Token} from "../actions/token";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";


const FeedScreen = (props) => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState(null)
  const [isLoad, setIsLoad] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      console.log('Hello')
      checkHasUser()
      getAllEvent()
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);

  const checkHasUser = () => {
    storages.getUserData().then(res => {
      api.getUserDataById(res?.memberId).then(user => {
        if (user.status === 200) {
          setUserData(user.data)
          console.log(user.data.id)
        }
      }).catch(error => {
        setUserData(null)
        console.log("GET USER")
        console.log(error)
      })
    })
  }

  useEffect(() => {
    storages.getData('Token').then(res => {
      if (res === undefined) {
        dispatch(Token(props.route.params.token))
      }
    })
  }, [])

  useEffect(() => {
    getAllEvent()
  }, [])

  const getAllEvent = () =>{
    api.getAllEvents().then(async res => {
      if (res.status === 200 && res.data.content.length > 0) {
        setEvents(res.data.content)
        setIsLoad(false)
      } else {
        // console.error("Data is empty!!")
        setIsLoad(false)
        // props.navigation.navigate('Error')
      }
    }).catch(error => {
      console.error(error)
      // props.navigation.navigate('Error')
      return;
    })
  }

  return (
    !isLoad &&
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: Colors.white,
      }}
    >
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"dark-content"}
      />
      <View style={{
        flex: 1,
      }}
      >
        <View style={{
          flex: 1,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          width: '100%',
          height: 150,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: Colors.primary,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          zIndex: 50
        }}>
          <View style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            marginTop: Platform.OS === 'ios' ? 55 : 45
          }}>
            <Image
              source={userData?.profileUrl ? {uri: userData?.profileUrl} : require('../assets/images/profileImage.jpg')}
              style={{
                marginLeft: 10,
                height: 80,
                width: 80,
                backgroundColor: Colors.gray,
                borderRadius: 100,
                borderWidth: 4,
                borderColor: Colors.white
              }}/>
            <View
              style={{
                backgroundColor: Colors.white,
                alignSelf: 'flex-start',
                borderRadius: 50,
                paddingHorizontal: 8,
                marginTop:24,
                marginLeft: 10
              }}>
              <Text numberOfLines={1} style={{
                fontFamily: Fonts.bold,
                fontSize: FontSize.primary,
                color: Colors.black,
              }}>{userData?.username ? userData?.username : "คุณยังไม่ได้เข้าสู้ระบบ"}</Text>
            </View>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{paddingBottom: 220,}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{
            flex: 1,
            paddingTop: 170,
            backgroundColor: Colors.white
          }}>
          <View>
            <FlashList
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={events}
              refreshing={false}
              renderItem={({item}) => {
                return (
                  <EventCards event={item} onPress={() => props.navigation.navigate('EventDetail', {event: item})}/>
                )
              }}
              estimatedItemSize={300}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default FeedScreen;