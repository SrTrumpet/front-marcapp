import React, {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { TextInput, Text, View, Alert} from "react-native";
import styles from './../components/style/styles';
import ButtonForgot from '../components/button/ButtonForgot'
import { FORGOT_PASS } from "../graphql/mutations/auth/index";
import { useMutation } from "@apollo/client";
import Loading from "./Loading";
import { clientUsuarios } from '../graphql/ApolloClienteContext';

const ForgotPass = ({navigation}) =>{

    const [forgot,{loading,error}] = useMutation(FORGOT_PASS, { client: clientUsuarios });
    const [email, setEmail] = useState('');

    const handleReset = async () => {
        try {
            const result = await forgot({
                variables: {
                    email: email
                }
            });
            if (result.data.forgotPass) {
                Alert.alert("Exito!", result.data.forgotPass.message);    
                navigation.navigate("Login");
            } else {
                // Si no hay errores de GraphQL, pero tampoco datos como esperábamos
                throw new Error("No data received");
            }
        } catch (e) {
            console.error('ForgotPass Error:', e);
            if (error) {
                // Error de GraphQL o error de red
                if (error.graphQLErrors.length > 0) {
                    // Errores de GraphQL enviados desde el servidor
                    const messages = error.graphQLErrors.map(err => err.message).join(', ');
                    Alert.alert("Error de GraphQL", messages);
                } else if (error.networkError) {
                    // Error de red, como un problema de conexión
                    Alert.alert("Error de red", error.networkError.message || "Problemas de conexión");
                } else {
                    // Otros tipos de errores no específicamente de red o GraphQL
                    Alert.alert("Error", error.message);
                }
            } else {
                // Error capturado en el try-catch que no es específico de GraphQL
                Alert.alert("Error", e.message);
            }
        }
    };
    

    if(loading)return <Loading/>;

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

