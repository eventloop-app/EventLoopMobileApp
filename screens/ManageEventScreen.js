import React, {useEffect, useState} from 'react';
import {Image, Platform, ScrollView, Text, TouchableOpacity, View} from "react-native";
import api from "../services/api/api";
import storages from "../services/storage/storages";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";

const ManageEventScreen = (props) => {
  const [userData, setUserData] = useState(null)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      checkHasUser()
      api.getEventByOrg(userData?.id).then(res => {
        if (res.status === 200) {
          setEvent(res.data.content)
          console.log(res.data.content)
        }
      })
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    checkHasUser()
  }, [])

  useEffect(() => {
    if (userData !== null) {
      api.getEventByOrg(userData.id).then(res => {
        if (res.status === 200) {
          setEvent(res.data.content)
          console.log(res.data.content)
        }
      })
    }
  }, [userData])

  const checkHasUser = () => {
    storages.getUserData().then(res => {
      api.getUserDataById(res?.memberId).then(user => {
        if (user.status === 200) {
          setUserData(user.data)
        }
      }).catch(error => {
        setUserData(null)
        console.log("GET USER")
        console.log(error)
      })
    })
  }
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{
          flex: 1,
          marginTop: (Platform.OS === 'ios' ? 100 : 90),
          backgroundColor: Colors.white
        }}>
        {
          event?.map((en, index) => (
            <View key={index} style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              margin: 6,
              marginVertical: 3,
              borderRadius: 15
            }}>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                padding: 3,
                height: 100,
                borderRadius: 10,
                backgroundColor: Colors.white
              }}>
                <View style={{flex: 1,}}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 0.6}}>
                      <Image
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 4,
                          resizeMode: 'cover'
                        }}
                        source={{
                          uri: (en.coverImageUrl ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1034872227377717278/no-image-available-icon-6.png')
                        }}
                      />
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <Text numberOfLines={1} style={{
                        fontFamily: Fonts.bold,
                        fontSize: fontSize.small,
                        color: Colors.black,
                        marginLeft: 5
                      }}>{en?.eventName}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity disabled={!(moment().unix() * 1000 < en?.endDate)} onPress={() => {props.navigation.navigate('EditEvent', {eveId: en.id})}}
                  style={{flex: 0.3, justifyContent: 'center', alignItems: 'center'}}>
                  <Ionicons name={'ios-create-outline'} size={36} color={(moment().unix() * 1000 < en?.endDate) ? Colors.primary : Colors.gray2}/>
                </TouchableOpacity>
                <TouchableOpacity disabled={!(moment().unix() * 1000 < en?.endDate)} onPress={()=> props.navigation.navigate('ManageEventByOrg', {eve: en, memId: userData?.id})} style={{flex: 0.3, justifyContent: 'center', alignItems: 'center'}}>
                  <Ionicons name={'ios-reorder-three-outline'} size={36} color={(moment().unix() * 1000 < en?.endDate) ? Colors.primary : Colors.gray2}/>
                </TouchableOpacity>
              </View>
              {/*<Text style={{color: en.status === 'NORMAL' ? Colors.primary : Colors.yellow}}>{en.id}</Text>*/}
            </View>
          ))
        }
      </ScrollView>
    </View>
  );
};

export default ManageEventScreen;