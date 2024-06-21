import React, {useState} from "react";
import { TextInput, Text, View, ScrollView, Alert} from "react-native";
import styles from './../components/style/styles';
import ButtonRegister from '../components/button/ButtonRegister';
import DateInput from '../components/button/DateInput';
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
    const toast = useToast();

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
                toast.show("Felicidades, tu registro se completó", { type: "success" });
                navigation.navigate("Login");
            }else{
                toast.show("Las contraseñas debe coincidir",{type:"danger"});
            }
            
        } catch (e) {
            if (error) {
                // Error de GraphQL o error de red
                if (error.graphQLErrors.length > 0) {
                    toast.show("El correo ingresado ya esta registrado!",{type:"danger"});
                } else if (error.networkError) {
                    toast.show(error.networkError.message || "Problemas de conexión",{type:"danger"});
                } else {
                    toast.show(error.message,{type:"danger"});
                }
            } else {
                toast.show(error.message,{type:"danger"});
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