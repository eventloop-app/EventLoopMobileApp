import {useEffect, useRef} from "react";
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
import {Provider} from "react-redux";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

setupInterceptors(configureStore)

export default function App() {

  const notificationListener = useRef();
  const responseListener = useRef();
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  useEffect(()=>{
    Font.loadAsync({
      SukhumvitSet: require('./assets/fonts/SukhumvitSet-Text.ttf'),
      SukhumvitSetMedium: require('./assets/fonts/SukhumvitSet-Medium.ttf'),
      SukhumvitSetBold: require('./assets/fonts/SukhumvitSet-Bold.ttf')
    });
  },[])

  useEffect(() => {
    registerForPushNotification().then(token => {
      console.log(token)
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
    const {status} = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    } else {
      return (await Notifications.getExpoPushTokenAsync()).data
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
          options={{headerShown: false, tabBarShowLabel: false}}
        />
        <Tab.Screen name={'Search'} component={SearchScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'CreateEvent'} component={FeedScreen}
                    options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'Like'} component={FeedScreen} options={{headerShown: false, tabBarShowLabel: false}}/>
        <Tab.Screen name={'Profile'}
                    component={ProfileScreen}
                    options={{headerShown: false, tabBarShowLabel: false}}
        />
      </Tab.Navigator>
    )
  }


  return (
    <Provider store={configureStore}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'Home'} component={HomeScreen}
                        options={{headerShown: false, tabBarShowLabel: false}}/>
          <Stack.Screen name={'Error'} component={ErrorScreen}
                        options={{headerShown: false, tabBarShowLabel: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

