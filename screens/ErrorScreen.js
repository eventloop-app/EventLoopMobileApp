import React from 'react';
import {Text, View} from "react-native";
import fonts from "../constants/Fonts";
import fontSize from "../constants/FontSize";

const ErrorScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
      <Text style={{
        textAlign: 'center',
        fontFamily: fonts.bold,
        fontSize: fontSize.big
      }}>มีบางอย่างผิดพลาด</Text>
    </View>
  );
};

export default ErrorScreen;