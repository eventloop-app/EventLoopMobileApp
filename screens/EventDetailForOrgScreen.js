import React, {useEffect, useState} from 'react';
import {Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import api from "../services/api/api";
import FontSize from "../constants/FontSize";

const EventDetailForOrgScreen = (props) => {
  const memId = props.route.params.memId
  const eveId = props.route.params.eve.id
  const [qrImg, setQrImg] = useState(null)
  const [checkCode, setCheckCode] = useState(null)
  const [showModelQR, setShowModelQR] = useState(false)
  const [memOfEvent, setMemOfEvent] = useState(null)

  useEffect(()=>{
    api.getRegMem({eventId: props.route.params.eve.id, memberId: props.route.params.memId}).then(res =>{
      if(res.status === 200){
        setMemOfEvent(res.data)
      }
    })
  }, [])

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
        <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.medium}}>รายงานกิจกรรม</Text>
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
        <View style={{padding: 5, height: 400}}>
          <Text style={{
            fontFamily: Fonts.bold,
            fontSize: fontSize.primary,
            color: Colors.black,
            marginLeft: 5
          }}>
            รายชื่อผู้เข้าร่วม
          </Text>
          <ScrollView
            contentContainerStyle={{paddingBottom: 100}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            >
          {
            memOfEvent?.map((mem,index) => (
              <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                <Image
                  style={{
                    marginLeft:5,
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                    resizeMode: 'cover'
                  }}
                  source={{
                    uri: (mem.profileUrl ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1034872227377717278/no-image-available-icon-6.png')
                  }}
                />
                <Text style={{
                  fontFamily: Fonts.bold,
                  fontSize: fontSize.primary,
                  color: Colors.black,
                  marginLeft: 5
                }}>{mem.username}</Text>
              </View>
            ))
          }
          </ScrollView>
        </View>
        <View style={{position: 'relative', bottom: 0, left: 0, right: 0, top: 200}}>
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