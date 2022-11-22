import React, {useEffect, useState} from 'react';
import {
  Animated, FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import api from "../services/api/api";
import Colors from "../constants/Colors";
import fontSize from "../constants/FontSize";
import Fonts from "../constants/Fonts";
import {useNavigation} from "@react-navigation/native";
import EventCards from "../components/eventCards";

const MemberProfileScreen = (props) => {
  const [userInfo, setUserInfo] = useState(null)
  const [event, setEvent] = useState(null)
  const [isFollow, setIsFollow] = useState( null)

  useEffect(() => {
    api.getUserDataById(props.route.params.orgPro).then(res => {
      setUserInfo(res.data)
    })
  }, [])

  useEffect(() => {
      if (userInfo !== null) {
        api.getEventByOrg(userInfo.id).then(res => {
          setEvent(res.data.content)
        })
      }
    }, [userInfo])

  useEffect(()=>{
    checkIsFollow()
  },[])

  const checkIsFollow = () =>{
    api.isFollow({memberId: props.route.params.user, followingId: props.route.params.orgPro}).then(res =>{
      setIsFollow(res.data.isFollow)
    })
  }

  const onFollow = () => {
    api.followMember({memberId: props.route.params.user, followingId: props.route.params.orgPro}).then(res => {
      if (res.status === 200) {
        setTimeout(() => {
          api.getUserDataById(props.route.params.orgPro).then(res => {
            setUserInfo(res.data)
            setTimeout(()=>{
              checkIsFollow()
            },500)
          })
        }, 500)
      }
    })
  }

  const renderUserInfoCard = () => (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={{
        position: 'relative',
        left: 0,
        right: 0,
        top: Platform.OS === 'ios' ? 44 : 0,
        bottom: 0,
        alignItems: 'center'
      }}>
        <View style={{position: 'absolute', top: -60, zIndex: 10}}>
          <Animated.View style={{
            width: 120,
            height: 120,
            borderWidth: 6,
            borderColor: Colors.white,
            borderRadius: 100,
            overflow: 'hidden'
          }}>
            <Image
              style={{width: "100%", height: "100%", resizeMode: 'cover',}}
              source={{uri: userInfo?.profileUrl ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1037860726301282334/user.png'}}
            />
          </Animated.View>
        </View>
        <Animated.View
          style={{
            width: '95%',
            height: 300,
            backgroundColor: Colors.white,
            borderRadius: 25,
          }}>
          <View style={{flex: 1, marginTop: 60, alignItems: 'center'}}>
            <View style={{
              flex: 0.5,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontFamily: Fonts.bold,
                fontSize: fontSize.medium,
                color: Colors.black
              }}>
                {
                  userInfo?.username
                }
              </Text>
            </View>
            <View style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
                <View style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: fontSize.primary,
                      color: Colors.black
                    }}>
                      {
                        userInfo?.numOfFollower
                      }
                    </Text>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: fontSize.small,
                      color: Colors.gray2
                    }}>
                      ผู้ติดตาม
                    </Text>
                  </View>
                </View>
                <View style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: fontSize.primary,
                      color: Colors.black
                    }}>
                      {
                        userInfo?.numOfFollowing
                      }
                    </Text>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: fontSize.small,
                      color: Colors.gray2
                    }}>
                      กำลังติดตาม
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{
              flex: 0.6,
              width: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10
            }}>
              <Text multiline={true}
                    numberOfLines={2}
                    style={{
                      fontFamily: Fonts.primary,
                      fontSize: fontSize.small,
                      color: Colors.black
                    }}>
                {
                  userInfo?.description ?? 'ยังไม่เพิ่มคำบรรยายของคุณ'
                }
              </Text>
            </View>
            <View style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10
            }}>
              <TouchableOpacity
                onPress={() => onFollow()}
                style={{
                  width: '70%',
                  height: 50,
                  backgroundColor: (isFollow ? Colors.red : Colors.primary),
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <Text style={{
                  fontFamily: Fonts.bold,
                  fontSize: fontSize.primary,
                  color: Colors.white
                }}>{isFollow ? 'ยกเลิกติดตาม' : 'ติดตาม'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        {
          renderUserEventCard()
        }
      </View>
    </View>
  )

  const renderUserEventCard = () => (
    <View style={{
      width: '100%',
      position: 'relative',
      left: 0,
      right: 0,
      top: 10,
      bottom: 0,
      alignItems: 'center',
    }}>
      <View
        style={{
          width: '95%',
          height: 300,
          backgroundColor: Colors.white,
          borderRadius: 25,
        }}>
        <View style={{flex: 1, marginTop: 10}}>
          <View style={{padding: 10}}>
            <Text style={{
              fontFamily: Fonts.bold,
              fontSize: fontSize.primary,
              color: Colors.black
            }}>
              {`กิจกรรมของ ${userInfo?.username}`}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft:5, marginRight:5}}>
            {
              event?.length === 0 ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: fontSize.primary,
                    color: Colors.gray2
                  }}>
                    คุณยังไม่มีกิจกรรมที่เข้าร่วม
                  </Text>
                </View>
                :
                <FlatList
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={event}
                  renderItem={({item}) => {
                    return (
                      <EventCards event={item}  size={'small'}
                                  onPress={() => props.navigation.navigate('EventDetail', {event: item, userInfo: userInfo ?? undefined})}/>
                    )
                  }}
                  estimatedItemSize={320}
                />
            }
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <View style={{flex: 1, backgroundColor: Colors.background,}}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"light-content"}
      />
      {
        renderUserInfoCard()
      }
    </View>
  );
};

export default MemberProfileScreen;