import React, {useState,useEffect} from "react";
import { TextInput, Text, View, Alert } from "react-native";
import { StatusBar } from 'expo-status-bar';
import styles from './../components/style/styles';
import ButtonGradient from './../ButtonGradient';
import Loading from "./Loading";
import * as SecureStore from 'expo-secure-store';

//Mutaciones y Queries
import { VERIFICAR_TOKEN } from "../graphql/query/auth";
import { INICIO_SESION } from '../graphql/mutations/auth';
import { useMutation, useQuery} from '@apollo/client';

import { clientUsuarios } from '../graphql/ApolloClienteContext';

const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { data: verifyData, loading: verifyLoading, error: verifyError } = useQuery(VERIFICAR_TOKEN, { client: clientUsuarios });
    const [login, { loading: loginLoading, error: loginError }] = useMutation(INICIO_SESION, { client: clientUsuarios });

    useEffect(() => {
        if (verifyData && verifyData.verificarInicioSesion) {
            navigation.replace('Home');
        } else if (verifyError) {
            Alert.alert("Error!", "Tu sesión ha expirado, vuelve a iniciar sesión.");
        }
    }, [verifyData, verifyError, navigation]);



    const handleLogin = async () => {
        try {
            const result = await login({
                variables: {
                    email,
                    password
                }
            });
            console.log('Login success:', result.data.login.token);
            await SecureStore.setItemAsync('userToken', result.data.login.token);
            navigation.replace('Home');
        } catch (e) {
            console.error('Login error:', e.message);
            Alert.alert("Login Error", e.message);
        }
    };


    if (verifyLoading || loginLoading) return <Loading />;
    if (loginError) return <Text>Error! {loginError.message}</Text>;

    return(
        <View style = {styles.container}>
            <Text style = {styles.titulo}>Hola </Text>
            <Text style = {styles.subTitle}>Inicia sesion en tu cuenta</Text>

            <TextInput style = {styles.textInput}
                placeholder='jhon@gmail.com'
                onChangeText={setEmail}
                value={email}
            />

            <TextInput 
                style = {styles.textInput}
                placeholder='Contraseña'
                secureTextEntry = {true}
                onChangeText={setPassword}
                value={password}
            />

            <Text style={styles.containerOlvido}>Olvidé mi contraseña. 
                <Text style={styles.linkText} onPress={() => navigation.navigate('ForgotPass')}> Recuperar
                </Text>
            </Text>
            
            <ButtonGradient  onPress={handleLogin}/>

            <Text style={styles.containerOlvido}>No tengo cuenta. 
                <Text style={styles.linkText} onPress={() => navigation.navigate('Register')}> Registrate
                </Text>
            </Text>

            <StatusBar style="auto" />
    </View>

    )
}

export default Login;