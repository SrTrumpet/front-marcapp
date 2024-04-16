import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {Text, View, TextInput} from 'react-native';
import styles from './components/style/styles';


export default function App() {
  return (
    <View style = {styles.container}>
      <Text style = {styles.titulo}>Hola </Text>
      <Text style = {styles.subTitle}>Inicia sesion en tu cuenta</Text>

      <TextInput style = {styles.textInput}
        placeholder='jhon@gmail.com'
      />

      <TextInput style = {styles.textInput}
        placeholder='Contraseña'
      />
      <StatusBar style="auto" />
    </View>
  );
}

