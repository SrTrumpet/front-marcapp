import { StatusBar } from 'expo-status-bar';
import React, {useState} from "react";
import { TextInput, Text, View, TouchableOpacity } from "react-native";
import styles from './../components/style/styles';
import ButtonGradient from './../ButtonGradient';




const Login = ({navigation}) =>{



    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Mostrar los datos en la consola
        console.log("Datos ingresados:", { email, password });
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

            <Text style={styles.textNavegaation}>Olvidé mi contraseña. 
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
                <Text style={styles.linkText}>Recuperar</Text>
                </TouchableOpacity>
            </Text>
            
            <ButtonGradient  onPress={handleLogin}/>

            <StatusBar style="auto" />
    </View>

    )
}

export default Login;