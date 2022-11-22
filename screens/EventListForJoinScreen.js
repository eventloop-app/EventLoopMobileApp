import React, {useEffect, useState} from 'react';
import api from "../services/api/api";
import {Image, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import EventCardList from "../components/eventCardList";
import {getUserInfo} from "../actions/auth";
import {useDispatch, useSelector} from "react-redux";

const EventListForJoinScreen = (props) => {
  const {userInfo} = useSelector(state => state.auth)
  const [event, setEvent] = useState(null)
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log('Refresh')
    getEventOrg()
  }, []);

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     if(event !== null){
  //       setEvent(null)
  //       console.log('Reload Event')
  //       setTimeout(()=>{
  //         getEventOrg()
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
    getEventOrg()
  }, [userInfo])

  const getEventOrg = () =>{
    if (userInfo !== null) {
      api.getOrgEvent(userInfo.id).then(res => {
        if (res.status === 200) {
          console.log(res.data.content)
          setEvent(res.data.content)
          setTimeout(()=>{
            console.log('Refreshed')
            setRefreshing(false)
          }, 500)

        }
      })
    }
  }

  const checkHasUser = () => {
    dispatch(getUserInfo)
  }


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
            <EventCardList key={index} item={eve} onPress={() => props.navigation.navigate('EventDetail', {event: eve})}/>
          ))
        }
      </ScrollView>
    </View>
  );
};

export default EventListForJoinScreen;