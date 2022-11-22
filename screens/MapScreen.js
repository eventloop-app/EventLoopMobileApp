import * as React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, Text, View, Dimensions, SafeAreaView, TextInput, TouchableOpacity, Platform} from 'react-native';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import * as Location from 'expo-location';
import {createRef, useEffect, useState} from "react";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Mapin from  "../assets/images/pin.png"

const MapScreen = (props) => {

  const [location] = useState({
    latitude: 13.655195982451191,
    longitude: 100.49923007148183,
    latitudeDelta: 0.0616193304764995,
    longitudeDelta: 0.04865230321884155
  })

  const mapRef = createRef();
  const mapRef2 = createRef();
  const [mapData, setMapData] = useState({
    name: null,
    lat: null,
    lng: null,
  })

  const [marker, setMarker] = useState({lat: 0, lng: 0});

  useEffect(() => {
    checkPermissions()
  }, [])

  useEffect(() => {
    if (marker.lat !== 0) {
      mapRef.current.animateToRegion({
        latitude: marker.lat,
        longitude: marker.lng,
        longitudeDelta: 0.001,
        latitudeDelta: 0.001
      })
    }
  }, [marker])

  const checkPermissions = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <MapView
          showsMyLocationButton={true}
          ref={mapRef}
          moveOnMarkerPress={true}
          onMarkerDrag={() => console.log('Mark')}
          style={styles.maps}
          provider={"google"}
          showsUserLocation={true}
          initialRegion={location}
          followsUserLocation={true}
          onPoiClick={(a) => {
            setMarker({
              lat: a.nativeEvent.coordinate.latitude,
              lng: a.nativeEvent.coordinate.longitude,
            })
            setMapData({
              lat: a.nativeEvent.coordinate.latitude,
              lng: a.nativeEvent.coordinate.longitude,
              name: a.nativeEvent.name.replace(/\n/g,' ')
            })
          }}>
          <Marker image={Mapin}
                  description={mapData?.name} coordinate={{latitude: marker.lat, longitude: marker.lng}}/>
        </MapView>
        <View style={{
          position: 'absolute',
          top: (Platform.OS === "android" ? 70 : 100),
          width: '90%',
          left: "5%",
          zIndex: 10
        }}>
          <GooglePlacesAutocomplete
            ref={mapRef2}
            styles={{
              textInput: {
                fontFamily: fonts.primary,
                fontSize: fontSize.primary
              },
            }}
            placeholder={'ค้นหาสถานที่'}
            autoFocus={true}
            fetchDetails={true}
            onPress={(data, details = null) => {
              console.log(data.description)
              setMarker({
                ...marker,
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
              })
              setMapData({
                ...mapData,
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
                name: data.description.replace(/\n/g,' ')
              })
            }}
            nearbyPlacesAPI='GooglePlacesSearch'
            GooglePlacesSearchQuery={{
              rankby: 'distance',
            }}
            query={{
              key: 'AIzaSyBaiAdtJEvMsBB1MRKo_ld90kxv-kTEMi4',
              location: `${location.latitude}, ${location.longitude}`,
              radius: '15000',
              language: 'th',
              components: 'country:th',

            }}
          />
        </View>
        {
          (mapData.name && <View style={{
            width: "100%",
            height: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              position: 'absolute',
              top: 550,
              width: 200,
              height: 125,
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: 12,

            }}>
              <Text
                numberOfLines={2}
                style={{
                  padding: 5,
                  textAlign: 'center',
                  fontFamily: fonts.primary,
                  fontSize: fontSize.small
                }}>{mapData?.name}</Text>
              <View style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate(props.route.params?.page ?? 'CreateEvent', {map: mapData})}
                  style={{
                    borderRadius: 5,
                    height: 35,
                    width: 120,
                    backgroundColor: Colors.primary,
                    justifyContent: 'center'
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      textAlign: 'center',
                      fontFamily: fonts.bold,
                      fontSize: fontSize.small
                    }}
                  >
                    ยืนยันสถานที่
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>)
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maps: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
});

export default MapScreen;