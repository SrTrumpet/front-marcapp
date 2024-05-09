import React, {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { TextInput, Text, View, Alert} from "react-native";
import styles from './../components/style/styles';
import ButtonForgot from '../components/button/ButtonForgot'
import axios from 'axios';


const ForgotPass = () =>{

    const [email, setEmail] = useState('');

    const handleReset = async() => {


        

        try{const response = await axios.post('http://192.168.133.26:3000/api/v1/auth/forgotpass',
            {
                email:email,
            });
        
            console.log("Datos ingresados:", { email });
            Alert.alert(response.data.message);

        }
        catch (error){

            if (error.response){
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                Alert.alert("Fallo de Login", error.response.data.message);
            }else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
                Alert.alert("Fallo de Login", "No hay respuesta del servidor");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                Alert.alert("Login Failed", error.message);
            }

        }
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

