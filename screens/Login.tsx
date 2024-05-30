import React, {useState,useEffect} from "react";
import { TextInput, Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import styles from './../components/style/styles';
import ButtonGradient from './../ButtonGradient';
import Loading from "./Loading";
import * as SecureStore from 'expo-secure-store';

import Home from '../screens/Home';

//import axios from 'axios';

//Mutaciones y Queries
import { INICIO_SESION } from '../graphql/mutations/auth';
import { useMutation} from '@apollo/client';


const Login = ({navigation}) =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginRecive ,{loading, error}] = useMutation(INICIO_SESION);


    useEffect(() => {
        const checkToken = async () => {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                navigation.navigate('Home');
            }
        };
        checkToken();
    }, [navigation]);

    const handleLogin = async() => {
        try {
            const result = await loginRecive({
                variables: {
                    email: email,
                    password: password
                }
            });
            console.log('Login success:', result.data.login.token);
            await SecureStore.setItemAsync('userToken', result.data.login.token);
            navigation.navigate('Home');
        } catch (e){
            console.error('Login error:', e);
        }
    };

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error! {error.message}</Text>;
    

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