import React, {useEffect, useState} from 'react';
import {Image, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import api from "../services/api/api";
import storages from "../services/storage/storages";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import {toBuddhistYear} from "../constants/Buddhist-year";
import moment from "moment";
import EventCardList from "../components/eventCardList";
import {useDispatch, useSelector} from "react-redux";
import {getUserInfo} from "../actions/auth";
import * as Location from 'expo-location';
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";

const EventListScreen = (props) => {
  const [event, setEvent] = useState(null)
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.auth)


  useEffect(() => {
    checkHasUser()
  }, [])

  useEffect(() => {
    switch (props.route.params.keyword) {
      case "eventAttention":
        api.getEventAttention().then(res => {
          setEvent(res.data.content)
        })
        break
      case "มาแรง":
        api.getEventAttention().then(res => {
          setEvent(res.data.content)
        })
        break
      case "allEvent":
        api.getAllEvents().then(res => {
          setEvent(res.data.content)
        })
        break
      case "กิจกรรมทั้งหมด":
        api.getAllEvents().then(res => {
          setEvent(res.data.content)
        })
        break
      case "กำลังจะเริ่ม":
        api.getAllEvents("?sortBy=startAt").then(res => {
          setEvent(res.data.content)
        })
        break
      case "ที่ลงทะเบียน":
        api.getOrgEvent(userInfo.id).then(res => {
          setEvent(res.data.content)
        })
        break
      case "ใกล้ฉัน":
        api.getEventByRang(13.655189820678869,100.499218006178).then(res => {
          setEvent(res.data.content)
        })
        break
      case "tagEvent":
        api.getEventByTag(userInfo?.id).then(res => {
          setEvent(res.data.content)
        })
        break
      case "ความสนใจ":
        api.getEventByTag(userInfo?.id).then(res => {
          setEvent(res.data.content)
        })
        break
      case "followEvent":
        api.getEventByFollowing({memberId: userInfo.id}).then(res => {
          setEvent(res.data)
        })
        break
    }
  }, [])


  const checkHasUser = () => {
    dispatch(getUserInfo())
  }


  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"dark-content"}
      />
      <ScrollView
        style={{marginTop: (Platform.OS === 'ios' ? 120 : 80)}}
        contentContainerStyle={{paddingBottom: 300}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {
          event?.map((eve, index) => (
            <EventCardList key={index} item={eve} onPress={() => props.navigation.navigate('EventDetail', {
              event: eve,
              userInfo: userInfo ?? undefined
            })}/>
          ))
        }
        {
          event?.length === 0 &&
          <Text style={{
            fontFamily: Fonts.bold,
            fontSize: FontSize.primary,
            color: Colors.gray2,
            textAlign: "center"
          }}>
            ไม่พบกิจกรรม
          </Text>
        }
      </ScrollView>
    </View>
  );
};

export default EventListScreen;