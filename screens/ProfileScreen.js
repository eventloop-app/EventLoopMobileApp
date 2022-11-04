import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Animated,
    Button,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import {exchangeCodeAsync, makeRedirectUri, useAuthRequest, useAutoDiscovery} from 'expo-auth-session';
import {useDispatch, useSelector} from "react-redux";
import {getUserInfo, RegisterSuccess, SignIn, SignOut} from "../actions/auth";
import storages from "../services/storage/storages";
import api from "../services/api/api";
import Colors from "../constants/Colors";
import profileImageMock from "../assets/images/user.png";
import fontSize from "../constants/FontSize";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import EventIcons from "../components/eventIcons";

WebBrowser.maybeCompleteAuthSession();
const ProfileScreen = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {authInfo} = useSelector(state => state.auth)
    const {userInfo} = useSelector(state => state.auth)
    const [showModel, setShowModel] = useState(false)
    const translation = useRef(new Animated.Value(450)).current;

    useFocusEffect(
        useCallback(() => {
            // Animated.timing(translation, {
            //     toValue: 0,
            //     delay: 100,
            //     useNativeDriver: true,
            // }).start();
            return () => {
                console.log('Unmount')
                translation.setValue(450)
            };
        }, [])
    );

    useEffect(() => {
        if (authInfo === null) {
            dispatch(getUserInfo())
        }
    }, [userInfo])

    useEffect(() => {
        if (authInfo !== null || authInfo != undefined) {
            api.checkUserEmail(authInfo.email).then(res => {
                if (res.status === 200) {
                    if (!res.data.hasEmail) {
                        navigation.navigate('SetupProfile')
                    } else {
                        api.getUserDataById(authInfo.memberId).then(res => {
                            if (res.status === 200) {
                                dispatch(RegisterSuccess(res.data))
                            }
                        })
                    }
                }
            })
        }
    }, [authInfo])

    const discovery = useAutoDiscovery(
        'https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/v2.0'
    );

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '4bf4a100-9aeb-42be-8649-8fd4ef42722b',
            clientSecret: "3~68Q~sLI_5IxI1m7m8PdKEP_XGT4xWXfXCdIdfG",
            scopes: ['openid', 'profile', 'email', 'offline_access'],
            responseType: "code",
            redirectUri: makeRedirectUri({
                scheme: 'eventloop'
            }),
        },
        discovery
    );


    useEffect(() => {
        if (response !== null && response?.type !== "dismiss" && response?.type !== "cancel" && authInfo === null) {
            getAzureToken(response.params.code, request.codeVerifier)
        }
    }, [response])

    const getAzureToken = async (code, code_verifier) => {
        const {accessToken, refreshToken, idToken} = await exchangeCodeAsync({
            code: code,
            clientId: '4bf4a100-9aeb-42be-8649-8fd4ef42722b',
            redirectUri: makeRedirectUri({scheme: ''}),
            scopes: ["openid", "profile", "email", "offline_access"],
            grant_type: "authorization_code",
            extraParams: {
                code_verifier: code_verifier
            },
        }, {
            tokenEndpoint: 'https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d/oauth2/v2.0/token'
        })
        dispatch(SignIn(accessToken, refreshToken, idToken))
    }


    const signOut = () => {
        dispatch(SignOut())
        // setUserData(null)
        // props.navigation.navigate("Profile")
    }

    const onShowModel = async () => {
        if (showModel === true) {
            await Animated.timing(translation, {
                toValue: 450,
                delay: 100,
                duration: 250,
                useNativeDriver: true,
            }).start();
            setTimeout(() => {
                setShowModel(false)
            }, 300)
        } else {
            setShowModel(true)
            Animated.timing(translation, {
                toValue: 0,
                delay: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }

    const renderModel = () => (
        <View style={{
            flex: 1,
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.25)',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            zIndex: 50
        }}>
            <View style={{
                position: 'absolute',
                flex: 1,
                left: 0,
                right: 0,
                bottom: 0
            }}>
                <Animated.View style={{
                    flex: 1,
                    height: 450,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    backgroundColor: Colors.white,
                    overflow: 'hidden',
                    transform: [{translateY: translation}]
                }}>

                    <View style={{flex: 1, padding: 10}}>
                        <TouchableOpacity activeOpacity={1}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop:20}}>
                                <EventIcons source={'MaterialCommunityIcons'} name="account-edit" size={30} color={Colors.black}/>
                                <Text style={{
                                    marginLeft: 15,
                                    fontFamily: Fonts.primary,
                                    fontSize: fontSize.primary,
                                    color: Colors.black
                                }}>แก้ไขโปรไฟล์</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} onPress={()=> onShowModel()}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop:350, justifyContent: 'center'}}>
                                <Text style={{
                                    textAlign: 'center',
                                    fontFamily: Fonts.bold,
                                    fontSize: fontSize.primary,
                                    color: Colors.black
                                }}>ปิดหน้าต่าง</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </Animated.View>
            </View>
        </View>
    )

    const renderUserInfoCard = () => (
        <View style={{flex: 1, justifyContent: 'center'}}>
            {
                showModel && renderModel()
            }
            {
                userInfo !== null &&
                <View style={{
                    position: 'absolute',
                    alignItems: 'flex-end',
                    top: Platform.OS === 'ios' ? 60 : 50,
                    left: 0,
                    right: 10,
                    bottom: 0,
                }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => onShowModel()} style={{
                        width: 35,
                        height: 35,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Ionicons name="menu" size={25} color={Colors.white}/>
                    </TouchableOpacity>
                </View>
            }
            <View style={{
                position: 'relative',
                left: 0,
                right: 0,
                top: Platform.OS === 'ios' ? 44 : 0,
                bottom: 0,
                alignItems: 'center'
            }}>
                <View style={{position: 'absolute', top: -60, zIndex: 10}}>
                    <Animated.View style={{
                        width: 120,
                        height: 120,
                        borderWidth: 6,
                        borderColor: Colors.white,
                        borderRadius: 100,
                        overflow: 'hidden'
                    }}>
                        <Image
                            style={{width: "100%", height: "100%", resizeMode: 'cover',}}
                            source={{uri: userInfo?.profileUrl ?? 'https://cdn.discordapp.com/attachments/1018506224167297146/1037860726301282334/user.png'}}
                        />
                    </Animated.View>
                </View>
                <Animated.View
                    style={{
                        width: '95%',
                        height: 300,
                        backgroundColor: Colors.white,
                        borderRadius: 25,
                    }}>
                    <View style={{flex: 1, marginTop: 60, alignItems: 'center'}}>
                        <View style={{
                            flex: 0.5,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{
                                fontFamily: Fonts.bold,
                                fontSize: fontSize.medium,
                                color: Colors.black
                            }}>
                                {
                                    userInfo?.username ?? "ผู้เยียมชม"}

                            </Text>
                        </View>

                        {userInfo === null ?
                            <View style={{flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: Fonts.primary, fontSize: fontSize.primary, textAlign: 'center'
                                }}>
                                    {`คุณยังไม่ได้เข้าสู่ระบบ\nเข้าสู่ระบบเพื่อใช้งานแอพพลิเคชั่นได้สมบูรณ์`}
                                </Text>
                            </View>
                            :
                            <View style={{
                                flex: 1,
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
                                    <View style={{
                                        flex: 1,
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{
                                                fontFamily: Fonts.bold,
                                                fontSize: fontSize.primary,
                                                color: Colors.black
                                            }}>
                                                100
                                            </Text>
                                            <Text style={{
                                                fontFamily: Fonts.bold,
                                                fontSize: fontSize.small,
                                                color: Colors.gray2
                                            }}>
                                                ผู้ติดตาม
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{
                                                fontFamily: Fonts.bold,
                                                fontSize: fontSize.primary,
                                                color: Colors.black
                                            }}>
                                                100
                                            </Text>
                                            <Text style={{
                                                fontFamily: Fonts.bold,
                                                fontSize: fontSize.small,
                                                color: Colors.gray2
                                            }}>
                                                กำลังติดตาม
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        }

                        <View style={{
                            flex: 0.5,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 10
                        }}>
                            <Text  multiline={true}
                                   style={{
                                fontFamily: Fonts.primary,
                                fontSize: fontSize.small,
                                color: Colors.black
                            }}>
                                ชอบเธอ แต่เธอไม่ชอบ
                            </Text>
                        </View>

                        <View style={{
                            flex: 1,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 10
                        }}>
                            {
                                userInfo === null ?
                                    <TouchableOpacity
                                        onPress={() => promptAsync()}
                                        style={{
                                            width: '70%',
                                            height: 50,
                                            backgroundColor: Colors.primary,
                                            borderRadius: 50,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                        <Text style={{
                                            fontFamily: Fonts.bold,
                                            fontSize: fontSize.primary,
                                            color: Colors.white
                                        }}>เข้าสู่ระบบ</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => signOut()}
                                        style={{
                                            width: '70%',
                                            height: 50,
                                            backgroundColor: Colors.primary,
                                            borderRadius: 50,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                        <Text style={{
                                            fontFamily: Fonts.bold,
                                            fontSize: fontSize.primary,
                                            color: Colors.white
                                        }}>จัดการกิจกรรม</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                </Animated.View>
                {userInfo !== null &&
                    renderUserEventCard()
                }
            </View>

            {/*<TouchableOpacity*/}
            {/*  style={{*/}
            {/*    marginTop: 30*/}
            {/*  }}*/}
            {/*  disabled={!request}*/}
            {/*  onPress={() => {*/}
            {/*    promptAsync();*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <Animated.Text style={{*/}
            {/*    fontFamily: Fonts.bold,*/}
            {/*    fontSize: fontSize.big,*/}
            {/*    color: Colors.primary,*/}
            {/*    transform: [{translateX: translation}]*/}
            {/*  }}>เข้าสู่ระบบ</Animated.Text>*/}
            {/*</TouchableOpacity>*/}
        </View>
    )

    const renderUserEventCard = () => (
        <View style={{
            width: '100%',
            position: 'relative',
            left: 0,
            right: 0,
            top: 10,
            bottom: 0,
            alignItems: 'center',
        }}>
            <View
                style={{
                    width: '95%',
                    height: 300,
                    backgroundColor: Colors.white,
                    borderRadius: 25,
                }}>
                <View style={{flex: 1, marginTop: 10}}>
                    <View style={{padding: 10}}>
                        <Text style={{
                            fontFamily: Fonts.bold,
                            fontSize: fontSize.primary,
                            color: Colors.black
                        }}>
                            กิจกรรมที่คุณเข้าร่วม
                        </Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <ScrollView
                            contentContainerStyle={{paddingRight: 10}}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={{flex: 1, flexDirection: 'row',}}
                            horizontal={true}>
                            <View style={{
                                width: 180,
                                height: '90%',
                                borderRadius: 15,
                                backgroundColor: 'pink',
                                marginLeft: 10
                            }}>

                            </View>
                            <View style={{
                                width: 180,
                                height: '90%',
                                borderRadius: 15,
                                backgroundColor: 'pink',
                                marginLeft: 10
                            }}>

                            </View>
                            <View style={{
                                width: 180,
                                height: '90%',
                                borderRadius: 15,
                                backgroundColor: 'pink',
                                marginLeft: 10
                            }}>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>
    )

    return (
        <View style={{flex: 1, backgroundColor: Colors.background,}}>
            <StatusBar
                backgroundColor="transparent"
                translucent={true}
                barStyle={"light-content"}
            />
            {
                renderUserInfoCard()
            }
        </View>
    );
};

export default ProfileScreen;