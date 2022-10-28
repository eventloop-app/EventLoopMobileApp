import React, {useEffect, useState} from 'react';
import {Image, Platform, ScrollView, Text, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import api from "../services/api/api";
import storages from "../services/storage/storages";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import {toBuddhistYear} from "../constants/Buddhist-year";
import moment from "moment";
import EventCardList from "../components/eventCardList";

const EventListScreen = (props) => {
  const [event, setEvent] = useState(null)

  useEffect(() => {
    setEvent(props.route.params.event)
  }, [])


  return (
    <View style={{flex: 1, marginTop: (Platform.OS === 'ios' ? 80 : 60)}}>
      <ScrollView
        style={{marginTop: 20}}
        contentContainerStyle={{paddingBottom: 300}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {
          event?.map((eve, index) => (
            <EventCardList key={index} item={eve} onPress={() => props.navigation.navigate('EventDetail', {
              event: eve,
            })}/>
          ))
        }
      </ScrollView>
    </View>
  );
};

export default EventListScreen;