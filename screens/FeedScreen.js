import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import storages from "../services/storage/storages";
import {useDispatch, useSelector} from "react-redux";
import {Token} from "../actions/token";
import {getUserInfo} from "../actions/auth";
import {useFocusEffect} from "@react-navigation/native";
import api from "../services/api/api";
import EventCards from "../components/eventCards";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import FontSize from "../constants/FontSize";
import EventCardHorizon from "../components/EventCardHorizon";
import EventIcons from "../components/eventIcons";

const FeedScreen = (props) => {
  const [isLoad, setIsLoad] = useState(true)
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.auth)
  const [allEvent, setAllEvent] = useState(null)
  const [eventAttention, setEventAttention] = useState(null)
  const [eventByTag, setEventByTag] = useState(null)
  const [eventByFollowing, setEventByFollowing] = useState(null)
  const shortcutLists = [{name: 'มาแรง', icon: 'MaterialCommunityIcons', iconName: 'fire'}, {name: 'ความสนใจ', icon: 'Ionicons', iconName: 'pricetag'}, {name:'ใกล้ฉัน', icon: 'MaterialIcons' ,iconName: 'near-me'}, {name: 'กำลังจะเริ่ม', iconName: 'clock', icon: 'MaterialCommunityIcons'}, {name: 'ที่ลงทะเบียน', iconName: 'pencil-box-multiple', icon: 'MaterialCommunityIcons'}, {name: 'กิจกรรมทั้งหมด', icon: 'MaterialIcons', iconName: 'all-inclusive'}]
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log('Refresh')
    setAllEvent(null)
    setEventByTag(null)
    setEventByFollowing(null)
    setEventAttention(null)
    getAllEvent()
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('Feed: Unmount')
      };
    }, [])
  );

  useEffect(() => {
    storages.getData('Token').then(res => {
      if (res === undefined) {
        dispatch(Token(props.route.params.token))
      }
    })
  }, [])

  useEffect(() => {
    console.log('Feed: GetUserInfo')
    checkHasUser()
  }, [])

  useEffect(() => {
    console.log('Feed: GetAllEvent')
    getAllEvent()
  }, [userInfo])

  const getAllEvent = () =>{
      api.getAllEvents().then(res => {
        if (res.status === 200) {
          setAllEvent(res.data.content)
          getEventAttention()
        }
      })
  }

  const checkHasUser = () => {
    dispatch(getUserInfo())
  }

  const getEventAttention = () => {
    api.getEventAttention().then(res => {
      if (res.status === 200) {
        setEventAttention(res.data.content)
        getEventByTag()
      }
    })
  }

  const getEventByTag = () =>{
    api.getEventByTag(userInfo?.tags).then(res => {
      setEventByTag(res.data.content)
      getEventByFollowing()
    },error=>{
      setIsLoad(false)
      setRefreshing(false)
      console.log(error)
    })
  }

  const getEventByFollowing = () =>{
    api.getEventByFollowing({memberId: userInfo.id}).then(res => {
      setEventByFollowing(res.data)
      setTimeout(()=>{
        setIsLoad(false)
        setRefreshing(false)
      },1000)
    },error=>{
      setIsLoad(false)
      setRefreshing(false)
      console.log(error)
    })
  }

  return (!isLoad ?
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <StatusBar
          backgroundColor="transparent"
          translucent={true}
          barStyle={"dark-content"}
        />
        <View style={{
          flex: 1,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          width: '100%',
          height: Platform.OS === 'ios' ? 130 : 120,
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
            position: 'relative',
            top: Platform.OS === 'ios' ? 50 : 40,
            left: 15,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <View style={{flex:1, flexDirection: 'row',   alignItems: 'center'}}>
              <Image
                source={userInfo?.profileUrl ? {uri: userInfo?.profileUrl} : require('../assets/images/profileImage.jpg')}
                style={{
                  marginLeft: 10,
                  height: 70,
                  width: 70,
                  backgroundColor: Colors.gray,
                  borderRadius: 100,
                  borderWidth: 4,
                  borderColor: Colors.white
                }}
              />
              <Text style={{
                fontFamily: Fonts.bold,
                fontSize: FontSize.primary,
                color: Colors.black,
                marginLeft: 10,
              }}>
                {userInfo?.username ?? 'ผู้เยียมชม'}
              </Text>
            </View>

            <View style={{flex:1, alignItems: 'flex-end', marginRight: 40}}>
              <EventIcons source={'Ionicons'} name={'notifications'} size={30} color={Colors.white}/>
            </View>
          </View>
        </View>

        <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 140 : 130}}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            contentContainerStyle={{paddingBottom: 100}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.primary,
                      color: Colors.black,
                      marginLeft: 10
                    }}>กิจกรรมมาแรง</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.primary,
                      color: Colors.black,
                      marginRight: 10
                    }}>เพิ่มเติม</Text>
                  </View>
                </View>
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
            </View>

            {
              userInfo !== null &&
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 50}}>
                <View style={{width: '95%', height: 250,}}>
                  <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {
                      shortcutLists.map(obj => (
                        <View key={obj.name} style={{alignItems: 'center', justifyContent: 'center'}}>
                          <TouchableOpacity style={{
                            width: 70, height: 70, backgroundColor: Colors.white, borderRadius: 100, margin: 20,
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                            <EventIcons source={obj.icon} name={obj.iconName} size={45} color={Colors.primary}/>
                          </TouchableOpacity>
                          <Text style={{
                            fontFamily: Fonts.primary,
                            fontSize: FontSize.small,
                            color: Colors.black,
                          }}>{obj.name}</Text>
                        </View>
                      ))
                    }
                  </View>
                </View>
              </View>
            }

            <View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.primary,
                    color: Colors.black,
                    marginLeft: 10
                  }}>กิจกรรมทั้งหมด</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.primary,
                    color: Colors.black,
                    marginRight: 10
                  }}>เพิ่มเติม</Text>
                </View>
              </View>
              <FlatList
                horizontal={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={allEvent}
                renderItem={({item}) => {
                  return (
                    <EventCards event={item}
                                onPress={() => props.navigation.navigate('EventDetail', {
                                  event: item,
                                  userInfo: userInfo ?? undefined
                                })}/>
                  )
                }}
                estimatedItemSize={320}
              />
            </View>
            {
              eventByTag !== null &&
              <View>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <View style={{flex: 1}}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.primary,
                      color: Colors.black,
                      marginLeft: 10
                    }}>กิจกรรมที่คุณสนใจ</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.primary,
                      color: Colors.black,
                      marginRight: 10
                    }}>เพิ่มเติม</Text>
                  </View>
                </View>
                <FlatList
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={eventByTag}
                  renderItem={({item}) => {
                    return (
                      <EventCards event={item}
                                  onPress={() => props.navigation.navigate('EventDetail', {
                                    event: item,
                                    userInfo: userInfo ?? undefined
                                  })}/>
                    )
                  }}
                  estimatedItemSize={320}
                />
              </View>
            }


            {
              eventByFollowing?.length > 0 &&
              <View>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <View style={{flex: 1}}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.primary,
                      color: Colors.black,
                      marginLeft: 10
                    }}>กิจกรรมที่ของสมาชิกที่คุณติดตาม</Text>
                  </View>
                  <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.primary,
                      color: Colors.black,
                      marginRight: 10
                    }}>เพิ่มเติม</Text>
                  </View>
                </View>
                <FlatList
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={eventByFollowing}
                  renderItem={({item}) => {
                    return (
                      <EventCards event={item}
                                  onPress={() => props.navigation.navigate('EventDetail', {
                                    event: item,
                                    userInfo: userInfo ?? undefined
                                  })}/>
                    )
                  }}
                  estimatedItemSize={320}
                />
              </View>
            }

          </ScrollView>
        </View>

      </View> :
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        zIndex: 50
      }}>
        <View style={{
          width: 200,
          height: 150,
          backgroundColor: Colors.white,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.primary}}>กำลังโหลดข้อมูล</Text>
        </View>
      </View>
  )
}

export default FeedScreen;