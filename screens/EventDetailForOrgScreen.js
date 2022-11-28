import React, {useEffect, useState} from 'react';
import {Image, Platform, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import api from "../services/api/api";
import FontSize from "../constants/FontSize";
import MemberIcon from "../components/memberIcon";

const EventDetailForOrgScreen = (props) => {
  const memId = props.route.params.memId
  const eveId = props.route.params.eve.id
  const [qrImg, setQrImg] = useState(null)
  const [checkCode, setCheckCode] = useState(null)
  const [showModelQR, setShowModelQR] = useState(false)
  const [memOfEvent, setMemOfEvent] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] =useState(null)

  useEffect(()=>{
    getRegisterMember()
    getFeedback()
  }, [])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log('Refresh')
    getRegisterMember()
    getFeedback()
  }, []);

  const getFeedback = () =>{
    setFeedback(null)
    api.getFeedback({memberId:memId, eventId: eveId}).then(res => {
      setFeedback(res.data)
    },error => {
      console.log(error)
    })
  }
  const getRegisterMember = () => {
    setMemOfEvent(null)
    api.getRegMem({eventId: eveId}).then(res =>{
      if(res.status === 200){
        console.log('GetUserThatRegister')
        setMemOfEvent(res.data)
        setTimeout(()=>{
          setRefreshing(false)
        },300)
      }
    },error => {
      console.log(error)
    })
  }

  const modelQR = () => (
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
        height: 300,
        backgroundColor: Colors.white,
        borderRadius: 15,
        padding: 10,
        alignItems: 'center'
      }}>
        <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium}}>แจ้งกิจกรรมนี้</Text>
        <View>
          <Image source={{uri: `data:image/jpeg;base64,${qrImg}`}}
                 style={{width: 180, height: 180, borderRadius: 12}}/>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.primary, textAlign: 'center'}}>{checkCode}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{position: 'relative', bottom: 50, margin: 10}}
                          onPress={() => setShowModelQR(!showModelQR)}>
          <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary, color: Colors.red}}>ปิดหน้าต่าง</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      {
        showModelQR && modelQR()
      }
      <View style={{marginTop: Platform.OS === 'ios' ? 100 : 80}}>
        <View style={{padding: 5, height: 200, }}>
          <Text style={{
            fontFamily: Fonts.bold,
            fontSize: fontSize.primary,
            color: Colors.black,
            marginLeft: 5
          }}>
            รายชื่อผู้เข้าร่วม
          </Text>
          {
            memOfEvent?.length === 0 && <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{
              fontFamily: Fonts.bold,
              fontSize: fontSize.primary,
              color: Colors.gray2,
              marginTop: 100
            }}> ยังไม่มีผู้เข้าร่วมกิจกรรมของคุณ</Text>
            </View>
          }

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
          {
            memOfEvent?.map((mem,index) => (
              <MemberIcon key={index} user={mem} event={eveId}/>
            ))
          }
          </ScrollView>
        </View>
        <View style={{padding: 5, height: 350}}>
          <Text style={{
            fontFamily: Fonts.bold,
            fontSize: fontSize.primary,
            color: Colors.black,
            marginLeft: 5
          }}>
            คำแนะนำกิจกรรมจากผู้เข้าร่วม
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {
              feedback?.map((fb,index) => (
                <View key={index} style={{flexDirection: 'column', marginTop: 20}}>
                  <View style={{flex: 0.3, flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{
                        marginLeft:20,
                        width: 50,
                        height: 50,
                        borderRadius: 100,
                        resizeMode: 'cover'
                      }}
                      source={{
                        uri: (fb?.member?.profileUrl ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1034872227377717278/no-image-available-icon-6.png')
                      }}
                    />
                    <Text style={{
                      fontFamily: Fonts.bold,
                      fontSize: fontSize.primary,
                      color: Colors.black,
                      marginLeft: 5
                    }}>{fb?.member?.username}</Text>
                  </View>
                  <View style={{flex: 0.7, justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
                    <View style={{width: "75%", height: 100, borderRadius: 15, backgroundColor: Colors.gray2, justifyContent: 'center',alignItems: 'center'}}>
                      <Text style={{
                        fontFamily: Fonts.primary,
                        fontSize: fontSize.small,
                        color: Colors.black,
                        marginRight: 5
                      }}>{fb?.feedback}</Text>
                    </View>
                  </View>
                </View>
              ))
            }
          </ScrollView>
        </View>
        <View style={{position: 'relative', bottom: 0, left: 0, right: 0, top: 10}}>
          <TouchableOpacity style={{ alignItems: 'center', marginBottom: 5}} onPress={()=>{ props.navigation.navigate('EditEvent',{eveId: eveId})}}>
            <View style={{
              backgroundColor: Colors.orange,
              width: Platform.OS == 'ios' ? 350 : 390,
              padding: 10,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: Fonts.bold,
                fontSize: fontSize.primary,
                color: Colors.white
              }}>แก้ไขกิจกรรม</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'center'}} onPress={()=>{
            api.generateCode({memberId: memId, eventId: eveId}).then( async res => {
              if(res.status === 200){
                await setQrImg(res.data.base64CheckInCode)
                await setCheckCode(res.data.checkInCode)
                await setShowModelQR(true)
              }
            })
          }}>
            <View style={{
              backgroundColor: Colors.primary,
              width: Platform.OS == 'ios' ? 350 : 390,
              padding: 10,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: Fonts.bold,
                fontSize: fontSize.primary,
                color: Colors.white
              }}>เปิดเช็คอิน</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default EventDetailForOrgScreen;