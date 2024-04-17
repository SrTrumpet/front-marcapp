import React from "react";
import { StatusBar } from 'expo-status-bar';
import { TextInput, Text, View } from "react-native";
import styles from './../components/style/styles';

const ForgotPass = () =>{
    return(
        <View style = {styles.container}>

            <Text style = {styles.subTitle}>
                Ingresa tu correo electronico
            </Text>

            <StatusBar style="auto" />
        </View>

    )
}

export default ForgotPass;

