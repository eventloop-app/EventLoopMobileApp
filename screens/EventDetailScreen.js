import React, {createRef, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Keyboard,
  Animated,
  Platform
} from "react-native";
import Colors from "../constants/Colors";
import EventIcons from "../components/eventIcons";
import api from "../services/api/api";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import moment from "moment/moment";
import Mappin from "../assets/images/pin.png";
import MapView, { Marker} from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import fontSize from "../constants/FontSize";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {getUserInfo} from "../actions/auth";

const weekdays = 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_')

const EventDetailScreen = (props) => {
  const {userInfo} = useSelector(state => state.auth)
  const [eventInfo, setEventinfo] = useState(null)
  const [showModelReport, setShowModelReport] = useState(false)
  const [showModelConfirm, setShowModelConfirm] = useState(false)
  const [showModelCheckIn, setShowModelCheckIn] = useState(false)
  const [showModelReview, setShowModelReview] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [isCheckIn, setIsCheckIn] = useState(false)
  const [isReview, setIsReview] = useState(false)
  const [codeCheckIn, setCodeCheckIn] = useState(null)
  const [reviewMsg, setReviewMsg] = useState("")
  const [reportMsg, setReportMsg] = useState("")
  const navigation = useNavigation();
  const mapRef = createRef();
  const dispatch = useDispatch();
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const [isLoad, setIsLoad] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);


  useEffect(() => {
    checkHasUser()
  }, [])

  useEffect(()=>{
    api.getEventById(props.route.params.event.id).then(res =>{
      if(res.status === 200){
        setEventinfo(res.data)
        setTimeout(()=>{
          setIsLoad(false)
        },500)
      }else{
        navigation.navigate('Error')
      }
    }, error => {
      console.log(error)
      setIsError(true)
      setTimeout(()=>{
        navigation.goBack()
      },1000)
    })
  }, [])

  useEffect(()=>{
    if(props.route.params?.QRcode !== undefined && props.route.params?.QRcode !== null){
      setCodeCheckIn(props.route.params?.QRcode)
    }
  },[props])

  useEffect(() => {
    if (userInfo !== null && eventInfo !== null) {
      checkRegisterEvent()
    }
  }, [eventInfo])

  useEffect(()=>{
    if(!isLoad){
      setTimeout(()=>{
        mapRef?.current?.animateToRegion({
          latitude: parseFloat(eventInfo?.location?.latitude),
          longitude: parseFloat(eventInfo?.location?.longitude),
          latitudeDelta: 0.00116193304764995,
          longitudeDelta: 0.001165230321884155
        })
      },500)
    }
  },[isLoad])

  const getIsCheckIn = () =>{
    let data = {
      memberId: userInfo?.id,
      eventId: eventInfo?.id
    }
    api.isCheckIn(data).then(res =>{
      console.log("Is CheckIn")
      console.log(res.data.isCheckIn)
      setIsCheckIn(res.data.isCheckIn)
    })
  }

  const getIsReview = () =>{
    let data = {
      memberId: userInfo?.id,
      eventId: eventInfo?.id
    }
    api.isReview(data).then(res =>{
      console.log("Is Review")
      console.log(res.data.isReview)
      setIsReview(res.data.isReview)
    })
  }

  const checkRegisterEvent = () => {
    let data = {
      eventId: props.route.params?.event.id,
      memberId: userInfo?.id,
    }
    api.isRegisterEvent(data).then(res => {
      if (res.status === 200) {
        console.log("CheckIsRegister")
        setIsRegister(res.data.isRegister)
        console.log(res.data.isRegister)
        getIsCheckIn()
        getIsReview()
      }
    },error => {
      console.log(error)
      setIsError(true)
      setTimeout(()=>{
        navigation.goBack()
      },1000)
    })
  }

  const checkHasUser = () => {
    dispatch(getUserInfo)
  }

  const submitReport = () => {
    let data = {
      eventId: eventInfo?.id,
      memberId: userInfo?.id,
      type: "กิจกรรมไม่ตรงตามที่แจ้ง",
      description: reportMsg
    }
    api.reportEvent(data).then(res => {
      if(res.status === 200){
        setShowModelReport(false)
      }
    })
  }

  const submitRegisterEvent = () => {
    let data = {
      eventId: eventInfo?.id,
      memberId: userInfo?.id,
    }

    if (isRegister) {
      api.unRegisterEvent(data).then(res => {
        if (res.status === 200) {
          console.log('Unregister Success!')
          setShowModelConfirm(false)
          setIsRegister(false)
        }
      }, error => {
        console.warn(error)
      })
    } else {
      api.registerEvent(data).then(res => {
        if (res.status === 200) {
          console.log('Register Success!')
          setShowModelConfirm(false)
          setIsRegister(true)
        }
      }, error => {
        console.log(error)
        setIsError(true)
        setTimeout(()=>{
          navigation.goBack()
        },1000)
      })
    }
  }

  const modelReport = () => (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.25)',
      zIndex: 50,
    }}>
      <Animated.View style={{
        position: 'relative',
        width: 300,
        height: 250,
        backgroundColor: Colors.white,
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        transform: [{translateY: Platform.OS === 'ios' ? keyboardStatus ? -80 : 0 : 0}]
      }}>
        <View>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium, textAlign: 'center'}}>รายงานกิจกรรม</Text>
          <TextInput multiline={true} maxLength={100} defaultValue={reportMsg} onChangeText={(text) => {
            console.log(text.length)
              setReportMsg(text)
          }} placeholder={'ระบุสาเหตุของการรายงานกิจกรรมนี้'}
                     style={{marginTop:10, fontFamily: Fonts.bold, fontSize: fontSize.primary}}/>
        </View>
        <View style={{position: 'absolute',bottom: 75, right: 20}}>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.vary_small, color: Colors.gray2}}>{`${reportMsg.length}/100`}</Text>
        </View>
        <View style={{position: 'absolute',bottom: -35, flexDirection: 'row'}}>
          <TouchableOpacity style={{position: 'relative', bottom: 50, margin: 10}}
                            onPress={() => {
                              setReportMsg("")
                              setShowModelReport(!showModelReport)
                            }}>
            <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.red}}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{position: 'relative', bottom: 50, marginLeft: 30, marginTop: 10}} onPress={() => submitReport()}>
            <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color:(reportMsg.length > 20 ? Colors.primary :  Colors.gray2)}}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

    </View>
  )
  const modelConfirm = () => (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.25)',
      zIndex: 50
    }}>
      <View style={{
        width: isRegister ? 320 : 270,
        height: 150,
        backgroundColor: Colors.white,
        borderRadius: 15,
        // justifyContent: 'center',
        alignItems: 'center'
      }}>
        {
          isError ? <Text style={{
            marginTop: 50,
            fontFamily: Fonts.bold,
            fontSize: FontSize.medium
          }}>มีบางอย่างผิดพลาด</Text> : <Text style={{
            marginTop: 50,
            fontFamily: Fonts.bold,
            fontSize: FontSize.medium
          }}>{isRegister ? 'ยืนยันการยกเลิกเข้าร่วมกิจกรรม' : 'ยืนยันการเข้าร่วมกิจกรรม'}</Text>
        }

      </View>
      {
        !isError &&
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{position: 'relative', bottom: 50,margin: 10 }}
                            onPress={() => setShowModelConfirm(!showModelConfirm)}>
            <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.red}}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{position: 'relative', bottom: 50, marginLeft: 30, marginTop: 10}} onPress={() => submitRegisterEvent()}>
            <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.primary}}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      }

    </View>
  )

  const submitCheckIn = () => {
    let data = {
      checkInCode: codeCheckIn,
      memberId: userInfo?.id,
      eventId: eventInfo?.id
    }

    api.checkIn(data).then(res => {
      if(res.status === 200){
        setShowModelCheckIn(false)
        setIsCheckIn(true)
      }
    },error=>{
      console.log(error)
    })
  }

  const submitReview = () => {
    let data = {
      memberId: userInfo?.id,
      eventId: eventInfo?.id,
      score : 5,
      feedback : reviewMsg
    }
    api.reviewEvent(data).then(res => {
      console.log(res.status)
      if(res.status === 200){
        setShowModelReview(false)
        setIsReview(true)
      }
    })
  }

  const modelCheckIn = () => (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.25)',
      zIndex: 50
    }}>
      <View style={{
        width: 300,
        height: 250,
        backgroundColor: Colors.white,
        borderRadius: 15,
        padding: 10,
        alignItems: 'center'

      }}>
        <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium}}>เช็คอินกิจกรรม</Text>
        <View style={{flex: 1, justifyContent: 'center', marginTop: -30}}>
          <TextInput defaultValue={codeCheckIn} keyboardType={'number-pad'} maxLength={6} multiline={true} placeholder={'กรอกรหัสเช็คอินกิจกรรม'}
                     style={{fontFamily: Fonts.bold, fontSize: fontSize.big, textAlign: 'center'}} onChangeText={(text) => setCodeCheckIn(text)}/>
        </View>

        <TouchableOpacity style={{position: 'relative', bottom: 50, margin: 10}} onPress={() => props.navigation.navigate('Scanner')}>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.green}}>สแกนคิวอาร์โค้ด</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{position: 'relative', bottom: 50, margin: 10}}
                          onPress={() => setShowModelCheckIn(!showModelCheckIn)}>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.red}}>ยกเลิก</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{position: 'relative', bottom: 50, marginLeft: 30, marginTop: 10}} onPress={() => submitCheckIn()}>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.primary}}>ยืนยัน</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const modelReview = () => (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.25)',
      zIndex: 50
    }}>
      <Animated.View style={{
        width: 300,
        height: 250,
        backgroundColor: Colors.white,
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        transform: [{translateY: Platform.OS === 'ios' ? keyboardStatus ? -80 : 0 : 0}]
      }}>
        <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium}}>รีวิวกิจกรรม</Text>
        <View style={{flex: 1, marginTop: 10}}>
          <TextInput defaultValue={reviewMsg} multiline={true} maxLength={100} onChangeText={(text)=> setReviewMsg(text)} placeholder={'บอกความรู้สึกที่ได้เข้าร่วมกิจกรรม'}
                     style={{fontFamily: Fonts.bold, fontSize: fontSize.primary, textAlign: 'left'}}/>
        </View>
        <View style={{position: 'absolute',bottom: 75, right: 20}}>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.vary_small, color: Colors.gray2}}>{`${reviewMsg.length}/100`}</Text>
        </View>
        <View style={{position: 'absolute',bottom: -35, flexDirection: 'row'}}>
          <TouchableOpacity style={{position: 'relative', bottom: 50, margin: 10}}
                            onPress={() => {
                              setReviewMsg("")
                              setShowModelReview(!showModelReview)
                            }}>
            <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.red}}>ยกเลิก</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{position: 'relative', bottom: 50, marginLeft: 30, marginTop: 10}} onPress={() => submitReview()}>
            <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.primary}}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )

  const renderButton = () => {
    switch (userInfo?.role) {
      case 'MEMBER':
        return (
          (userInfo?.id !== eventInfo?.organizerId && isRegister === false) ?
            <View>
              <TouchableOpacity disabled={eventInfo?.numberOfRegister === eventInfo?.numberOfPeople} style={{justifyContent: 'center', alignItems: 'center', marginBottom: 20}}
                                activeOpacity={0.8} onPress={() => setShowModelConfirm(true)}>
                <View style={{
                  width: "89%",
                  height: 60,
                  backgroundColor: isRegister ? Colors.orange : (eventInfo?.numberOfRegister === eventInfo?.numberOfPeople ? Colors.gray2 : Colors.primary),
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.primary,
                    color: Colors.white
                  }}>{isRegister ? 'ยกเลิกเข้าร่วมกิจกรรม' : 'เข้าร่วมกิจกรรม'}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} activeOpacity={0.8}
                                onPress={() => setShowModelReport(true)}>
                <View style={{
                  width: "89%",
                  height: 60,
                  backgroundColor: Colors.yellow,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.primary,
                    color: Colors.white
                  }}>รายงานกิจกรรม</Text>
                </View>
              </TouchableOpacity>
            </View> :
            ((isRegister && !isReview) &&
              <View>
                <TouchableOpacity disabled={(eventInfo?.numberOfRegister === eventInfo?.numberOfPeople || moment().unix() * 1000 > eventInfo.startDate)} style={{justifyContent: 'center', alignItems: 'center', marginBottom: 20}}
                                  activeOpacity={0.8} onPress={() => setShowModelConfirm(true)}>
                  <View style={{
                    width: "89%",
                    height: 60,
                    backgroundColor: isRegister ? (moment().unix() * 1000 > eventInfo.startDate ? Colors.gray2 : Colors.orange) : (eventInfo?.numberOfRegister === eventInfo?.numberOfPeople ? Colors.gray2 : Colors.primary),
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.primary,
                      color: Colors.white
                    }}>{isRegister ? 'ยกเลิกเข้าร่วมกิจกรรม' : 'เข้าร่วมกิจกรรม'}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={moment().unix() * 1000 < eventInfo.startDate}
                  style={{justifyContent: 'center', alignItems: 'center', marginBottom: 20}}
                  activeOpacity={0.8} onPress={() => isCheckIn ? setShowModelReview(true) : setShowModelCheckIn(true)}
                >
                  <View style={{
                    width: "89%",
                    height: 60,
                    backgroundColor: (moment().unix() * 1000 < eventInfo.startDate ? Colors.gray2 : Colors.primary),
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.primary,
                      color: Colors.white
                    }}>{isCheckIn ? 'รีวิวกิจกรรม': 'เช็คอิน'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
        )
      default:
        return (
          <TouchableOpacity disabled={true} style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{
              width: "90%",
              height: 60,
              backgroundColor: Colors.gray,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: Fonts.bold,
                fontSize: FontSize.primary,
                color: Colors.white
              }}>คุณยังไม่ได้เข้าสู่ระบบ</Text>
            </View>
          </TouchableOpacity>
        )
    }
  }

  return (
    !isLoad ?
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      {
        showModelReport && modelReport()
      }

      {
        showModelConfirm && modelConfirm()
      }

      {
        showModelCheckIn && modelCheckIn()
      }

      {
        showModelReview && modelReview()
      }
      <View style={{width: '100%', height: 250}}>
        <Image style={{width: '100%', height: '100%'}}
               source={{uri: (eventInfo?.coverImageUrl ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1034872227377717278/no-image-available-icon-6.png')}}
        />
      </View>
      {/*{*/}
      {/*  userInfo &&*/}
      {/*  <View style={{position: 'absolute', top: 180, right: 20, zIndex: 60}}>*/}
      {/*    <TouchableOpacity*/}
      {/*      style={{*/}
      {/*        display: 'flex',*/}
      {/*        borderRadius: 100,*/}
      {/*        backgroundColor: 'rgba(255,255,255,0.9)',*/}
      {/*        width: 40,*/}
      {/*        height: 40,*/}
      {/*        justifyContent: 'center',*/}
      {/*        alignItems: 'center'*/}
      {/*      }}*/}
      {/*      onPress={() => {*/}
      {/*        let indexOfBookMark = bookMark?.findIndex(bk => bk.id === eventInfo?.id)*/}
      {/*        api.stampBookMark({eventId: eventInfo?.id, memberId: userInfo?.id}).then(res => {*/}
      {/*          if (res.status === 200) {*/}
      {/*            if (indexOfBookMark >= 0) {*/}
      {/*              console.log("UnBookMark")*/}
      {/*              const newBookMark = bookMark.filter((bk, index) => index !== indexOfBookMark)*/}
      {/*              setBookMark(newBookMark)*/}
      {/*            } else {*/}
      {/*              console.log("SetBookMark")*/}
      {/*              setBookMark([...bookMark, eventInfo])*/}
      {/*            }*/}
      {/*          }else{*/}
      {/*            console.log(`can't set bookmark`)*/}
      {/*          }*/}
      {/*        }, error => {*/}
      {/*          console.log(error)*/}
      {/*        })*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Ionicons*/}
      {/*        name={bookMark?.findIndex(bk => bk.id === eventInfo?.id) >= 0 ? "ios-heart-sharp" : "ios-heart-outline"}*/}
      {/*        size={35} color={Colors.red}/>*/}
      {/*    </TouchableOpacity>*/}
      {/*  </View>*/}
      {/*}*/}

      <View style={{
        position: 'relative',
        top: -20,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignContent: 'center',
      }}>
        <View style={{
          width: "100%",
          height: "100%",
          backgroundColor: Colors.white,
          borderTopLeftRadius: 15,
          borderTopEndRadius: 15,
        }}>
          <ScrollView
            contentContainerStyle={{paddingBottom: 300}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>

            <View style={{margin: 10}}>
              <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.big}}>
                {
                  eventInfo?.eventName
                }
              </Text>
            </View>

            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.medium
                }}>
                แท็ก
              </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {
                  eventInfo?.tags.map((tag, index) => (
                    <View
                      key={index}
                      style={{justifyContent: 'center', alignContent: 'center'}}
                    >
                      <View style={{
                        flexDirection: "row",
                        backgroundColor: Colors.primary,
                        borderRadius: 8,
                        padding: 4,
                        paddingHorizontal: 8,
                        marginHorizontal: 2,
                      }}>
                        <Text style={{
                          fontFamily: Fonts.primary,
                          fontSize: FontSize.small,
                          color: Colors.white
                        }}>
                          {
                            tag
                          }
                        </Text>
                      </View>
                    </View>
                  ))
                }
              </View>
            </View>

            {/*<View style={{width: '100%', height: 30, justifyContent: 'center', alignItems: 'center'}}>*/}
            {/*  <View style={{borderWidth: 1, width: "90%", borderColor: Colors.gray2}}></View>*/}
            {/*</View>*/}

            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 10}}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                backgroundColor: 'rgba(214, 234, 248, 0.5)',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <EventIcons source={'Ionicons'} name={'ios-home-outline'} size={35} color={Colors.primary}/>
              </View>
              <View style={{flexDirection: 'row', marginLeft: 10}}>
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: Colors.primary,
                    borderRadius: 8,
                    padding: 4,
                    paddingHorizontal: 8,
                    marginHorizontal: 2,
                    margin: 5
                  }}
                >
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                    color: Colors.white
                  }}>
                    {
                      eventInfo?.type
                    }
                  </Text>
                </View>
              </View>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 5}}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                backgroundColor: 'rgba(214, 234, 248, 0.5)',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <EventIcons source={'Ionicons'} name={'calendar-sharp'} size={35} color={Colors.primary}/>
              </View>
              <View
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 10, marginTop: 5}}>
                <Text style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.primary
                }}>{moment(eventInfo?.startDate).add(543, 'year').format('D MMMM YYYY')}</Text>
                <Text style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.small
                }}>{weekdays[(moment(eventInfo?.startDate).day())] + ' ' + moment(eventInfo?.startDate).format("HH:mm A") + ' - ' + moment(eventInfo?.endDate).format("HH:mm A")}</Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', height: 50, marginLeft: 10, marginTop: 5}}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                backgroundColor: 'rgba(214, 234, 248, 0.5)',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <EventIcons source={'Ionicons'}
                            name={eventInfo?.type === 'ONSITE' ? 'ios-location-outline' : 'laptop-outline'}
                            size={35}
                            color={Colors.primary}/>
              </View>
              <View style={{height: 50, marginLeft: 10, justifyContent: 'center', width: "80%"}}>
                <Text numberOfLines={1} style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.small
                }}>
                  {
                    (eventInfo?.location?.name ?? "ไม่มีข้อมูล")
                  }
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', height: 50, marginLeft: 10, marginTop: 5}}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                backgroundColor: 'rgba(214, 234, 248, 0.5)',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <EventIcons source={'Ionicons'}
                            name={'ios-person-sharp'}
                            size={35}
                            color={Colors.primary}/>
              </View>
              <View style={{height: 50, marginLeft: 10, justifyContent: 'center', width: "80%"}}>
                <Text numberOfLines={1} style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.primary,
                  color: (eventInfo?.numberOfRegister === eventInfo?.numberOfPeople ? Colors.red : Colors.black)
                }}>
                  {
                    `${eventInfo?.numberOfRegister} / ${eventInfo?.numberOfPeople}`
                  }
                </Text>
              </View>
            </View>
            {
              ((eventInfo?.type === "ONSITE" && eventInfo?.location) &&
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 10}}>
                  <MapView
                    scrollDuringRotateOrZoomEnabled={false}
                    zoomControlEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    showsTraffic={true}
                    scrollEnabled={false}
                    provider={"google"}
                    ref={mapRef}
                    followsUserLocation={true}
                    initialRegion={{
                      latitude: parseFloat(eventInfo?.location?.latitude),
                      longitude: parseFloat(eventInfo?.location?.longitude),
                      latitudeDelta: 0.0016193304764995,
                      longitudeDelta: 0.00165230321884155
                    }}
                    style={{
                      borderRadius: 15,
                      width: Dimensions.get("window").width - 30,
                      height: Dimensions.get("window").height / 5
                    }}>
                    <Marker
                      image={Mappin}
                      coordinate={{
                        latitude: parseFloat(eventInfo?.location?.latitude),
                        longitude: parseFloat(eventInfo?.location?.longitude)
                      }}/>
                  </MapView>
                </View>
              )
            }
            <View style={{marginLeft:10}}>
              <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium}}>
                รายละเอียดกิจกรรม
              </Text>
              <View style={{marginTop: 5, marginLeft:10}}>
                <Text
                  style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                    textAlign: 'left'
                  }}>
                  {eventInfo?.description}
                </Text>
              </View>
            </View>
            <View style={{marginLeft: 10, marginTop: 10, marginBottom: 10}}>
              <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium}}>
                กิจกรรมนี้จัดโดย
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 10}}>
                <TouchableOpacity disabled={(userInfo === null || userInfo.id === eventInfo.organizerId)} onPress={()=> navigation.navigate('MemberProfile', {orgPro: eventInfo.organizerId, user: userInfo.id})} style={{flexDirection: 'row', justifyContent: 'center', alignItems:"center"}}>
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: 'rgba(214, 234, 248, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                  }}>
                    <Image style={{width: '100%', height: '100%'}}
                           source={{
                             uri: eventInfo?.profileUrl
                           }}
                    />
                  </View>
                  <View style={{marginLeft: 10}}>
                    <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                      <Text style={{
                        fontFamily: Fonts.bold,
                        fontSize: FontSize.small,
                        color: Colors.black
                      }}>{eventInfo?.username}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 10}}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <EventIcons source={'Ionicons'} name={'mail-open-outline'} color={Colors.primary} size={35}/>
                </View>
                <View style={{marginLeft: 10}}>
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.small,
                      color: Colors.black
                    }}>{eventInfo?.email.toLowerCase()}</Text>
                  </View>
                </View>
              </View>
            </View>
            {
              renderButton()
            }
            {
              isReview &&
              <View style={{ alignItems: 'center', marginTop: 10}}>
              <Text  style={{
                fontFamily: Fonts.bold,
                fontSize: FontSize.big
              }}>สิ้นสุดกิจกรรม</Text>
              </View>
            }
          </ScrollView>
        </View>
      </View>
    </View>:
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
          <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.primary}}>{isError ? 'มีบางอย่างผิดพลาด': 'กำลังโหลดข้อมูล'}</Text>
        </View>
      </View>
  );
};

export default EventDetailScreen;