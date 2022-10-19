import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StatusBar, Text, View} from "react-native";
import api from "../services/api/api";
import EventCards from "../components/eventCards";
import Colors from "../constants/Colors";
import {FlashList} from "@shopify/flash-list";


const FeedScreen = (props) => {

  const [events, setEvents] = useState(null)
  const [isLoad, setIsLoad] = useState(true)

  useEffect(()=>{
    api.getAllEvents().then(res => {
      if(res.status === 200 && res.data.content.length > 0){
        setEvents(res.data.content)
        setIsLoad(false)
      }else{
        console.error("Data is empty!!")
        // props.navigation.navigate('Error')
      }
    }).catch(error => {
      console.error( error )

      return;
    })

  }, [])


  return (
    !isLoad &&
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: Colors.white,
      }}
    >
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={"dark-content"}
      />
      <View style={{
        flex: 1,
      }}
      >
        <View style={{
          flex: 1,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          width: '100%',
          height: 150,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: Colors.primary,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          zIndex:50
        }}>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 220,}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{
          flex:1,
          paddingTop: 170,
          backgroundColor: Colors.white
        }}>
          <View>
            <FlashList
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={events}
              refreshing={false}
              renderItem={({ item }) => {
                return (
                  <EventCards event={item}/>
                )
              }}
              estimatedItemSize={300}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default FeedScreen;