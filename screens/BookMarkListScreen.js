import React, {useEffect, useState} from 'react';
import {Image, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import fontSize from "../constants/FontSize";
import fonts from "../constants/Fonts";
import Colors from "../constants/Colors";
import api from "../services/api/api";
import EventCardList from "../components/eventCardList";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import {useDispatch, useSelector} from "react-redux";
import {getUserInfo} from "../actions/auth";

const BookMarkListScreen = (props) => {
  const {userInfo} = useSelector(state => state.auth)

  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [bookMark, setBookMark] = useState(null)

  useEffect(() => {
    if(userInfo !== null){
      getBookMark(userInfo.id)
    }
  }, [userInfo])

  useEffect(() => {
    checkHasUser()
  }, [])

  const checkHasUser = () => {
    dispatch(getUserInfo)
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log('Refresh')
    getBookMark(userInfo.id)
  }, []);

  const getBookMark = (memId) => {
    api.getBookMark({memberId: memId}).then((res) => {
      if(res.status === 200){
        setBookMark(res.data)
        setTimeout(()=>{
          setRefreshing(false)
        }, 500)
      }


    })
  }

  return (
    userInfo ?
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View style={{width: '100%', alignItems: 'center', marginTop: Platform.OS === 'ios' ? 60 : 40}}>
        <Text style={{fontFamily: fonts.bold, fontSize: fontSize.big}}>รายการกิจกรรมที่ชื่นชอบ</Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        style={{marginTop: 20}}
        contentContainerStyle={{paddingBottom: 300}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
          {
            bookMark?.map((eve, index) => (
              <EventCardList key={index} item={eve} onPress={()=> props.navigation.navigate('EventDetail', {event: {id: eve.id}, userInfo: userInfo})}/>
            ))
          }
      </ScrollView>
    </View>
      :
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{
          marginLeft: 10,
          fontFamily: Fonts.bold,
          fontSize: FontSize.big,
          color: Colors.black
        }} >คุณยังไม่ได้เข้าสู่ระบบ</Text>
      </View>
  );
};

export default BookMarkListScreen;