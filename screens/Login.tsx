import React, {useState} from "react";
import { TextInput, Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import styles from './../components/style/styles';
import ButtonGradient from './../ButtonGradient';
import Loading from "./Loading";

import Home from '../screens/Home';

//import axios from 'axios';

//Mutaciones y Queries
import { INICIO_SESION } from '../graphql/mutations/auth';
import { useMutation} from '@apollo/client';


const Login = ({navigation}) =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [login ,{loading, error}] = useMutation(INICIO_SESION);

    const handleLogin = async() => {
        console.log("ASDASAD");
        try {
            const result = await login({
                variables: {
                    email: email,
                    password: password
                }
            });

            console.log('Login success:', result.data.login.tocken);
        
        } catch (e){
            console.error('Login error:', e);
        }



        /*
        // Mostrar los datos en la consola
        try{const response = await axios.post('http://192.168.133.26:3000/api/v1/auth/login',
            {
                email:email,
                password:password
            });
        
            setTocken(response.data.tocken);
            console.log("Datos ingresados:", { email, password });
            console.log("Datos del tocken: ",response.data.tocken);
            

        } catch (error){
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
        */
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