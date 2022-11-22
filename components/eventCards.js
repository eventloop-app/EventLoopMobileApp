import React, {useEffect, useState} from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";
import {toBuddhistYear} from "../constants/Buddhist-year";
import moment from "moment";
import api from "../services/api/api";
import EventIcons from "./eventIcons";
import {MaterialIcons} from "@expo/vector-icons";

const EventCards = ({event, onPress}) => {
  const [userJoin, setUserJoin] = useState(null)
  const [isLoad, setIsLoad] = useState(true)

  useEffect(() => {
    api.getRegMem({eventId: event.id}).then(res => {
      setUserJoin(res.data)
      setTimeout(()=>{
        setIsLoad(false)
      },500)

    })
  }, [])

  const renderPersonIcon = () => {
    let view = []
    let num = 30
    userJoin.reverse()
    for (let i = 0; i < (userJoin.length > 3 ? 3 : userJoin.length); i++) {
      num = num + (i === 0 ? 0 : 12)
      view.push(<View key={i} style={{
        position: 'absolute',
        width: 25,
        height: 25,
        borderRadius: 25,
        top: 0,
        left: num,
        bottom: 0,
        right: 0,
        overflow: "hidden"
      }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover'
          }}
          source={{
            uri: (userJoin[i]?.profileUrl ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1037860726301282334/user.png')
          }}
        />
      </View>)
    }
    if (userJoin?.length > 3) {
      view.push(<View key={4} style={{
        position: 'absolute',
        width: 40,
        height: 25,
        borderRadius: 25,
        top: 0,
        left: 80,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        overflow: "hidden"
      }}>
        <Text style={{
          fontFamily: Fonts.bold,
          fontSize: fontSize.small,
          color: Colors.gray2,
        }}>
          {
            `+${userJoin?.length - 3}`
          }
        </Text>
      </View>)
    }
    return view
  }
  return (
    !isLoad &&
      <TouchableOpacity activeOpacity={1} onPress={onPress}>
        <View style={{marginTop: 10, marginLeft: 5, marginRight: 5, width: '100%', height: 290}}>
          <View style={{
            width: 210,
            height: 280,
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
              height: "50%",
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
                  fontSize: fontSize.primary,
                  color: Colors.black,
                }}>
                {event.eventName}
              </Text>
              <View style={{
                marginTop: 4,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
                <Ionicons name={'calendar-sharp'} size={24} color={Colors.primary}/>
                <Text style={{
                  fontFamily: Fonts.primary,
                  fontSize: fontSize.primary,
                  color: Colors.black,
                  textAlign: 'left',
                  marginLeft: 5
                }}>{toBuddhistYear(moment(event?.startDate), "DD/MM/YYYY")}</Text>
              </View>
              <View style={{
                marginTop: 4,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}>
                <Ionicons name={'ios-time-outline'} size={24} color={Colors.primary}/>
                <Text style={{
                  fontFamily: Fonts.primary,
                  fontSize: fontSize.primary,
                  color: Colors.black,
                  textAlign: 'left',
                  marginLeft: 5
                }}>{moment(event.startDate).format("HH:mm") + " - " + moment(event.endDate).format("HH:mm") + " น."}</Text>
              </View>
              {(userJoin?.length > 0) &&
                <View style={{
                  marginTop: 4,
                  position: 'relative',
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                  <Ionicons name={'person'} size={24} color={Colors.primary}/>
                  {
                    renderPersonIcon()
                  }
                </View>
              }

              {(userJoin?.length === 0) &&
                <View style={{
                  marginTop: 4,
                  position: 'relative',
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                  <MaterialIcons name={'fiber-new'} size={24} color={Colors.primary}/>
                  <Text style={{
                    marginLeft: 5,
                    fontFamily: Fonts.primary,
                    fontSize: fontSize.primary,
                    color: Colors.black,
                  }}>
                    กิจกรรมใหม่
                  </Text>
                </View>
              }
            </View>
          </View>
        </View>
      </TouchableOpacity>
  );
};

export default EventCards;