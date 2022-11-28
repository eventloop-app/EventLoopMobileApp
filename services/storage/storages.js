import AsyncStorage from '@react-native-async-storage/async-storage';
import decode from "../jwt/decode";

class storages  {
  save = async (key, value) => {
    try {
      console.log("SAVE: " + key )
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.log("SaveStorageError:" + error);
    }
  }

  remove = async (key) => {
    try {
      await AsyncStorage.removeItem(key)
      console.log('removed')
    } catch (error) {
      console.log("RemoveStorageError:" + error);
    }
  }

  getData = async (key) => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        return new Promise(resolve => resolve(data))
      }
    } catch (error) {
      console.log("GetStorageError:" + error);
    }
  }

  getData2 = async (key) => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        return data
      }
    } catch (error) {
      console.log("GetStorageError:" + error);
    }
  }

  getUserData = async () => {
    try {
      let data = await AsyncStorage.getItem('userToken');
      if (data !== null) {
        data = decode.jwt(JSON.parse(data).idToken)
        return Promise.resolve(data)
        // return new Promise(resolve => resolve(data))
      }
    } catch (error) {
      console.log("GetStorageError:" + error);
    }
  }
}

export default new storages();
