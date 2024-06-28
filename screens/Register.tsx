import React, {useState} from "react";
import { TextInput, Text, View, ScrollView} from "react-native";
import { useToast } from "react-native-toast-notifications";
//ESTILOS Y BOTONES
import styles from './../components/style/styles';
import ButtonRegister from '../components/button/ButtonRegister';
import DateInput from '../components/button/DateInput';
import Loading from "./Loading";
//GRAPHQL
import { useMutation } from "@apollo/client";
import { REGISTER } from "../graphql/mutations/auth";
import { clientUsuarios } from '../graphql/ApolloClienteContext';

const Register = ({navigation}) =>{
    const [nombre, setNombre]  = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
    const [contrasenna, setContrasenna] = useState('');
    const [verficaContrasenna, setVerificaContrasenna] = useState('');
    const [registerResponse,{loading,error}] = useMutation(REGISTER, { client: clientUsuarios });
    const toast = useToast();

    const handleRegister = async () => {
        if (!validarTexto()) {
            return;
        }
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
                toast.show("Felicidades, tu registro se completó", { type: "success" });
                navigation.navigate("Login");
            }else{
                toast.show("Las contraseñas debe coincidir",{type:"danger"});
            }
            
        } catch (e) {
            if (error) {
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

    const validarTexto = () => {
        if (nombre === '') {
            toast.show("Por favor, ingresa un nombre", { type: "danger" });
            return false;
        }
        if (apellidos === '') {
            toast.show("Por favor, ingresa un apellido", { type: "danger" });
            return false;
        }
        if (email === '') {
            toast.show("Por favor, ingresa un correo electrónico", { type: "danger" });
            return false;
        }
        if (contrasenna === '') {
            toast.show("Por favor, ingresa una contraseña", { type: "danger" });
            return false;
        }
        if (contrasenna.length < 6) {
            toast.show("La contraseña debe tener al menos 6 caracteres", { type: "danger" });
            return false;
        }
        if (emailError !== '') {
            toast.show(emailError, { type: "danger" });
            return false;
        }
        return true;
    };

    const validarCorreo = (email) => {
        if (!email.includes('@')) {
            setEmailError('El correo electrónico debe contener un "@"');
        } else if (!email.includes('.')) {
            setEmailError('El correo electrónico debe contener un dominio, como ".com"');
        } else {
            setEmailError('');
        }
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
                onEndEditing={() => validarCorreo(email)}
                value={email}
                keyboardType="email-address"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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