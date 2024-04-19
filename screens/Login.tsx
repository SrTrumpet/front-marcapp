import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from "react";
import { TextInput, Text, View, Alert } from "react-native";
import styles from './../components/style/styles';
import ButtonGradient from './../ButtonGradient';
import axios from 'axios';
import Home from '../screens/Home';


const Login = ({navigation}) =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tocken, setTocken] = useState('');


    const handleLogin = async() => {
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
    };


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