import React from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";

const EventCards = ({event, onPress}) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <View style={{marginTop: 10, marginLeft: 5, marginRight: 5, width: '100%', height: 250}}>
        <View style={{
          width: 210,
          height: 240,
          borderRadius: 15,
          padding: 5,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          backgroundColor: Colors.white
        }}>
          <View style={{
            alignItems: 'center',
            margin: 3,
            borderRadius: 15,
            height: "60%",
            overflow: 'hidden',
            backgroundColor: Colors.gray
          }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              source={{
                uri: (event.coverImageUrl)
              }}
            />
          </View>
          <View style={{
            margin: 3,
          }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: Fonts.bold,
                fontSize: fontSize.small,
                color: Colors.black,
              }}>
              {event.eventName}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCards;