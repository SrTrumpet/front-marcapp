import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import ForgotPass from './screens/ForgotPass'; 
import Register from './screens/Register';
import Home from './screens/Home';
import Perfil from './screens/Perfil';
import { setContext } from '@apollo/client/link/context';
import { getToken } from './utils/tokenStorage';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, split } from '@apollo/client';
import {ApolloClientsContext, clientUsuarios, clientMarcaje } from './graphql/ApolloClienteContext';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
<ApolloClientsContext.Provider value={{ clientUsuarios, clientMarcaje }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component = {Login}/>
          <Stack.Screen name="ForgotPass" component={ForgotPass}/>
          <Stack.Screen name="Register" component={Register}/>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="Perfil" component={Perfil}/>
        </Stack.Navigator>
      </NavigationContainer>
      </ApolloClientsContext.Provider>
  );
}

