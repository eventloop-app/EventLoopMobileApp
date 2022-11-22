import React, {useEffect, useState} from 'react';
import {StatusBar, Text, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";

import {useNavigation} from "@react-navigation/native";

const ManageEventScreen = (props) => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"dark-content"}
      />
      <View style={{
        flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <TouchableOpacity

          style={{
          width: "90%", height: 200, backgroundColor: Colors.primary, borderRadius: 15,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
            <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.medium, color: Colors.white}}>
              กิจกรรมที่ฉันสร้าง
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=> navigation.navigate('EventListForJoin')}
          style={{
          width: "90%", height: 200, backgroundColor: Colors.lightpink, borderRadius: 15, marginTop: 50,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
            <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.medium, color: Colors.white}}>
              กิจกรรมที่ฉันเข้าร่วม
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ManageEventScreen;