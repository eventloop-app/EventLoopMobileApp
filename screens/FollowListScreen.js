import React, {useEffect, useState} from 'react';
import {Image, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import EventCardList from "../components/eventCardList";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import api from "../services/api/api";

const FollowListScreen = (props) => {

  const [follow, setFollow] = useState(null)

  useEffect(()=>{
    console.log(props.route.params)
    if(props.route.params.keyword === 'ผู้ติดตาม'){
      getFollower()
    }else{
      getFollowing()
    }
  },[])

  const getFollower = () =>{
    api.getFollowerList({memberId: props.route.params.memId}).then(res => {
      console.log(res.data)
      setFollow(res.data)
    })
  }

  const getFollowing = () =>{
    api.getFollowingList({memberId: props.route.params.memId}).then(res => {
      console.log(res.data.username)
      setFollow(res.data)
    })
  }

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"dark-content"}
      />
      <View style={{position: "absolute", left: (props.route.params.keyword === "ผู้กำลังติดตาม" ? 85 : 105), top: 55}}>
        <Text style={{
          fontFamily: Fonts.bold,
          fontSize: FontSize.medium,
          color: Colors.black,
          marginLeft: 10,
        }}>
          {
            `รายชื่อ${props.route.params.keyword}`
          }
        </Text>
      </View>

      <ScrollView
        style={{marginTop: (Platform.OS === 'ios' ? 120 : 80)}}
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {
          follow?.map((eve, index) => (
            <TouchableOpacity onPress={()=> props.navigation.navigate('MemberProfile', {orgPro: eve.id, user: props.route.params.memId})} style={{flex: 1, alignItems: 'center', flexDirection: 'row', margin: 10, paddingLeft: 20}} key={index}>
              <Image style={{width: 55, height: 55, borderRadius: 100}} source={{uri: eve.profileUrl}}/>
              <Text style={{
                fontFamily: Fonts.bold,
                fontSize: FontSize.primary,
                color: Colors.black,
                marginLeft: 10,
              }}>{eve.username}</Text>
            </TouchableOpacity>
          ))
        }
        {
          follow?.length === 0 &&
          <Text style={{
            fontFamily: Fonts.bold,
            fontSize: FontSize.primary,
            color: Colors.gray2,
            textAlign: "center"
          }}>
            ไม่พบข้อมูล
          </Text>
        }
      </ScrollView>
    </View>
  )
};

export default FollowListScreen;