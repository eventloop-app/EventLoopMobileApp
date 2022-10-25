import React, {useEffect, useState} from 'react';
import {Button, Image, Platform, Text, TextInput, TouchableOpacity, View} from "react-native";
import {ProgressStep, ProgressSteps} from "react-native-progress-steps";
import Fonts from "../constants/Fonts";
import {Dimensions} from 'react-native';
import Colors from "../constants/Colors";
import FontSize from "../constants/FontSize";
import {useDispatch, useSelector} from "react-redux";
import api from "../services/api/api";
import * as ImagePicker from 'expo-image-picker';
import eventTagLists from "../constants/EventTagLists";
import EventIcons from "../components/eventIcons";
import FormData from "form-data";
import {RegisterSuccess} from "../actions/auth";
import fontSize from "../constants/FontSize";

const SetupProfile = (props) => {
  const [isLoad, setIsLoad] = useState(false)
  const dispatch = useDispatch();
  const {authData} = useSelector(state => state.auth)
  const token = useSelector(state => state.token)
  const [data, setData] = useState(
    {
      image: null,
      username: null,
      tags: [],
      memberId: authData?.memberId,
      firstname: authData?.name.split(' ')[0].toLowerCase(),
      lastname: authData?.name.split(' ')[1].toLowerCase(),
      email: authData?.email,
      deviceId: token['_3']
    }
  )
  const [error, setError] = useState({
    username: true,
    tags: true
  })
  const [tagsList, setTagsList] = useState(eventTagLists)


  const changeUsername = (username) => {
    const regex = new RegExp(/^[\u0E00-\u0E7Fa-zA-Z]{3,15}$/)
    if(username !== ""){
      api.checkUsername(username).then(res => {
        if(!res.data.hasUsername && regex.test(username)){
          setData({...data, username: username})
          setError({...error, username: false})
        }else {
          setData({...data, username: username})
          setError({...error, username: true})
        }
      })
    }else {
      setError({...error, username: true})
    }
  }

  const pickTags = (tag) => {
    const indexOfTag = data.tags.findIndex(item => item === tag.title)
    if( indexOfTag === -1){
      let newTags = [...data.tags, tag.title]
      setData({...data, tags: newTags})
    }else{
      let newTags = data.tags.filter((item, index) => index !== indexOfTag)
      setData({...data, tags: newTags})
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setData({...data, image: result.uri})
    }
  };

  const handleSubmitForm = () =>{
    const filename = data.image?.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    const localUri = data.image;

    const userData = {
      username: data.username,
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      memberId: data.memberId,
      tags: data.tags,
      deviceId: data.deviceId
    }

    const formData = new FormData();
    formData.append('profileImage', localUri ? {uri: localUri, name: filename, type: type} : null);
    formData.append('memberInfo', JSON.stringify(userData));

    api.transferMemberData(formData).then(res => {
      console.log(res.status)
      if(res.status === 200){
        setIsLoad(true)
        console.log('pass')
        dispatch(RegisterSuccess(res.data.member))
        setTimeout(()=>{
          setIsLoad(false)
          props.navigation.navigate('Profile')
        }, 1000)
      }
    })
  }

  const renderForm = () => (
    <View style={{marginTop: 10}}>
      <View>
        <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary}}>ชื่อผู้ใช้</Text>
        <TextInput style={{
          borderWidth: 2,
          borderRadius: 6,
          height: 50,
          borderColor: Colors.gray2,
          paddingLeft: 5,
          fontFamily: Fonts.primary,
          fontSize: FontSize.primary,
          width: (Dimensions.get('window').width * 0.8)
        }}
                   defaultValue={data.username}
                   onChangeText={ (event)=> changeUsername(event)}
        >
        </TextInput>
        {
          (error.username && data.username?.length > 0) && <Text style={{fontFamily: Fonts.primary, fontSize: FontSize.vary_small, marginTop: 5, color: Colors.red}}>ชื่อผู้ใช้ไม่ถูกต้องหรือถูกใช้งานไปแล้ว</Text>
        }
      </View>

      <View style={{marginTop: 10}}>
        <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary}}>ชื่อ</Text>
        <TextInput
          editable={false}
          style={{
            borderWidth: 2,
            borderRadius: 6,
            height: 50,
            borderColor: Colors.gray2,
            paddingLeft: 5,
            fontFamily: Fonts.primary,
            fontSize: FontSize.primary,
            width: (Dimensions.get('window').width * 0.8)
          }}
          defaultValue={data.firstname}
        >
        </TextInput>
      </View>

      <View style={{marginTop: 10}}>
        <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary}}>นามสกุล</Text>
        <TextInput
          editable={false}
          style={{
            borderWidth: 2,
            borderRadius: 6,
            height: 50,
            borderColor: Colors.gray2,
            paddingLeft: 5,
            fontFamily: Fonts.primary,
            fontSize: FontSize.primary,
            width: (Dimensions.get('window').width * 0.8)
          }}
          defaultValue={data.lastname}
        >
        </TextInput>
      </View>

      <View style={{marginTop: 10}}>
        <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.primary}}>อีเมล</Text>
        <TextInput
          editable={false}
          style={{
            borderWidth: 2,
            borderRadius: 6,
            height: 50,
            borderColor: Colors.gray2,
            paddingLeft: 5,
            fontFamily: Fonts.primary,
            fontSize: FontSize.primary,
            width: (Dimensions.get('window').width * 0.8)
          }}
          defaultValue={data.email}
        >
        </TextInput>
      </View>
    </View>
  )

  const renderPickImageProfile = () => {
    return (
      <View style={{marginTop: 100}}>
        <TouchableOpacity style={{
          justifyContent: 'center',
          borderRadius: 150,
          borderColor: (data.image ? Colors.green2 : Colors.gray2),
          borderWidth: 4
        }}
        onPress={()=> pickImage()}
        >
          <Image source={data.image ? {uri: data.image} : require('../assets/images/profileImage.jpg')}
                 style={{width: 200, height: 200, borderRadius: 150}}/>
        </TouchableOpacity>
        <View style={{paddingTop: 8}}>
        </View>
      </View>
    )
  }

  const renderPickTags = () => (
    <View style={{flexWrap: 'wrap',width: (Dimensions.get('window').width * 0.8), flexDirection: 'row', justifyContent: 'center', paddingTop: 40}}>
      {
        tagsList.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={()=> pickTags(item)}
            style={{
              width: 80,
              height: 80,
              backgroundColor: Colors.white, margin: 5,
              borderWidth: (data.tags.filter(tag => tag === item.title).length > 0 ? 3 : 0),
              borderColor: Colors.primary,
              borderRadius: 6,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
          }}>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
              <EventIcons size={36} source={item.source} name={item.icon}/>
              <Text style={{textAlign: 'center', fontFamily: Fonts.bold, color:  Colors.black}}>
                {
                  item.title
                }
              </Text>
            </View>
          </TouchableOpacity>
        ))
      }
    </View>
  )

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      {
        isLoad &&
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 50}}>
          <View style={{width: 150, height:100, backgroundColor: Colors.white, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: Fonts.bold, fontSize: fontSize.primary}}>กำลังบันทึกข้อมูล</Text>
          </View>

        </View>
      }
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 70 : 55}}>
      <ProgressSteps labelFontFamily={Fonts.primary}>
        <ProgressStep
          errors={error.username}
          scrollable={false}
          label="เพิ่มข้อมูล"
          nextBtnText={'ต่อไป'}
          nextBtnTextStyle={{fontFamily: Fonts.bold, color: error.username ? Colors.gray2 : Colors.primary}}>
          <View style={{alignItems: 'center', height: 500}}>
            {
              renderForm()
            }
          </View>
        </ProgressStep>
        <ProgressStep
          scrollable={false}
          label="ตั้งค่ารูปโปรไฟล์"
          previousBtnText={'ย้อนกลับ'}
          nextBtnText={data.image ? 'ต่อไป' : 'ภายหลัง'}
          previousBtnTextStyle={{fontFamily: Fonts.bold, color:  Colors.primary}}
          nextBtnTextStyle={{fontFamily: Fonts.bold, color:  Colors.primary}}
        >
          <View style={{alignItems: 'center', height: 500}}>
            {
              renderPickImageProfile()
            }
          </View>
        </ProgressStep>
        <ProgressStep
          onSubmit={() => {
            if(data.tags.length > 0){
              handleSubmitForm()
            }
          }}
          scrollable={false}
          label="สิ่งที่คุณสนใจ"
          finishBtnText={'บันทึก'}
          previousBtnText={'ย้อนกลับ'}
          previousBtnTextStyle={{fontFamily: Fonts.bold, color:  Colors.primary}}
          nextBtnTextStyle={{fontFamily: Fonts.bold, color:  data.tags.length > 0 ? Colors.primary : Colors.gray2}}
        >
          <View style={{alignItems: 'center', height: 500}}>
            {
              renderPickTags()
            }
            <Text style={{fontFamily: Fonts.bold, fontSize: FontSize.small, color: Colors.yellow, marginTop: 10}}>เลือกอย่างน้อย 1 อย่าง</Text>
          </View>
        </ProgressStep>
      </ProgressSteps>
      </View>
    </View>
  );
};

export default SetupProfile;