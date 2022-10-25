import React, {useEffect} from 'react';
import {Text, View} from "react-native";

const EventDetailScreen = (props) => {
  useEffect(()=>{
    console.log(props.route.params.event.id)
  },[])
  return (
    <View>
      <Text>สวัสดี</Text>
    </View>
  );
};

export default EventDetailScreen;