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

//NOTIFICACIONES
import { useToast } from "react-native-toast-notifications";

const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {data: verifyData, loading: verifyLoading, error: verifyError } = useQuery(VERIFICAR_TOKEN, { client: clientUsuarios });
    const {data: infoUsuario} = useQuery(CONSEGUIR_ROL, {client: clientUsuarios});
    const [login, { loading: loginLoading, error: loginError }] = useMutation(INICIO_SESION, { client: clientUsuarios});

    const toast = useToast();

    useEffect(() => {
        const handleData = async () => {
            try {
                await clientUsuarios.resetStore();
                if (verifyData.verificarInicioSesionVesionDos) {
                    await clientUsuarios.resetStore();
                    if(infoUsuario?.conseguirRol){
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Perfil Admin' }],
                        });
                    }else{
                        toast.show("Tu sesion sigue abierta",{type:"info"});
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    }
                }else{
                    toast.show("El tiempo de sesion expiró o haz cerrado sesion",{ type: "warning" });
                }
            } catch (e) {
                navigation.navigate('Login');
            }
        };
        handleData();
    }, [verifyData, verifyError]);

    const handleLogin = async () => {
        await clientUsuarios.resetStore();
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
                toast.show("Se ingreso como administrador",{type:"info"});
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Perfil Admin' }],
                });
            }else{
                toast.show("Bienvenido! haz ingresado como usuario",{type:"success"});
                navigation.replace("Home");
            }
        } catch (e) {
            toast.show(e.nessage,{type:"danger"});
        }
    };

    if (verifyLoading || loginLoading) return <Loading />;

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