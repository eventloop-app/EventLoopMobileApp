import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, Image, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import api from "../services/api/api";
import EventCards from "../components/eventCards";
import Colors from "../constants/Colors";
import {FlashList} from "@shopify/flash-list";
import storages from "../services/storage/storages";
import {useDispatch, useSelector} from "react-redux";
import {Token} from "../actions/token";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import EventCardHorizon from "../components/EventCardHorizon";
import * as Location from 'expo-location';

const FeedScreen = (props) => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState(null)
  const [isLoad, setIsLoad] = useState(true)
  const [userData, setUserData] = useState(null)
  const [eventAttention, setEventAttention] = useState(null)
  const [eventsNearMe, setEventsNearMe] = useState(null)
  const [eventsByTag, setEventsByTag] = useState(null)
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      await setLocation(location);
      await getEventNearMe(location.coords.latitude, location.coords.longitude)
      setTimeout(() => {
        setIsLoad(false)
      }, 5000)
    })();
  }, []);

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
          getEventByTag(user.data?.tags)
          console.log(user.data.tags)
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
    getEventAttention()
  }, [])

  const getEventAttention = () => {
    api.getEventAttention().then(async res => {
      if (res.status === 200 && res.data.content.length > 0) {
        setEventAttention(res.data.content)

      } else {
        // console.error("Data is empty!!")

        // props.navigation.navigate('Error')
      }
    }).catch(error => {
      console.warn(error)
      // props.navigation.navigate('Error')
      return;
    })
  }

  const getEventNearMe = (lat, lng) => {
    api.getEventByRang(lat, lng).then(async res => {
      if (res.status === 200 && res.data.content.length > 0) {
        setEventsNearMe(res.data.content)
      }
    }).catch(error => {
      console.warn(error)
      // props.navigation.navigate('Error')
      return;
    })
  }

  const getEventByTag = (tags) => {
    api.getEventByTag(tags).then(async res => {
      if (res.status === 200) {
        setEventsByTag(res.data.content)
      }
    }).catch(error => {
      console.warn(error)
      // props.navigation.navigate('Error')
      return;
    })
  }

  const getAllEvent = () => {
    api.getAllEvents().then(async res => {
      if (res.status === 200 && res.data.content.length > 0) {
        setEvents(res.data.content)

      } else {
        // console.error("Data is empty!!")

        // props.navigation.navigate('Error')
      }
    }).catch(error => {
      console.warn(error)
      // props.navigation.navigate('Error')
      return;
    })
  }

  return (
    !isLoad ?
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
                  marginTop: 24,
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
              <View style={{display: 'flex', flexDirection: 'row', height: 30, alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.primary,
                    color: Colors.black,
                    marginLeft: 10
                  }}>กิจกรรมมาแรง</Text>
                </View>
                <TouchableOpacity onPress={() => props.navigation.navigate('EventList', {event: eventAttention})}
                                  style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.primary,
                    color: Colors.black,
                    marginRight: 10
                  }}>เพิ่มเติม</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={eventAttention}
                renderItem={({item}) => (
                  <EventCardHorizon item={item} onPress={() => props.navigation.navigate('EventDetail', {
                    event: item,
                    name: item.eventName
                  })}/>)}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              />

              {
                eventsNearMe?.length > 0 &&
                <View style={{marginTop: 15}}>
                  <View style={{display: 'flex', flexDirection: 'row', height: 30, alignItems: 'center'}}>
                    <View style={{flex: 1}}>
                      <Text style={{
                        fontFamily: Fonts.bold,
                        fontSize: FontSize.primary,
                        color: Colors.black,
                        marginLeft: 10
                      }}>กิจกรรมใกล้ฉัน</Text>
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.navigate('EventList', {event: eventsNearMe})}
                                      style={{flex: 1, alignItems: 'flex-end'}}>
                      <Text style={{
                        fontFamily: Fonts.bold,
                        fontSize: FontSize.primary,
                        color: Colors.black,
                        marginRight: 10
                      }}>เพิ่มเติม</Text>
                    </TouchableOpacity>
                  </View>
                  <FlashList
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={eventsNearMe}
                    refreshing={false}
                    renderItem={({item}) => {
                      return (
                        <EventCards event={item}
                                    onPress={() => props.navigation.navigate('EventDetail', {event: item})}/>
                      )
                    }}
                    estimatedItemSize={300}
                  />
                </View>
              }
              {eventsByTag?.length > 0 &&
                <View style={{marginTop: 15}}>
                  <View style={{display: 'flex', flexDirection: 'row', height: 30, alignItems: 'center'}}>
                    <View style={{flex: 1}}>
                      <Text style={{
                        fontFamily: Fonts.bold,
                        fontSize: FontSize.primary,
                        color: Colors.black,
                        marginLeft: 10
                      }}>กิจกรรมที่คุณสนใจ</Text>
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.navigate('EventList', {event: eventsByTag})}
                                      style={{flex: 1, alignItems: 'flex-end'}}>
                      <Text style={{
                        fontFamily: Fonts.bold,
                        fontSize: FontSize.primary,
                        color: Colors.black,
                        marginRight: 10
                      }}>เพิ่มเติม</Text>
                    </TouchableOpacity>
                  </View>
                  <FlashList
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={eventsByTag}
                    refreshing={false}
                    renderItem={({item}) => {
                      return (
                        <EventCards event={item}
                                    onPress={() => props.navigation.navigate('EventDetail', {event: item})}/>
                      )
                    }}
                    estimatedItemSize={300}
                  />
                </View>
              }

              <View style={{display: 'flex', flexDirection: 'row', height: 30, alignItems: 'center', marginTop: 15}}>
                <View style={{flex: 1}}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.primary,
                    color: Colors.black,
                    marginLeft: 10
                  }}>กิจกรรมทั้งหมด</Text>
                </View>
                <TouchableOpacity onPress={() => props.navigation.navigate('EventList', {event: events})}
                                  style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.primary,
                    color: Colors.black,
                    marginRight: 10
                  }}>เพิ่มเติม</Text>
                </TouchableOpacity>
              </View>
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
      </View> :
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{
          fontFamily: Fonts.bold,
          fontSize: FontSize.primary,
          color: Colors.black,
          marginRight: 10
        }}>กำลังโหลดข้อมูลและตรวจสอบสถานที่ของคุณ</Text>
      </View>
  )
}

export default FeedScreen;