import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import ForgotPass from './screens/ForgotPass'; 
import Register from './screens/Register';
import Home from './screens/Home';
import Perfil from './screens/Perfil';
import Update from './screens/Update';
import VerRangoSemana from './screens/VerRangoSemana';
//import { setContext } from '@apollo/client/link/context';
//import { getToken } from './utils/tokenStorage';
//import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, split } from '@apollo/client';
import {ApolloClientsContext, clientUsuarios, clientMarcaje } from './graphql/ApolloClienteContext';
import PerfilAdmin from './screens/PerfilAdmin';
import { ToastProvider } from 'react-native-toast-notifications'


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <ApolloClientsContext.Provider value={{ clientUsuarios, clientMarcaje }}>
      <ToastProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component = {Login}/>
            <Stack.Screen name="ForgotPass" component={ForgotPass}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Perfil" component={Perfil}/>
            <Stack.Screen name="Update" component={Update}/>
            <Stack.Screen name="Perfil Admin" component={PerfilAdmin}/>
            <Stack.Screen name="Rango Semana" component={VerRangoSemana}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </ApolloClientsContext.Provider>
  );
}

