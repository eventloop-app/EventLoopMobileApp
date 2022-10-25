import React, {useEffect} from 'react';
import {View} from "react-native";
import {Ionicons, Feather, MaterialIcons, MaterialCommunityIcons} from "@expo/vector-icons";

const EventIcons = (props) => {

  const checkIconSource = () =>{
    switch (props.source) {
      case "Feather":
        return <Feather style={{alignSelf: "center"}} name={props.name} size={props.size ?? 36} color="black"/>
        break
      case "Ionicons":
        return <Ionicons style={{alignSelf: "center"}} name={props.name} size={props.size ?? 36} color="black"/>
        break
      case "MaterialIcons":
        return <MaterialIcons style={{alignSelf: "center"}} name={props.name} size={props.size ?? 36} color="black"/>
        break
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons style={{alignSelf: "center"}} name={props.name} size={props.size ?? 36} color="black"/>
        break
    }
  }

  return (
    <View>
      {
        checkIconSource()
      }
    </View>
  );
};

export default EventIcons;