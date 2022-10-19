import React, {useEffect} from 'react';
import {Button, Text, View} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import {exchangeCodeAsync, makeRedirectUri, useAuthRequest, useAutoDiscovery} from 'expo-auth-session';
WebBrowser.maybeCompleteAuthSession();
const ProfileScreen = () => {

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
    if (response !== null && response.type !== "dismiss") {
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
    console.log(accessToken, refreshToken, idToken)
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
    </View>
  );
};

export default ProfileScreen;