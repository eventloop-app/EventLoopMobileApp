import React, {useEffect, useState} from 'react';
import {Image, Text, View} from "react-native";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import api from "../services/api/api";

const MemberProfile = ({user, event}) => {
  const [isCheck, setIsCheck] = useState(false)

  useEffect(()=>{
    checkIsCheckIn()
  }, [])

  const checkIsCheckIn = () =>{
    api.isCheckIn({memberId: user.id, eventId: event}).then(res => {
      console.log(res.data)
      setIsCheck(res.data.isCheckIn)
    })
  }

  return (
    <View key={user.id} style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
      <View style={{flex: 0.3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 20,}}>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            resizeMode: 'cover'
          }}
          source={{
            uri: (user.profileUrl ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1034872227377717278/no-image-available-icon-6.png')
          }}
        />
        <Text style={{
          fontFamily: Fonts.bold,
          fontSize: fontSize.primary,
          color: Colors.black,
          marginLeft: 5
        }}>{user.username}</Text>
      </View>
      <View style={{flex: 0.7, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
        <Text style={{
          fontFamily: Fonts.primary,
          fontSize: fontSize.small,
          color: Colors.black,
          marginRight: 5
        }}>{isCheck ? 'เช็คอินเรียบร้อย':'ยังไม่เช็คอิน'}</Text>
      </View>
    </View>
  );
};

export default MemberProfile;