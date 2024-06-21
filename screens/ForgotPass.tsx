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
    const toast = useToast();

    const handleReset = async () => {
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
            console.error('ForgotPass Error:', e);
            if (error) {
                if (error.graphQLErrors.length > 0) {
                    const messages = error.graphQLErrors.map(err => err.message).join(', ');
                    Alert.alert("Error de GraphQL", messages);
                } else if (error.networkError) {
                    Alert.alert("Error de red", error.networkError.message || "Problemas de conexión");
                } else {
                    Alert.alert("Error", error.message);
                }
            } else {
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