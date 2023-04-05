// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddChatScreen from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen';
import ImageScreen from './screens/ImageScreen';
import CameraScreen from './screens/CameraScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name="AddChat" component={AddChatScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen}  />
        <Stack.Screen name="ImageScreen" component={ImageScreen}  />
        <Stack.Screen name="CameraScreen" component={CameraScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;