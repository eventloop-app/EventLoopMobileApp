import {useEffect, useRef, useState} from "react";
import * as Notifications from 'expo-notifications'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FeedScreen from "./screens/FeedScreen";
import {NavigationContainer} from "@react-navigation/native";
import SearchScreen from "./screens/SearchScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "./constants/Colors";
import * as Font from 'expo-font';
import ErrorScreen from "./screens/ErrorScreen";
import ProfileScreen from "./screens/ProfileScreen";
import configureStore from './configStore';
import setupInterceptors from "./services/api/interceptors";
import {Provider, useDispatch} from "react-redux";
import SetupProfile from "./screens/SetupProfile";
import Fonts from "./constants/Fonts";
import fontSize from "./constants/FontSize";
import EventDetailScreen from "./screens/EventDetailScreen";
import EventReportListScreen from "./screens/EventReportListScreen";
import EventReportScreen from "./screens/EventReportScreen";
import CreateEventScreen from "./screens/CreateEventScreen";
import moment from "moment";
import 'moment/locale/th';
import {TouchableOpacity} from "react-native";
import MapScreen from "./screens/MapScreen";
import EventListScreen from "./screens/EventListScreen";
import ManageEventScreen from "./screens/ManageEventScreen";
import EditEventScreen from "./screens/EditEventScreen";
import BookMarkListScreen from "./screens/BookMarkListScreen";
import ScannerScreen from "./screens/ScannerScreen";
import EventDetailForOrgScreen from "./screens/EventDetailForOrgScreen";
import EventListForJoinScreen from "./screens/EventListForJoinScreen";
import api from "./services/api/api";
import MemberProfileScreen from "./screens/MemberProfileScreen";
import EventListForCreateScreen from "./screens/EventListForCreateScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import FollowListScreen from "./screens/FollowListScreen";

moment().locale('th')

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

setupInterceptors(configureStore)

export default function App({route, navigation}) {
  const [isLoad, setIsLoad] = useState(true)
  const [token, setToken] = useState(null)
  const notificationListener = useRef();
  const responseListener = useRef();
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    Font.loadAsync({
      SukhumvitSet: require('./assets/fonts/SukhumvitSet-Text.ttf'),
      SukhumvitSetMedium: require('./assets/fonts/SukhumvitSet-Medium.ttf'),
      SukhumvitSetBold: require('./assets/fonts/SukhumvitSet-Bold.ttf')
    });
  }, [])

  useEffect(() => {
    registerForPushNotification().then(async token => {
      if(token !== undefined){
        await setToken(token)
      }
      await setIsLoad(false)
    }).catch(e => {
      console.warn(e)
    })

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification)
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [])

  const registerForPushNotification = async () => {
    try {
      const {status} = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      } else {
        return (await Notifications.getExpoPushTokenAsync()).data
      }
    }catch (e) {
      setToken('NOT TOKEN')
      console.log(`Can't get expo token`)
    }
  }

  const HomeScreen = () => {
    return (
      <Tab.Navigator screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Feed':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'CreateEvent':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Like':
              iconName = focused ? 'heart-sharp' : 'heart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'ios-person' : 'ios-person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size + 5} color={color}/>;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
      })}>
        <Tab.Screen
          name={'Feed'}
          component={FeedScreen}
          initialParams={{token: token}}
          options={{headerShown: false, tabBarShowLabel: false}}
        />
        <Tab.Screen name={'Search'} component={SearchScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'CreateEvent'} component={CreateEventScreen}
                    options={{headerShown: false, tabBarShowLabel: false, tabBarHideOnKeyboard: true}}/>
        <Tab.Screen name={'Like'} component={BookMarkListScreen}
                    options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'Profile'}
                    component={ProfileScreen}
                    options={{headerShown: false, tabBarShowLabel: false}}
        />
      </Tab.Navigator>
    )
  }

  return (
    !isLoad &&
    <Provider store={configureStore}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'Home'} component={HomeScreen}
                        options={{headerShown: false, tabBarShowLabel: false}}/>
          <Stack.Screen name={'SetupProfile'} component={SetupProfile}
                        options={{
                          headerShown: true,
                          headerTransparent: true,
                          tabBarShowLabel: false,
                          headerBackVisible: false,
                          headerTitleAlign: 'center',
                          headerTitleStyle: {
                            fontFamily: Fonts.bold,
                            fontSize: fontSize.primary,
                            color: Colors.black,
                          },
                          title: 'ตั้งค่าโปรไฟล์',
                        }}
          />
          <Stack.Screen name={'EventDetail'} component={EventDetailScreen}
                        options={({route, navigation}) => ({
                          headerShown: true,
                          headerTransparent: true,
                          tabBarShowLabel: false,
                          headerBackVisible: false,
                          headerTitleAlign: 'center',
                          headerTitleStyle: {
                            fontFamily: Fonts.bold,
                            fontSize: fontSize.primary,
                            color: Colors.black,
                          },
                          title: "",
                          headerTintColor: Colors.white,
                          headerBackTitle: '',
                          headerLeft: () => (
                            <TouchableOpacity
                              style={{
                                borderRadius: 100,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                              onPress={() => navigation.pop()}
                            >
                              <Ionicons name="arrow-back-outline" size={25} color={Colors.black}/>
                            </TouchableOpacity>
                          ),
                          headerRight: () => {
                            if(route.params.isCheck === undefined && route.params.userInfo){
                              api.isBookMark({memberId: route.params.userInfo.id, eventId: route.params.event.id}).then(res =>{
                                navigation.navigate('EventDetail', {event: route.params.event, userInfo: route.params?.userInfo, isCheck: res.data.isBookmark})
                              })
                            }
                            return (
                              (route.params.userInfo) &&
                              <TouchableOpacity
                                style={{
                                  borderRadius: 100,
                                  backgroundColor: 'rgba(255,255,255,0.8)',
                                  width: 30,
                                  height: 30,
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                                onPress={()=> {
                                  api.stampBookMark({memberId:route.params.userInfo.id, eventId: route.params.event.id}).then(res => {
                                    navigation.navigate('EventDetail', {event: route.params.event, userInfo: route.params.userInfo, isCheck: res.data.isBookmark})
                                  },error =>{
                                    console.log(error)
                                  })
                                }}
                              >
                                <Ionicons name={route.params.isCheck ? 'ios-heart-sharp' : 'ios-heart-outline'} size={25} color={Colors.red}/>
                              </TouchableOpacity>
                            )
                          }
                        })}
          />
          <Stack.Screen name={'EventReportList'} component={EventReportListScreen}
                        options={({route, navigation}) => ({
                          headerShown: true,
                          headerTransparent: true,
                          tabBarShowLabel: false,
                          headerBackVisible: false,
                          headerTitleAlign: 'center',
                          headerTitleStyle: {
                            fontFamily: Fonts.bold,
                            fontSize: fontSize.primary,
                            color: Colors.black,
                          },
                          title: 'รายการกิจกรรมที่ถูกแจ้ง',
                        })}
          />
          <Stack.Screen name={'EventReport'} component={EventReportScreen}
                        options={({route, navigation}) => ({
                          headerShown: true,
                          headerTransparent: true,
                          tabBarShowLabel: false,
                          headerBackVisible: false,
                          headerTitleAlign: 'center',
                          headerTitleStyle: {
                            fontFamily: Fonts.bold,
                            fontSize: fontSize.primary,
                            color: Colors.black,
                          },
                          title: 'รายการข้อความรีพอร์ต',
                          headerLeft: () => (
                            <TouchableOpacity
                              style={{
                                borderRadius: 100,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                              onPress={() => navigation.pop()}
                            >
                              <Ionicons name="arrow-back-outline" size={25} color={Colors.black}/>
                            </TouchableOpacity>
                          )
                        })}
          />

          <Stack.Screen name={'EventList'} component={EventListScreen}
                        options={({route, navigation}) => ({
                          headerShown: true,
                          headerTransparent: true,
                          tabBarShowLabel: false,
                          headerBackVisible: false,
                          headerTitleAlign: 'center',
                          headerTitleStyle: {
                            fontFamily: Fonts.bold,
                            fontSize: fontSize.primary,
                            color: Colors.black,
                          },
                          title: 'รายการกิจกรรม',
                          headerLeft: () => (
                            <TouchableOpacity
                              style={{
                                borderRadius: 100,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                              onPress={() => navigation.pop()}
                            >
                              <Ionicons name="arrow-back-outline" size={25} color={Colors.black}/>
                            </TouchableOpacity>
                          )
                        })}
          />

          <Stack.Screen name={'EditEvent'} component={EditEventScreen}
                        options={({route, navigation}) => ({
                          headerShown: true,
                          headerTransparent: true,
                          tabBarShowLabel: false,
                          headerBackVisible: false,
                          headerTitleAlign: 'center',
                          headerTitleStyle: {
                            fontFamily: Fonts.bold,
                            fontSize: fontSize.primary,
                            color: Colors.black,
                          },
                          title: '',
                          headerLeft: () => (
                            <TouchableOpacity
                              style={{
                                borderRadius: 100,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                              onPress={() => navigation.pop()}
                            >
                              <Ionicons name="md-close" size={25} color={Colors.black}/>
                            </TouchableOpacity>
                          )
                        })}
          />

          <Stack.Screen name={'EditProfile'} component={EditProfileScreen}
                        options={({route, navigation}) => ({
                          headerShown: true,
                          headerTransparent: true,
                          tabBarShowLabel: false,
                          headerBackVisible: false,
                          headerTitleAlign: 'center',
                          headerTitleStyle: {
                            fontFamily: Fonts.bold,
                            fontSize: fontSize.primary,
                            color: Colors.black,
                          },
                          title: '',
                          headerLeft: () => (
                            <TouchableOpacity
                              style={{
                                borderRadius: 100,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                              onPress={() => navigation.pop()}
                            >
                              <Ionicons name="md-close" size={25} color={Colors.black}/>
                            </TouchableOpacity>
                          )
                        })}
          />

          <Stack.Screen name={'FollowList'} component={FollowListScreen}
                        options={({route, navigation}) => ({
                          headerShown: true,
                          headerTransparent: true,
                          tabBarShowLabel: false,
                          headerBackVisible: false,
                          headerTitleAlign: 'center',
                          headerTitleStyle: {
                            fontFamily: Fonts.bold,
                            fontSize: fontSize.primary,
                            color: Colors.black,
                          },
                          title: '',
                          headerLeft: () => (
                            <TouchableOpacity
                              style={{
                                borderRadius: 100,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                              onPress={() => navigation.pop()}
                            >
                              <Ionicons name="md-close" size={25} color={Colors.black}/>
                            </TouchableOpacity>
                          )
                        })}
          />

          <Stack.Screen name={'Error'} component={ErrorScreen}
                        options={{headerShown: false, tabBarShowLabel: false}}/>

          <Stack.Screen name={'ManageEvent'} component={ManageEventScreen} options={({route, navigation}) => ({
            headerShown: true,
            headerTransparent: true,
            tabBarShowLabel: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: Fonts.bold,
              fontSize: fontSize.medium,
              color: Colors.black,
            },
            title: "จัดการกิจกรรม",
            headerTintColor: Colors.white,
            headerBackTitle: '',
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  width: 30,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => navigation.pop()}
              >
                <Ionicons name="arrow-back-outline" size={25} color={Colors.black}/>
              </TouchableOpacity>
            )
          })}/>

          <Stack.Screen name={'ManageEventByOrg'} component={EventDetailForOrgScreen} options={({route, navigation}) => ({
            headerShown: true,
            headerTransparent: true,
            tabBarShowLabel: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: Fonts.bold,
              fontSize: fontSize.medium,
              color: Colors.black,
            },
            title: "ข้อมูลกิจกรรม",
            headerTintColor: Colors.white,
            headerBackTitle: '',
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  width: 30,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => navigation.pop()}
              >
                <Ionicons name="arrow-back-outline" size={25} color={Colors.black}/>
              </TouchableOpacity>
            )
          })}/>

          <Stack.Screen name={'EventListForCreate'} component={EventListForCreateScreen} options={({route, navigation}) => ({
            headerShown: true,
            headerTransparent: true,
            tabBarShowLabel: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: Fonts.bold,
              fontSize: fontSize.medium,
              color: Colors.black,
            },
            title: "กิจกรรมที่ฉันสร้าง",
            headerTintColor: Colors.white,
            headerBackTitle: '',
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  width: 30,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => navigation.pop()}
              >
                <Ionicons name="arrow-back-outline" size={25} color={Colors.black}/>
              </TouchableOpacity>
            )
          })}/>

          <Stack.Screen name={'EventListForJoin'} component={EventListForJoinScreen} options={({route, navigation}) => ({
            headerShown: true,
            headerTransparent: true,
            tabBarShowLabel: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: Fonts.bold,
              fontSize: fontSize.medium,
              color: Colors.black,
            },
            title: "กิจกรรมที่คุณเข้าร่วม",
            headerTintColor: Colors.white,
            headerBackTitle: '',
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  width: 30,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => navigation.pop()}
              >
                <Ionicons name="arrow-back-outline" size={25} color={Colors.black}/>
              </TouchableOpacity>
            )
          })}/>

          <Stack.Screen name={'Scanner'} component={ScannerScreen} options={{headerShown: false}}/>

          <Stack.Group screenOptions={{presentation: 'fullScreenModal'}}>
            <Stack.Screen name={'GoogleMap'} component={MapScreen} options={({route, navigation}) => ({
              headerShown: true,
              headerTransparent: true,
              tabBarShowLabel: false,
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontFamily: Fonts.bold,
                fontSize: fontSize.primary,
                color: Colors.black,
              },
              title: "เลือกสถานที่",
              headerTintColor: Colors.white,
              headerBackTitle: '',
              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    borderRadius: 100,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onPress={() => navigation.pop()}
                >
                  <Ionicons name="md-close" size={25} color={Colors.black}/>
                </TouchableOpacity>
              )
            })}/>

            <Stack.Screen name={'MemberProfile'} component={MemberProfileScreen} options={({route, navigation}) => ({
              headerShown: true,
              headerTransparent: true,
              tabBarShowLabel: false,
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontFamily: Fonts.bold,
                fontSize: fontSize.medium,
                color: Colors.black,
              },
              title: "",
              headerTintColor: Colors.white,
              headerBackTitle: '',
              headerBackVisible: false,
              headerLeft: () => (
                <TouchableOpacity
                  style={{
                    borderRadius: 100,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onPress={() => navigation.pop()}
                >
                  <Ionicons name="md-close" size={25} color={Colors.black}/>
                </TouchableOpacity>
              )
            })}/>
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

