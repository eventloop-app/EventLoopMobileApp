import React from 'react';
import {Image, Text, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";

const EventCards = (props) => {
  return (
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
              uri: (props.event.coverImageUrl)
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
            {props.event.eventName}
          </Text>
        </View>

      </View>
    </View>
  );
};

export default EventCards;