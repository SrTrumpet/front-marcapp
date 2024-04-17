import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import ForgotPass from './screens/ForgotPass'; 
import Register from './screens/Register';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component = {Login}/>
        <Stack.Screen name="ForgotPass" component={ForgotPass}/>
        <Stack.Screen name="Register" component={Register}/>
      </Stack.Navigator>

    </NavigationContainer>
      
  );
}

