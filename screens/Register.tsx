import React, {useState} from "react";
import { TextInput, Text, View, ScrollView, Alert} from "react-native";
import styles from './../components/style/styles';
import ButtonRegister from '../components/button/ButtonRegister';
import DateInput from '../components/button/DateInput';
import axios from 'axios';





const Register = () =>{

    const [nombre, setNombre]  = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [contrasenna, setContrasenna] = useState('');
    const [verficaContrasenna, setVerificaContrasenna] = useState('');

    const handleRegister = async () => {
        if (!nombre.trim() || !apellidos.trim() || !email.trim() || !contrasenna.trim() || !verficaContrasenna.trim()) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }
    
        if (contrasenna !== verficaContrasenna) {
            Alert.alert("Error", "Las contraseñas no coinciden.");
            return; 
        }
    
        try {
            const response = await axios.post('http://192.168.133.26:3000/api/v1/auth/register', {
                name: nombre,
                apellidos: apellidos,
                nacimiento: fechaNacimiento,
                email: email,
                password: contrasenna
            });
            Alert.alert("Registro Exitoso", "Usuario creado correctamente.");
            console.log("Datos del token: ", response.data.token);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                Alert.alert("Fallo de Registro", error.response.data.message);
            } else if (error.request) {
                console.log(error.request);
                Alert.alert("Fallo de Registro", "No hay respuesta del servidor");
            } else {
                console.log('Error', error.message);
                Alert.alert("Fallo de Registro", error.message);
            }
        }
    };

    const handleDateChange = (newDate) => {
        setFechaNacimiento(newDate); 
    };


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