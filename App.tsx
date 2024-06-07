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
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';


const Stack = createNativeStackNavigator();

/*
const client = new ApolloClient({
  uri: 'http://192.168.8.26:3000/graphql',
  cache: new InMemoryCache()

})*/

const httpLink = new HttpLink({
  uri: 'http://192.168.123.26:3000/graphql'
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const link = ApolloLink.from([authLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});


export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component = {Login}/>
          <Stack.Screen name="ForgotPass" component={ForgotPass}/>
          <Stack.Screen name="Register" component={Register}/>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="Perfil" component={Perfil}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

