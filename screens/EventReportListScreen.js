import React, {useEffect, useState} from 'react';
import {Image, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import api from "../services/api/api";
import storages from "../services/storage/storages";
import Colors from "../constants/Colors";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import {toBuddhistYear} from "../constants/Buddhist-year";
import moment from "moment/moment";
import EventCardList from "../components/eventCardList";
import {getUserInfo} from "../actions/auth";
import {useDispatch, useSelector} from "react-redux";

const EventReportListScreen = (props) => {
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.auth)
  const [event, setEvent] = useState(null)
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log('Refresh')
    getAllEventReport()
  }, []);

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     if(event !== null){
  //       setEvent(null)
  //       console.log('Reload Event')
  //       setTimeout(()=>{
  //         getAllEventReport()
  //       },300)
  //     }
  //   });
  //
  //   return unsubscribe;
  // }, [props.navigation]);

  useEffect(() => {
    checkHasUser()
  }, [])

  useEffect(() => {
    getAllEventReport()
  }, [userInfo])

  const getAllEventReport = () =>{
    if (userInfo !== null) {
      api.getAllEventReport(userInfo?.id).then(res => {
        if (res.status === 200) {
          setEvent(res.data)
          setRefreshing(false)
        }
      })
    }
  }

  const checkHasUser = () => {
    dispatch(getUserInfo)
  }

  const renderCardList = (id, name, start, end, img) => (
    <TouchableOpacity key={name} style={{width: '95%'}} activeOpacity={1}
                      onPress={() => props.navigation.navigate('EventReport', {eveId: id, memId: userInfo?.id})}>
      <View style={{
        flexDirection: 'row',
        width: '100%',
        height: 100,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: Colors.white,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
        <View style={{
          flex: 0.4,
          height: 80,
          borderRadius: 10,
          marginLeft: 12,
          overflow: 'hidden'
        }}>
          <Image
            style={{width: "100%", height: "100%"}}
            source={{
              uri: img ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1034872227377717278/no-image-available-icon-6.png'
            }}
          />
        </View>
        <View style={{flex: 1, height: 75, marginLeft: 12, marginRight: 10, justifyContent: 'center'}}>
          <Text style={{
            fontFamily: fonts.bold,
            fontSize: fontSize.small,
          }}>{`${toBuddhistYear(moment(start), "dd DD hh:mm น.")} - ${toBuddhistYear(moment(end), "dd DD hh:mm น.")}`}</Text>
          <Text numberOfLines={1} style={{fontFamily: fonts.bold, fontSize: fontSize.medium}}>{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={{flex: 1, marginTop: (Platform.OS === 'ios' ? 80 : 60)}}>
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
          event?.map((eve, index) => (
            <EventCardList key={index} item={eve} onPress={() => props.navigation.navigate('EventReport', {
              eveId: eve.id,
              memId: userInfo?.id
            })}/>
          ))
        }
      </ScrollView>
    </View>
  );
};

export default EventReportListScreen;