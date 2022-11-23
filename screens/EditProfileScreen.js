import React, {useEffect, useState} from 'react';
import {Dimensions, Image, Platform, Text, TextInput, TouchableOpacity, View} from "react-native";
import storages from "../services/storage/storages";
import api from "../services/api/api";
import Colors from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import Fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";
import eventTagLists from "../constants/EventTagLists";
import EventIcons from "../components/eventIcons";
import FontSize from "../constants/FontSize";
import FormData from "form-data";
import { UpdateProfileData} from "../actions/auth";
import {useDispatch} from "react-redux";

const EditProfileScreen = (props) => {
  const dispatch = useDispatch();
  const tagsList = eventTagLists
  const [userData, setUserData] = useState(null)
  const [newData, setNewData] = useState({
    username: null,
    tags: [],
    memberId: '',
  })
  const [image, setImage] = useState(null)

  useEffect(() => {
    console.log('Feed: GetUserInfo')
    storages.getUserData().then(res => {
      api.getUserDataById(res?.memberId).then(user => {
        if (user.status === 200) {
          console.log(user.data)
          setNewData({...newData,
            username: user.data.username,
            tags: user.data.tags,
            memberId: user.data.id,
            description: user.data.description
          })
          setUserData(user.data)
        }
      })
    })
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri)
    }
  };

  const pickTags = (tag) => {
    const indexOfTag = newData.tags.findIndex(item => item === tag.title)
    if (indexOfTag === -1) {
      let newTags = [...newData.tags, tag.title]
      setNewData({...newData, tags: newTags})
    } else {
      let newTags = newData.tags.filter((item, index) => index !== indexOfTag)
      setNewData({...newData, tags: newTags})
    }
  }

  const handleSubmitForm = () => {
    const filename = image?.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    const localUri = image;


    const formData = new FormData();
    formData.append('profileImage', localUri ? {uri: localUri, name: filename, type: type} : null);
    formData.append('memberInfo', JSON.stringify(newData));
    console.log(formData)

    api.updateProfile(formData).then(res => {
      if(res.status === 200){
        dispatch(UpdateProfileData(newData.memberId))
        props.navigation.pop()
      }
    })

  }

  return (
    <View style={{flex:1, backgroundColor: Colors.white}}>
      <View style={{marginTop: Platform.OS === 'ios' ? 100 : 60}}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity style={{
            justifyContent: 'center',
            borderRadius: 100,
            borderColor: (userData?.profileUrl ? Colors.green2 : Colors.gray2),
            borderWidth: 4
          }}
                            onPress={() => pickImage()}
          >
            <Image source={image ? {uri: image} : {uri: userData?.profileUrl}}
                   style={{width: 200, height: 200, borderRadius: 100}}/>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <TextInput onChangeText={(text) => setNewData({...newData, username: text})} defaultValue={newData?.username} placeholder={userData?.username} style={{fontFamily: Fonts.bold, fontSize: fontSize.big, textAlign: 'center'}}/>
        </View>

        <View style={{alignItems: 'center', marginTop: 20}}>
          <TextInput onChangeText={(text) => setNewData({...newData, description: text})} defaultValue={newData?.description} placeholder={userData?.description ?? 'รายละเอียดของคุณ'} style={{fontFamily: Fonts.bold, fontSize: fontSize.primary, textAlign: 'center'}}/>
        </View>

        <View style={{alignItems: 'center'}}>
          <View style={{
            flexWrap: 'wrap',
            width: (Dimensions.get('window').width * 0.8),
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 40
          }}>
            {
              tagsList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => pickTags(item)}
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: Colors.white,
                    margin: 5,
                    borderWidth: (newData.tags.filter(tag => tag === item.title).length > 0 ? 3 : 0),
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
                    <EventIcons size={20} source={item.source} name={item.icon}/>
                    <Text style={{textAlign: 'center', fontFamily: Fonts.bold, fontSize: fontSize.vary_small, color: Colors.black}}>
                      {
                        item.title
                      }
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>

        <View style={{alignItems: 'center', marginTop: 20}}>
          <TouchableOpacity onPress={()=>handleSubmitForm()} style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{
              width: 280,
              height: 60,
              backgroundColor: Colors.primary,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                fontFamily: Fonts.bold,
                fontSize: FontSize.primary,
                color: Colors.white
              }}>อัพเดทข้อมูล</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditProfileScreen;