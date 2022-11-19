import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Text, View} from "react-native";
import storages from "../services/storage/storages";
import {useDispatch, useSelector} from "react-redux";
import {Token} from "../actions/token";
import {getUserInfo} from "../actions/auth";
import {useFocusEffect} from "@react-navigation/native";
import api from "../services/api/api";
import {FlashList} from "@shopify/flash-list";
import EventCards from "../components/eventCards";

const FeedScreen = (props) => {
  const [isLoad, setIsLoad] = useState(true)
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.auth)
  const [allEvent, setAllEvent] = useState(null)
  useFocusEffect(
    useCallback(() => {
      console.log('Feed: GetUserInfo')
      dispatch(getUserInfo())
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
    dispatch(getUserInfo())
  }, [])

  useEffect(() => {
    console.log('Feed: GetAllEvent')
    api.getAllEvents().then(res => {
      if (res.status === 200) {
        setAllEvent(res.data.content)
        setIsLoad(false)
      }
    })
  }, [])

  return (
    <View>
      {
        !isLoad &&
          <FlashList
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={allEvent}
            refreshing={false}
            renderItem={({item}) => {
              return (
                <EventCards event={item}
                            onPress={() => props.navigation.navigate('EventDetail', {event: item})}/>
              )
            }}
            estimatedItemSize={320}
          />
      //   <ScrollView
      //   contentContainerStyle={{paddingBottom: 220,}}
      //   showsVerticalScrollIndicator={false}
      //   showsHorizontalScrollIndicator={false}
      //   style={{
      //   flex: 1,
      //   paddingTop: 170,
      //   backgroundColor: Colors.white
      // }}>
      //   </ScrollView>
      }
    </View>
    // !isLoad ?
    //   <View
    //     style={{
    //       width: '100%',
    //       height: '100%',
    //       backgroundColor: Colors.white,
    //     }}
    //   >
    //     <StatusBar
    //       backgroundColor="transparent"
    //       translucent={true}
    //       barStyle={"light-content"}
    //     />
    //     <View style={{
    //       flex: 1,
    //     }}
    //     >
    //       <View style={{
    //         flex: 1,
    //         position: 'absolute',
    //         left: 0,
    //         right: 0,
    //         top: 0,
    //         width: '100%',
    //         height: 150,
    //         borderBottomLeftRadius: 25,
    //         borderBottomRightRadius: 25,
    //         backgroundColor: Colors.primary,
    //         shadowColor: "#000",
    //         shadowOffset: {
    //           width: 0,
    //           height: 2,
    //         },
    //         shadowOpacity: 0.25,
    //         shadowRadius: 3.84,
    //         elevation: 5,
    //         zIndex: 50
    //       }}>
    //         <View style={{
    //           flex: 1,
    //           alignContent: 'center',
    //           justifyContent: 'flex-start',
    //           flexDirection: 'row',
    //           marginTop: Platform.OS === 'ios' ? 55 : 45
    //         }}>
    //           <Image
    //             source={userData?.profileUrl ? {uri: userData?.profileUrl} : require('../assets/images/profileImage.jpg')}
    //             style={{
    //               marginLeft: 10,
    //               height: 80,
    //               width: 80,
    //               backgroundColor: Colors.gray,
    //               borderRadius: 100,
    //               borderWidth: 4,
    //               borderColor: Colors.white
    //             }}/>
    //           <View
    //             style={{
    //               backgroundColor: Colors.white,
    //               alignSelf: 'flex-start',
    //               borderRadius: 50,
    //               paddingHorizontal: 8,
    //               marginTop: 24,
    //               marginLeft: 10
    //             }}>
    //             <Text numberOfLines={1} style={{
    //               fontFamily: Fonts.bold,
    //               fontSize: FontSize.primary,
    //               color: Colors.black,
    //             }}>{userData?.username ? userData?.username : "คุณยังไม่ได้เข้าสู้ระบบ"}</Text>
    //           </View>
    //         </View>
    //       </View>
    //       <ScrollView
    //         contentContainerStyle={{paddingBottom: 220,}}
    //         showsVerticalScrollIndicator={false}
    //         showsHorizontalScrollIndicator={false}
    //         style={{
    //           flex: 1,
    //           paddingTop: 170,
    //           backgroundColor: Colors.white
    //         }}>
    //         <View>
    //           <View style={{display: 'flex', flexDirection: 'row', height: 30, alignItems: 'center'}}>
    //             <View style={{flex: 1}}>
    //               <Text style={{
    //                 fontFamily: Fonts.bold,
    //                 fontSize: FontSize.primary,
    //                 color: Colors.black,
    //                 marginLeft: 10
    //               }}>กิจกรรมมาแรง</Text>
    //             </View>
    //             <TouchableOpacity onPress={() => props.navigation.navigate('EventList', {event: eventAttention})}
    //                               style={{flex: 1, alignItems: 'flex-end'}}>
    //               <Text style={{
    //                 fontFamily: Fonts.bold,
    //                 fontSize: FontSize.primary,
    //                 color: Colors.black,
    //                 marginRight: 10
    //               }}>เพิ่มเติม</Text>
    //             </TouchableOpacity>
    //           </View>
    //           <FlatList
    //             data={eventAttention}
    //             renderItem={({item}) => (
    //               <EventCardHorizon item={item} onPress={() => props.navigation.navigate('EventDetail', {
    //                 event: item,
    //                 name: item.eventName
    //               })}/>)}
    //             keyExtractor={(item) => item.id}
    //             showsHorizontalScrollIndicator={false}
    //             horizontal={true}
    //           />
    //
    //           {
    //             eventsNearMe?.length > 0 &&
    //             <View style={{marginTop: 15}}>
    //               <View style={{display: 'flex', flexDirection: 'row', height: 30, alignItems: 'center'}}>
    //                 <View style={{flex: 1}}>
    //                   <Text style={{
    //                     fontFamily: Fonts.bold,
    //                     fontSize: FontSize.primary,
    //                     color: Colors.black,
    //                     marginLeft: 10
    //                   }}>กิจกรรมใกล้ฉัน</Text>
    //                 </View>
    //                 <TouchableOpacity onPress={() => props.navigation.navigate('EventList', {event: eventsNearMe})}
    //                                   style={{flex: 1, alignItems: 'flex-end'}}>
    //                   <Text style={{
    //                     fontFamily: Fonts.bold,
    //                     fontSize: FontSize.primary,
    //                     color: Colors.black,
    //                     marginRight: 10
    //                   }}>เพิ่มเติม</Text>
    //                 </TouchableOpacity>
    //               </View>
    //               <FlashList
    //                 horizontal={true}
    //                 showsVerticalScrollIndicator={false}
    //                 showsHorizontalScrollIndicator={false}
    //                 data={eventsNearMe}
    //                 refreshing={false}
    //                 renderItem={({item}) => {
    //                   return (
    //                     <EventCards event={item}
    //                                 onPress={() => props.navigation.navigate('EventDetail', {event: item})}/>
    //                   )
    //                 }}
    //                 estimatedItemSize={300}
    //               />
    //             </View>
    //           }
    //           {eventsByTag?.length > 0 &&
    //             <View style={{marginTop: 15}}>
    //               <View style={{display: 'flex', flexDirection: 'row', height: 30, alignItems: 'center'}}>
    //                 <View style={{flex: 1}}>
    //                   <Text style={{
    //                     fontFamily: Fonts.bold,
    //                     fontSize: FontSize.primary,
    //                     color: Colors.black,
    //                     marginLeft: 10
    //                   }}>กิจกรรมที่คุณสนใจ</Text>
    //                 </View>
    //                 <TouchableOpacity onPress={() => props.navigation.navigate('EventList', {event: eventsByTag})}
    //                                   style={{flex: 1, alignItems: 'flex-end'}}>
    //                   <Text style={{
    //                     fontFamily: Fonts.bold,
    //                     fontSize: FontSize.primary,
    //                     color: Colors.black,
    //                     marginRight: 10
    //                   }}>เพิ่มเติม</Text>
    //                 </TouchableOpacity>
    //               </View>
    //               <FlashList
    //                 horizontal={true}
    //                 showsVerticalScrollIndicator={false}
    //                 showsHorizontalScrollIndicator={false}
    //                 data={eventsByTag}
    //                 refreshing={false}
    //                 renderItem={({item}) => {
    //                   return (
    //                     <EventCards event={item}
    //                                 onPress={() => props.navigation.navigate('EventDetail', {event: item})}/>
    //                   )
    //                 }}
    //                 estimatedItemSize={300}
    //               />
    //             </View>
    //           }
    //
    //           <View style={{display: 'flex', flexDirection: 'row', height: 30, alignItems: 'center', marginTop: 15}}>
    //             <View style={{flex: 1}}>
    //               <Text style={{
    //                 fontFamily: Fonts.bold,
    //                 fontSize: FontSize.primary,
    //                 color: Colors.black,
    //                 marginLeft: 10
    //               }}>กิจกรรมทั้งหมด</Text>
    //             </View>
    //             <TouchableOpacity onPress={() => props.navigation.navigate('EventList', {event: events})}
    //                               style={{flex: 1, alignItems: 'flex-end'}}>
    //               <Text style={{
    //                 fontFamily: Fonts.bold,
    //                 fontSize: FontSize.primary,
    //                 color: Colors.black,
    //                 marginRight: 10
    //               }}>เพิ่มเติม</Text>
    //             </TouchableOpacity>
    //           </View>
    //           <FlashList
    //             horizontal={true}
    //             showsVerticalScrollIndicator={false}
    //             showsHorizontalScrollIndicator={false}
    //             data={events}
    //             refreshing={false}
    //             renderItem={({item}) => {
    //               return (
    //                 <EventCards event={item} onPress={() => props.navigation.navigate('EventDetail', {event: item})}/>
    //               )
    //             }}
    //             estimatedItemSize={300}
    //           />
    //         </View>
    //       </ScrollView>
    //     </View>
    //   </View> :
    //   <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //     <Text style={{
    //       fontFamily: Fonts.bold,
    //       fontSize: FontSize.primary,
    //       color: Colors.black,
    //       marginRight: 10
    //     }}>กำลังโหลดข้อมูลและตรวจสอบสถานที่ของคุณ</Text>
    //   </View>
  )
}

export default FeedScreen;