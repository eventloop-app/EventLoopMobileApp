import React from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";
import {toBuddhistYear} from "../constants/Buddhist-year";
import moment from "moment";

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
                uri: (event.coverImageUrl ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1034872227377717278/no-image-available-icon-6.png')
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
            <View style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
              <Ionicons name={'calendar-sharp'} size={24} color={Colors.primary} />
              <Text style={{
                fontFamily: Fonts.primary,
                fontSize: fontSize.primary,
                color: Colors.black,
                textAlign: 'left',
                marginLeft: 5
              }}>{toBuddhistYear(moment(event?.startDate), "DD/MM/YYYY")}</Text>
            </View>
            <View style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
              <Ionicons name={'ios-time-outline'} size={24} color={Colors.primary} />
              <Text style={{
                fontFamily: Fonts.primary,
                fontSize: fontSize.primary,
                color: Colors.black,
                textAlign: 'left',
                marginLeft: 5
              }}>{moment(event.startDate).format("HH:mm") + " - " + moment(event.endDate).format("HH:mm") + " น."}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCards;