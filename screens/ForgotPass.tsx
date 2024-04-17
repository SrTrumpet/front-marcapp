import React, {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { TextInput, Text, View } from "react-native";
import styles from './../components/style/styles';
import ButtonForgot from '../components/button/ButtonForgot'


const ForgotPass = () =>{

    const [email, setEmail] = useState('');

    const handleReset = () => {
        // Mostrar los datos en la consola
        console.log("Datos ingresados:", { email });
    };
    return(
        <View style = {styles.container}>
            <Text style = {styles.textForgotPass}>
                Ingresa tu correo electronico
            </Text>

            <TextInput
                style = {styles.textInput}
                placeholder="jhon@gmail.com"
                onChangeText={setEmail}
                value={email}
            />

            <ButtonForgot onPress={handleReset}/>
            <StatusBar style="auto" />
        </View>

    )
}

export default ForgotPass;

