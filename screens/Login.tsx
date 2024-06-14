import React, {useState,useEffect} from "react";
import { TextInput, Text, View, Alert } from "react-native";
import { StatusBar } from 'expo-status-bar';
import styles from './../components/style/styles';
import ButtonGradient from './../ButtonGradient';
import Loading from "./Loading";
import * as SecureStore from 'expo-secure-store';

//Mutaciones y Queries
import { CONSEGUIR_ROL, VERIFICAR_TOKEN } from "../graphql/query/auth";
import { INICIO_SESION } from '../graphql/mutations/auth';
import { useMutation, useQuery} from '@apollo/client';

import { clientUsuarios } from '../graphql/ApolloClienteContext';
import { CONSULTAR_DATOS } from "../graphql/mutations/users";

const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {data: verifyData, loading: verifyLoading, error: verifyError } = useQuery(VERIFICAR_TOKEN, { client: clientUsuarios });
    const {data: infoUsuario} = useQuery(CONSEGUIR_ROL, {client: clientUsuarios});
    const [login, { loading: loginLoading, error: loginError }] = useMutation(INICIO_SESION, { client: clientUsuarios});

    useEffect(() => {
        const handleData = async () => {
            clientUsuarios.resetStore();
            try {
                if (verifyData.verificarInicioSesionVesionDos) {
                    
                    if(infoUsuario?.conseguirRol){
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Perfil Admin' }],
                        });
                    }else{
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    }
                }else{

                    Alert.alert("Error","El tiempo de sesion expiró o haz cerrado sesion")
                }
            } catch (e) {
                //Alert.alert("Error","El tiempo de sesion expiró o haz cerrado sesion")
                navigation.navigate('Login');
            }
        };
        handleData();
    }, [verifyData, verifyError, navigation]);

    const handleLogin = async () => {
        clientUsuarios.resetStore();
        try {
            const result = await login({
                variables: {
                    email,
                    password
                }
            });
            console.log('Login success:', result.data.login.token);
            await SecureStore.setItemAsync('userToken', result.data.login.token);

            const roleResult = await clientUsuarios.query({
                query: CONSEGUIR_ROL,
                fetchPolicy: 'network-only'  
            });

            if(roleResult.data.conseguirRol){
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Perfil Admin' }],
                });
            }else{
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            }
        } catch (e) {
            console.error('Login error:', e.message);
            Alert.alert("Login Error", e.message);
        }
    };


    if (verifyLoading || loginLoading) return <Loading />;
    //if (loginError) return <Text>Error! {loginError.message}</Text>;
    infoUsuario;


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