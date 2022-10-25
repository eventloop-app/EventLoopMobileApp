import React, {useEffect, useState} from 'react';
import {Button, Image, Platform, Text, TouchableOpacity, View} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import {exchangeCodeAsync, makeRedirectUri, useAuthRequest, useAutoDiscovery} from 'expo-auth-session';
import {useDispatch, useSelector} from "react-redux";
import {SignIn, SignOut} from "../actions/auth";
import storages from "../services/storage/storages";
import api from "../services/api/api";
import Colors from "../constants/Colors";
import profileImageMock from "../assets/images/profileImage.jpg";
import fontSize from "../constants/FontSize";
import Fonts from "../constants/Fonts";
import FontSize from "../constants/FontSize";

WebBrowser.maybeCompleteAuthSession();
const ProfileScreen = (props) => {
  const dispatch = useDispatch();
  const {authData} = useSelector(state => state.auth)
  const {userInfo} = useSelector(state => state.auth)
  const [userData, setUserData] = useState(null)

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

  useEffect(()=>{
    storages.getUserData().then(res =>{
      api.getUserDataById(res?.memberId).then(user => {
        if(user.status === 200){
          setUserData(user.data)
        }
      }).catch(error => {
        console.log("GET USER")
        console.log(error)
      })
    })
  },[])

  useEffect(() => {
    if (userInfo !== null && userInfo !== undefined) {
      if (userInfo['_3'] !== undefined && userInfo['_3'] !== null) {
        setUserData(JSON.parse(userInfo['_3']))
      } else if (userInfo.id !== undefined) {
        setUserData(userInfo)
      }
    }
  }, [userInfo])


  useEffect(() => {
    if (authData) {
      api.checkUserEmail(authData.email).then(res => {
        if (!res.data.hasEmail) {
          props.navigation.navigate('SetupProfile')
        }else{
          storages.getUserData().then(res =>{
           api.getUserDataById(res.memberId).then(user => {
             setUserData(user.data)
           })
          })
        }
      }).catch(error => {
        console.warn("CheckEmail: " + error)
      })
    }
  }, [authData])


  useEffect(() => {
    if (response !== null && response?.type !== "dismiss" && response?.type !== "cancel" && authData === null) {
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
    storages.remove('userToken')
    storages.remove('Token')
    storages.remove('userInfo')
    setUserData(null)
    props.navigation.navigate("Profile")
  }

  const renderHasUser = () => (
    <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 50 : 35}}>
      <View style={{position: 'relative', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
        <Image
          source={userData?.profileUrl ? {uri: userData?.profileUrl} : profileImageMock}
          style={{
            width: 200,
            height: 200,
            borderRadius: 200 / 2,
            borderWidth: 4,
            borderColor: Colors.primary
          }}
        />
      </View>
      <View style={{alignItems: "center", marginTop: 10}}>
        <View style={{flexDirection: "row"}}>
          <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.large}}>{userData?.username}</Text>
        </View>
        <View style={{flexDirection: "row", marginTop: 4}}>
          <View style={{alignItems: "center", width: 100}}>
            <Text style={{fontFamily: Fonts.primary, fontSize: fontSize.primary}}>กำลังติดตาม</Text>
            <Text style={{fontFamily: Fonts.primary, fontSize: fontSize.primary}}>xxx</Text>
          </View>
          <View style={{marginLeft: 11, marginRight: 0, borderColor: "black", borderWidth: 1}}></View>
          <View style={{alignItems: "center", width: 100}}>
            <Text style={{fontFamily: Fonts.primary, fontSize: fontSize.primary}}>ผู้ติดตาม</Text>
            <Text style={{fontFamily: Fonts.primary, fontSize: fontSize.primary}}>xxx</Text>
          </View>
        </View>
      </View>

      <View style={{padding: 20}}>
        <Text style={{
          fontFamily: Fonts.bold,
          fontSize: FontSize.medium,
        }}>เกี่ยวกับฉัน</Text>
        <Text style={{
          display: "flex",
          marginTop: 5,
          color: userData?.description ? Colors.black : "gray2",
          fontFamily: Fonts.primary,
          fontSize: FontSize.small,
        }}>
          {userData?.description ? userData?.description.trim() : "คุณยังไม่ได้เพิ่มคำอธิบาย"}
        </Text>
        {/*{*/}
        {/*  (isEdit && <TextInput onChange={(e) => setUserData({...userData, description: e.nativeEvent.text})}*/}
        {/*                        style={{fontFamily: Fonts.primary, fontSize: FontSize.small, paddingLeft: 1}}*/}
        {/*                        value={userData.description} placeholder={'คุณยังไม่ได้เพิ่มคำอธิบาย'}/>)*/}
        {/*}*/}
      </View>

      <View style={{padding: 20}}>
        <Text style={{
          fontFamily: Fonts.bold,
          fontSize: FontSize.medium,
        }}>
          กิจกรรมที่ฉันสนใจ
        </Text>
        <View style={{width: "100%", flexDirection: "row", flexWrap: "wrap",}}>
          {userData?.tags.map((item, index) => {
            return (
              <View key={index} View style={{
                flexDirection: "row",
                backgroundColor: Colors.primary,
                borderRadius: 8,
                padding: 4,
                paddingHorizontal: 8,
                marginHorizontal: 2,
                margin: 5
              }}>
                <Text style={{
                  fontFamily: Fonts.primary,
                  fontSize: FontSize.small,
                  color: Colors.white
                }}>{item}
                </Text>
              </View>
            )
          })}
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {
            userData?.role === "ADMIN" && <TouchableOpacity activeOpacity={0.8}  onPress={() => props.navigation.navigate('EventReportList')}>
              <View style={{
                width: Platform.OS === "ios" ? 340 : 350,
                height: 45,
                backgroundColor: Colors.primary,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20
              }}>
                <Text style={{
                  fontFamily: Fonts.bold,
                  fontSize: fontSize.primary,
                  color: Colors.white
                }}>รายการอีเวนท์ที่ถูกรายงาน</Text>
              </View>
            </TouchableOpacity>
          }

          {/*<TouchableOpacity activeOpacity={0.8}>*/}
          {/*   <View style={{*/}
          {/*     width: Platform.OS === "ios" ? 340 : 350,*/}
          {/*     height: 45,*/}
          {/*     backgroundColor: Colors.primary,*/}
          {/*     borderRadius: 12,*/}
          {/*     justifyContent: 'center',*/}
          {/*     alignItems: 'center',*/}
          {/*     marginBottom: 20*/}
          {/*   }}>*/}
          {/*     <Text style={{*/}
          {/*       fontFamily: Fonts.bold,*/}
          {/*       fontSize: fontSize.primary,*/}
          {/*       color: Colors.white*/}
          {/*     }}>จัดการกิจกรรมที่สร้าง</Text>*/}
          {/*   </View>*/}
          {/* </TouchableOpacity>*/}
          {/*<TouchableOpacity activeOpacity={0.8} >*/}
          {/*  <View style={{*/}
          {/*    width: Platform.OS === "ios" ? 340 : 350,*/}
          {/*    height: 45,*/}
          {/*    backgroundColor: Colors.primary,*/}
          {/*    borderRadius: 12,*/}
          {/*    justifyContent: 'center',*/}
          {/*    alignItems: 'center',*/}
          {/*    marginBottom: 20*/}
          {/*  }}>*/}
          {/*    <Text style={{*/}
          {/*      fontFamily: Fonts.bold,*/}
          {/*      fontSize: fontSize.primary,*/}
          {/*      color: Colors.white*/}
          {/*    }}>{true ? 'อัปเดทโปรไฟล์' : 'แก้ไขโปรไฟล์'}</Text>*/}
          {/*  </View>*/}
          {/*</TouchableOpacity>*/}
          {/*<TouchableOpacity activeOpacity={0.8} onPress={() => setIsEdit(false)}>*/}
          {/*   <View style={{*/}
          {/*     width: Platform.OS === "ios" ? 340 : 350,*/}
          {/*     height: 45,*/}
          {/*     backgroundColor: Colors.red,*/}
          {/*     borderRadius: 12,*/}
          {/*     justifyContent: 'center',*/}
          {/*     alignItems: 'center',*/}
          {/*     marginBottom: 20*/}
          {/*   }}>*/}
          {/*     <Text style={{*/}
          {/*       fontFamily: Fonts.bold,*/}
          {/*       fontSize: fontSize.primary,*/}
          {/*       color: Colors.white*/}
          {/*     }}>ยกเลิกแก้ไขโปรไฟล์</Text>*/}
          {/*   </View>*/}
          {/* </TouchableOpacity>*/}

          <TouchableOpacity activeOpacity={0.8} onPress={() => signOut()}>
            <View style={{
              // backgroundColor: Colors.red,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: Fonts.bold,
                fontSize: fontSize.primary,
                color: Colors.red
              }}>ออกจากระบบ</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderNotUser = () =>(
    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{
        fontFamily: Fonts.bold,
        fontSize: fontSize.big,
        color: Colors.black
      }}>คุณยังไม่ได้เข้าสู่ระบบ</Text>

      <Text style={{
        fontFamily: Fonts.bold,
        fontSize: fontSize.primary,
        color: Colors.yellow
      }}>คุณอาจใช้งานแอพพลิเคชั่นได้ไม่สมบูรณ์</Text>

      <TouchableOpacity
        style={{
          marginTop: 30
        }}
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      >
      <Text style={{
        fontFamily: Fonts.bold,
        fontSize: fontSize.big,
        color: Colors.primary
      }}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>

    </View>
  )


  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      {userData ? renderHasUser() : renderNotUser()}
      {/*<TouchableOpacity*/}
      {/*  disabled={!request}*/}
      {/*  onPress={() => {*/}
      {/*    promptAsync();*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Text>Login</Text>*/}
      {/*</TouchableOpacity>*/}

      {/*<TouchableOpacity onPress={()=> logOut()}>*/}
      {/*  <Text>Logout</Text>*/}
      {/*</TouchableOpacity>*/}
    </View>
  );
};

export default ProfileScreen;