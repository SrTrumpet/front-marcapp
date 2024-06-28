import React, {useState,useEffect} from "react";
import { TextInput, Text, View, Alert } from "react-native";
import { StatusBar } from 'expo-status-bar';
import styles from './../components/style/styles';
import ButtonGradient from './../ButtonGradient';
import Loading from "./Loading";
import * as SecureStore from 'expo-secure-store';
//GRAPHQL
import { CONSEGUIR_ROL, VERIFICAR_TOKEN } from "../graphql/query/auth";
import { INICIO_SESION } from '../graphql/mutations/auth';
import { useMutation, useQuery} from '@apollo/client';
import { clientUsuarios } from '../graphql/ApolloClienteContext';
//NOTIFICACIONES
import { useToast } from "react-native-toast-notifications";

const Login = ({ navigation }) => {

    const [correo, confiCorreo] = useState('');
    const [contrasenna, setPassword] = useState('');
    const [correoError, setEmailError] = useState('');
    const {data: verificarInfo, loading: verificarCargando, error: verificarError } = useQuery(VERIFICAR_TOKEN, { client: clientUsuarios });
    const {data: infoUsuario} = useQuery(CONSEGUIR_ROL, {client: clientUsuarios});
    const [login, { loading: sesionCargando, error: loginError }] = useMutation(INICIO_SESION, { client: clientUsuarios});
    const toast = useToast();

    useEffect(() => {
        const handleData = async () => {
            try {
                await clientUsuarios.resetStore();
                if (verificarInfo.verificarInicioSesionVesionDos) {
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
                //navigation.navigate('Login');
            }
        };
        handleData();
    }, [verificarInfo, verificarError, infoUsuario]);

    const handleLogin = async () => {
        if (!validarTexto()) {
            return;
        }
        if (!validarCorreo){
            return
        }
        await clientUsuarios.resetStore();
        try {
            const result = await login({
                variables: {
                    email: correo,
                    password:contrasenna
                }
            });
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
            toast.show(e.message,{type:"danger"});
        }
    };

    const validarCorreo = (correo) => {
        if (!correo.includes('@')) {
            setEmailError('El correo electrónico debe contener un "@"');
            return false;
        } else if (!correo.includes('.com') && !correo.includes('.ucn.cl')) {
            setEmailError('El correo electrónico debe contener un dominio, como ".com"');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    const validarTexto = () => {
        if (correo === '') {
            toast.show("Por favor, ingresa un correo electrónico", { type: "danger" });
            return false;
        }
        if (contrasenna === '') {
            toast.show("Por favor, ingresa una contraseña", { type: "danger" });
            return false;
        }
        if (correoError !== '') {
            toast.show(correoError, { type: "danger" });
            return false;
        }
        return true;
    };

    if (verificarCargando || sesionCargando) return <Loading />;

    return(
        <View style = {styles.container}>
            <Text style = {styles.titulo}>Hola </Text>
            <Text style = {styles.subTitle}>Inicia sesion en tu cuenta</Text>

            <TextInput style = {styles.textInput}
                placeholder='jhon@gmail.com'
                onChangeText={confiCorreo}
                onEndEditing={() => validarCorreo(correo)}
                value={correo}
                keyboardType="email-address"
            />
            {correoError ? <Text style={styles.errorText}>{correoError}</Text> : null}

            <TextInput 
                style = {styles.textInput}
                placeholder='Contraseña'
                secureTextEntry = {true}
                onChangeText={setPassword}
                value={contrasenna}
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