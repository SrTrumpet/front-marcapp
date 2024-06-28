//REACT O EXPO
import React, {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { TextInput, Text, View, Alert} from "react-native";
//STYLES
import styles from './../components/style/styles';
//BOTONES
import ButtonForgot from '../components/button/ButtonForgot'
//QUERYS
import { FORGOT_PASS } from "../graphql/mutations/auth/index";
import { useMutation } from "@apollo/client";
import { clientUsuarios } from '../graphql/ApolloClienteContext';
//SCREENS
import Loading from "./Loading";
//NOTIFICACIONES
import { useToast } from "react-native-toast-notifications";

const ForgotPass = ({navigation}) =>{
    const [forgot,{loading,error}] = useMutation(FORGOT_PASS, { client: clientUsuarios });
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const toast = useToast();

    const handleReset = async () => {
        if (!validarTexto()) {
            return;
        }
        if(!validarCorreo){
            return;
        }
        try {
            const result = await forgot({
                variables: {
                    email: email
                }
            });
            if (result.data.forgotPass) {
                toast.show(result.data.forgotPass.message,{type:"success"});    
                navigation.navigate("Login");
            } else { 
                throw new Error("No data received");
            }
        } catch (e) {
            if (error) {
                if (error.graphQLErrors.length > 0) {
                    const messages = error.graphQLErrors.map(err => err.message).join(', ');
                    toast.show(`Error de GraphQL: ${messages}`, { type: "danger" });
                } else if (error.networkError) {
                    toast.show(`Error de red: ${error.networkError.message || "Problemas de conexión"}`, { type: "danger" });
                } else {
                    toast.show(`Error: ${error.message}`, { type: "danger" });
                }
            } else {
                toast.show(`Error: ${e.message}`, { type: "danger" });
            }
        }
    };

    const validarCorreo = (email) => {
        if (!email.includes('@')) {
            setEmailError('El correo electrónico debe contener un "@"');
            return false;
        } else if (!email.includes('.')) {
            setEmailError('El correo electrónico debe contener un dominio, como ".com"');
            return false;
        } else{
            setEmailError('');
            return true;
        }
        
    };

    const validarTexto = () => {
        if (email === '') {
            toast.show("Por favor, ingresa un correo electrónico", { type: "danger" });
            return false;
        }
        return true;
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
                keyboardType="email-address"
                onEndEditing={() => validarCorreo(email)}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}


            <ButtonForgot onPress={handleReset}/>
            <StatusBar style="auto" />
        </View>
    )
}
export default ForgotPass;