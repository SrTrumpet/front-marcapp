import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import ForgotPass from './screens/ForgotPass'; 
import Register from './screens/Register';
import Home from './screens/Home';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';


const Stack = createNativeStackNavigator();

const client = new ApolloClient({
  uri: 'http://localhost:3000',
  cache: new InMemoryCache()

})

export default function App() {
  return (
    <ApolloProvider client={client}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component = {Login}/>
        <Stack.Screen name="ForgotPass" component={ForgotPass}/>
        <Stack.Screen name="Register" component={Register}/>
        <Stack.Screen name="Home" component={Home}/>
      </Stack.Navigator>
    </NavigationContainer>
    </ApolloProvider>
  );
}

