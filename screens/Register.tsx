import React, {useState} from "react";
import { TextInput, Text, View, ScrollView, Alert} from "react-native";
import styles from './../components/style/styles';
import ButtonRegister from '../components/button/ButtonRegister';
import DateInput from '../components/button/DateInput';
//import axios from 'axios';
import { useMutation } from "@apollo/client";
import { REGISTER } from "../graphql/mutations/auth";
import Loading from "./Loading";
import { clientUsuarios } from '../graphql/ApolloClienteContext';
import { useToast } from "react-native-toast-notifications";//Recordar usar esto para personalizar las notificaciones

const Register = ({navigation}) =>{

    const [nombre, setNombre]  = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [contrasenna, setContrasenna] = useState('');
    const [verficaContrasenna, setVerificaContrasenna] = useState('');

    const [registerResponse,{loading,error}] = useMutation(REGISTER, { client: clientUsuarios });

    

    const handleRegister = async () => {
        try {
            if(contrasenna === verficaContrasenna){
                const result = await registerResponse({
                    variables:{
                        nombre:nombre,
                        apellidos:apellidos,
                        fechaNacimiento:fechaNacimiento,
                        email:email,
                        pass:contrasenna
                    }
                });
                //console.log("Datos Ingresados: ",result.data.register.message)
                Alert.alert("Exito!","Felicidades tu registro se completó")
                
                navigation.navigate("Login");
            }else{
                Alert.alert("Error!","Las contraseñas debe coincidir");
            }
            
        } catch (e) {
            if (error) {
                // Error de GraphQL o error de red
                if (error.graphQLErrors.length > 0) {
                    // Errores de GraphQL enviados desde el servidor
                    Alert.alert("Error de servidor", "El correo ingresado ya esta registrado!");
                } else if (error.networkError) {
                    // Error de red, como un problema de conexión
                    Alert.alert("Error de red", error.networkError.message || "Problemas de conexión");
                } else {
                    // Otros tipos de errores no específicamente de red o GraphQL
                    Alert.alert("Error", error.message);
                }
            } else {
                // Error capturado en el try-catch que no es específico de GraphQL
                Alert.alert("Error", e.message);
            }
        }
    };

    const handleDateChange = (newDate) => {
        setFechaNacimiento(newDate); 
    };

    if (loading) return <Loading/>;

    return(

        <ScrollView>
        <View style = {styles.container}>

            <Text style = {styles.textoRegister}>
                Nombre 
            </Text>

            <TextInput 
            
                style = {styles.textInput}
                placeholder='Daniel'
                onChangeText={setNombre}
                value={nombre}
            />

            <Text style = {styles.textoRegister}>
                Apellidos
            </Text>

            <TextInput 
                style = {styles.textInput}
                placeholder='Muñoz'
                onChangeText={setApellidos}
                value={apellidos}
            />

            <Text style = {styles.textoRegister}>
                Fecha de Nacimiento
            </Text>

            <DateInput 
            onDateChange={handleDateChange}
            />

            <Text style = {styles.textoRegister}>
                Correo electronico
            </Text>

            <TextInput 
                style = {styles.textInput}
                placeholder='jhon@gmail.com'
                onChangeText={setEmail}
                value={email}
            />

            <Text style = {styles.textoRegister}>
                Contraseña
            </Text>

            <TextInput 
                style = {styles.textInput}
                placeholder='* * * * * * * *'
                onChangeText={setContrasenna}
                value={contrasenna}
            />

            <Text style = {styles.textoRegister}>
                Ingresa nuevamente
            </Text>

            <TextInput 
                style = {styles.textInput}
                placeholder='* * * * * * * *'
                onChangeText={setVerificaContrasenna}
                value={verficaContrasenna}
            />

            <ButtonRegister 
                onPress={handleRegister}
            />

        </View>
        </ScrollView>

    )
}

export default Register;