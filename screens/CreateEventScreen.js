import React, {useEffect, useRef, useState} from 'react';
import {Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import eventTagLists from "../constants/EventTagLists";
import FontSize from "../constants/FontSize";
import EventIcons from "../components/eventIcons";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import storages from "../services/storage/storages";
import api from "../services/api/api";
import FormData from "form-data";
import * as ImagePicker from "expo-image-picker";
import fontSize from "../constants/FontSize";

const weekdays = 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_')

const CreateEventScreen = (props) => {
  const input_num = useRef()
  const [userData, setUserData] = useState(null)
  const [eventData, setEventData] = useState(
    {
      eventName: null,
      description: null,
      type: "ONLINE",
      startDate: new Date().getTime(),
      endDate: new Date().getTime(),
      memberId: null,
      location: null,
      latitude: "-1",
      longitude: "-1",
      numberOfPeople: 0,
      tags: [],
    }
  )
  const [dateStatus, setDateStatus] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [showLoad, setShowLoad] = useState(false)

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (props.route.params?.map !== undefined && props.route.params?.map !== null) {
        setEventData({...eventData, location: null})
        setTimeout(() => {
          setEventData({
            ...eventData,
            location: props.route.params.map.name,
            latitude: props.route.params.map.lat,
            longitude: props.route.params.map.lng
          })
        }, 200)
      }
    });
    return unsubscribe;
  }, [props]);

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     checkHasUser()
  //   });
  //   return unsubscribe;
  // }, [props.navigation]);

  useEffect(() => {
    checkHasUser()
  }, [])

  const checkHasUser = () => {
    storages.getUserData().then(res => {
      api.getUserDataById(res?.memberId).then(user => {
        if (user.status === 200) {
          setUserData(user.data)
          setEventData({...eventData, memberId: user.data.id})
        }
      }).catch(error => {
        setUserData(null)
        setEventData({...eventData, memberId: null})
        console.log("GET USER")
        console.log(error)
      })
    })
  }

  const onChangeStartDate = (date) => {
    setEventData({...eventData, startDate: date.getTime()})
  }

  const onChangeEndDate = (date) => {
    setEventData({...eventData, endDate: date.getTime()})
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setCoverImage(result.uri)
    }
  };

  const renderSelectDataIOS = () => (
    <View style={{
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 60
    }}>
      <View
        style={{
          borderRadius: 15,
          height: 280,
          width: "90%",
          backgroundColor: Colors.white
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontFamily: Fonts.bold,
            fontSize: FontSize.medium,
            paddingTop: 20
          }}>
          {dateStatus ? 'เวลาสิ้นสุดกิจกรรม' : 'เวลาเริ่มกิจกรรม'}
        </Text>
        <View style={{marginTop: 30}}>
          <RNDateTimePicker
            minimumDate={dateStatus ? new Date(new Date(eventData.startDate).setHours(new Date(eventData.startDate).getHours() + 1)) : new Date(new Date(new Date().setDate(new Date().getDate() + 0)).setHours(0, 0, 0, 0))}
            mode={dateStatus ? "time" : "datetime"}
            value={dateStatus ? new Date(eventData.endDate) : new Date(eventData.startDate)}
            style={{height: 100, fontFamily: Fonts.primary}}
            locale={'th'}
            display="spinner"
            onChange={(event, date) => dateStatus ? onChangeEndDate(date) : onChangeStartDate(date)}
          />
        </View>
        <TouchableOpacity onPress={() => setDateStatus(dateStatus ? null : true)}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: Fonts.bold,
                fontSize: FontSize.medium,
                color: Colors.primary,
                paddingTop: 20
              }}>
              {dateStatus ? 'ตกลก' : 'ต่อไป'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )

  const onCheckForm = () =>{
    return (eventData.eventName?.length > 3 && eventData.tags.length > 0 && eventData.numberOfPeople >= 2 && eventData.location?.length > 3 && eventData.description?.length > 20)
  }

  const renderForm = () => (
    <View style={{flex: 1}}>
      <View style={{width: '100%', height: 250}}>
        {
          coverImage ?
            <TouchableOpacity onPress={() => pickImage()}
                              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{width: '100%', height: '100%'}}
                     source={{
                       uri: (coverImage)
                     }}
              />
            </TouchableOpacity>
            : <TouchableOpacity onPress={() => pickImage()}
                                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{backgroundColor: 'rgba(255,255,255,0.7)', padding: 10, borderRadius: 100}}>
                <EventIcons source={'Ionicons'} name={'image-outline'} size={60} color={Colors.black}/>
              </View>
            </TouchableOpacity>
        }
      </View>

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
          <KeyboardAwareScrollView
            enableAutomaticScroll={true}
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === 'ios' ? 180 : 220}>
            <ScrollView
              contentContainerStyle={{paddingBottom: 300}}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <View style={{margin: 10}}>
                <TextInput
                  defaultValue={eventData.eventName}
                  style={{fontFamily: Fonts.bold, fontSize: FontSize.large, height: 50}}
                  multiline={false}
                  placeholder={"ใส่ชื่อกิจกรรม"}
                  placeholderTextColor={Colors.gray2}
                  onChangeText={(input) => setEventData({...eventData, eventName: input})}
                />
              </View>

              <View style={{margin: 10}}>
                <Text
                  style={{
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.medium
                  }}>
                  แท็ก
                </Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {
                    eventTagLists.map((tag, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{justifyContent: 'center', alignContent: 'center'}}
                        onPress={() => {
                          const indexOfItem = eventData.tags.findIndex(userTag => userTag === tag.title)
                          if (indexOfItem >= 0) {
                            let newTags = eventData.tags.filter(userTag => userTag != tag.title)
                            setEventData({...eventData, tags: newTags})
                          } else {
                            setEventData({...eventData, tags: [...eventData.tags, tag.title]})
                          }
                        }}
                      >
                        <View style={{
                          flexDirection: "row",
                          backgroundColor: (eventData.tags.findIndex(userTag => userTag === tag.title) >= 0 ? Colors.primary : Colors.gray2),
                          borderRadius: 8,
                          padding: 4,
                          paddingHorizontal: 8,
                          marginHorizontal: 2,
                          margin: 5
                        }}>
                          <Text style={{
                            fontFamily: Fonts.primary,
                            fontSize: FontSize.small,
                            color: Colors.white
                          }}>
                            {
                              tag.title
                            }
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  }
                </View>
                <Text
                  style={{
                    marginTop: 5,
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.vary_small,
                    color: Colors.yellow
                  }}>ต้องเลือกอย่างน้อย 1 แท็ก
                </Text>
              </View>

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 10}}>
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
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      backgroundColor: (eventData.type === 'ONLINE' ? Colors.primary : Colors.gray2),
                      borderRadius: 8,
                      padding: 4,
                      paddingHorizontal: 8,
                      marginHorizontal: 2,
                      margin: 5
                    }}
                    onPress={() => {
                      setEventData({...eventData, type: 'ONLINE', latitude: '-1', longitude: '-1'})
                    }}
                  >
                    <Text style={{
                      fontFamily: Fonts.primary,
                      fontSize: FontSize.small,
                      color: Colors.white
                    }}>
                      ออนไลน์
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      backgroundColor: (eventData.type === 'ONSITE' ? Colors.primary : Colors.gray2),
                      borderRadius: 8,
                      padding: 4,
                      paddingHorizontal: 8,
                      marginHorizontal: 2,
                      margin: 5
                    }}
                    onPress={() => {
                      setEventData({...eventData, type: 'ONSITE'})
                    }}
                  >
                    <Text style={{
                      fontFamily: Fonts.primary,
                      fontSize: FontSize.small,
                      color: Colors.white
                    }}>
                      ออนไซต์
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 10}}>
                <TouchableOpacity onPress={() => setDateStatus(false)} style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <EventIcons source={'Ionicons'} name={'calendar-sharp'} size={35} color={Colors.primary}/>
                </TouchableOpacity>
                <View
                  style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginLeft: 20}}>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.primary
                  }}>{moment(eventData.startDate).add(543, 'year').format('D MMMM YYYY')}</Text>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small
                  }}>{weekdays[(moment(eventData.startDate).day())] + ' ' + moment(eventData.startDate).format("HH:mm A") + ' - ' + moment(eventData.endDate).format("HH:mm A")}</Text>
                </View>
              </View>

              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 10}}>
                <TouchableOpacity onPress={() => input_num.current.focus()} style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <EventIcons source={'Ionicons'} name={'people-sharp'} size={35} color={Colors.primary}/>
                </TouchableOpacity>
                <View style={{flexDirection: 'column', marginLeft: 20}}>
                  <Text style={{
                    fontFamily: Fonts.primary,
                    fontSize: FontSize.small,
                    color: Colors.black
                  }}>จำนวนผู้เข้าร่วมกิจกรรม</Text>
                  <TextInput
                    keyboardType={'number-pad'}
                    maxLength={2}
                    ref={input_num}
                    defaultValue={eventData.numberOfPeople}
                    placeholder={'0'}
                    style={{
                      fontFamily: Fonts.primary,
                      fontSize: FontSize.small,
                      color: Colors.black
                    }}
                    onChangeText={(text) => setEventData({...eventData, numberOfPeople: parseInt(text)})}
                  />
                </View>
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.vary_small,
                  color: Colors.yellow
                }}>ต้องมีผู้เข้าร่วมอย่างน้อย 2 คน
              </Text>

              <View style={{display: 'flex', width: 300, flexDirection: 'row', alignItems: 'center', margin: 10}}>
                <TouchableOpacity onPress={() => {
                  if (eventData.type === "ONSITE") {
                    props.navigation.navigate('GoogleMap')
                  }
                }} style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: 'rgba(214, 234, 248, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <EventIcons source={'Ionicons'}
                              name={eventData.type === "ONLINE" ? 'laptop-outline' : 'ios-location-outline'} size={35}
                              color={Colors.primary}/>
                </TouchableOpacity>
                <View style={{marginLeft: 20}}>
                  <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                    {
                      eventData.type === "ONLINE" &&
                      <TextInput
                        defaultValue={eventData.location}
                        style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}
                        multiline={false}
                        placeholder={"ใส่ลิงค์ในการเข้าร่วมกิจกรรม"}
                        placeholderTextColor={Colors.gray2}
                        onChangeText={(text) => setEventData({...eventData, location: text})}
                      />
                    }
                    {
                      eventData.type === "ONSITE" &&
                      <Text numberOfLines={1} style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}>
                        {eventData?.location ?? 'สถานที่จัดกิจกรรม'}
                      </Text>
                    }
                  </View>
                </View>
              </View>
              {
                eventData.type === "ONLINE" &&
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: Fonts.bold,
                    fontSize: FontSize.vary_small,
                    color: Colors.yellow
                  }}>ต้องเป็นลิงค์ในการเข้าร่วมกิจกรรมเท่านั้น
                </Text>
              }

              <View style={{display: 'flex', flexDirection: 'column', margin: 10}}>
                <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium}}>
                  รายระเอียดกิจกรรม
                </Text>
                <View style={{display: 'flex', marginTop: 5}}>
                  <TextInput
                    defaultValue={eventData.description}
                    style={{fontFamily: Fonts.primary, fontSize: FontSize.primary}}
                    multiline={true}
                    placeholder={"ใส่รายละเอียดกิจกรรม"}
                    placeholderTextColor={Colors.gray2}
                    onChangeText={(text) => setEventData({...eventData, description: text})}
                  />
                </View>
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.vary_small,
                  color: Colors.yellow
                }}>ต้องระบุรายกิจกรรมอย่างน้อย 20 ตัวอักษร
              </Text>

              <View style={{display: 'flex', flexDirection: 'column', margin: 20}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity disabled={!onCheckForm()} onPress={() => onSubmit()}>
                    <View style={{
                      backgroundColor: onCheckForm() ? Colors.primary : Colors.gray2,
                      width:  Platform.OS === 'ios'?  350 : 390,
                      padding: 10,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontFamily: Fonts.bold,
                        fontSize: fontSize.primary,
                        color: Colors.white
                      }}>สร้างกิจกรรม</Text>
                    </View>

                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  )

  const renderLoad = () =>(
    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 50}}>
      <View style={{width: 150, height:100, backgroundColor: Colors.white, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.primary}}>กำลังบันทึกข้อมูล</Text>
      </View>
    </View>
  )

  const onSubmit = () => {
    setShowLoad(true)
    const filename = coverImage?.toString().split('/').pop()
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const data = new FormData();
    data.append('eventInfo', JSON.stringify(eventData));
    data.append('coverImage', coverImage ? {uri: coverImage, name: filename, type: type} : null);

    api.createEvent(data).then(async res => {
      if(res.status === 200){
        console.log('Pass')
        await setEventData({
          eventName: null,
          description: null,
          type: "ONLINE",
          startDate: new Date().getTime(),
          endDate: new Date().getTime(),
          memberId: null,
          location: null,
          latitude: "-1",
          longitude: "-1",
          numberOfPeople: 0,
          tags: [],
        })
        await setCoverImage(null)
        await setDateStatus(null)
        await setShowLoad(false)
        props.navigation.navigate('Feed')
      }
    })
  }

  return (
    <View style={{flex: 1, backgroundColor: userData ? Colors.gray2 : Colors.white}}>
      {
        showLoad && renderLoad()
      }
      {
        (Platform.OS === 'ios' && dateStatus != null) && renderSelectDataIOS()
      }
      {
        userData ? renderForm() :
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{
              marginLeft: 10,
              fontFamily: Fonts.bold,
              fontSize: FontSize.big,
              color: Colors.black
            }} >คุณยังไม่ได้เข้าสู่ระบบ</Text>
          </View>
      }
    </View>
  );
};

export default CreateEventScreen;