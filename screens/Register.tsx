import React, {useState} from "react";
import { TextInput, Text, View, ScrollView} from "react-native";
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

    const handleRegister = () =>{
        console.log("Datos ingresados:", {nombre, apellidos,fechaNacimiento, email, contrasenna, verficaContrasenna });
    }

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


            <DateInput onDateChange={handleDateChange}
                
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