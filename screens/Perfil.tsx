//REACT
import React, {useState,useEffect} from "react";
import { View, Text, TextInput, Alert } from "react-native";
//STYLES
import styles from "../components/style/styles";
import stylesHome from "../components/style/stylesHome";
import stylesPerfil from "../components/style/strylePerfil";
//BOTONES
import ButtonCambiarInfo from "../components/button/ButtonCambiarInfo";
//QUERYS Y GRAPHQL
import { useMutation, useQuery } from "@apollo/client";
import { ACTUALIZAR_DATOS } from "../graphql/query/users";
import { OBTENER_INFO } from "../graphql/query/auth";
import { clientUsuarios } from "../graphql/ApolloClienteContext";
//SCREENS
import Loading from "./Loading";

const Perfil = ({navigation}) =>{
    const [nombre, setNombre]  = useState('');
    const [contrasenna, setContrasenna] = useState('');
    const [actualizarDatos,{loading, data,error}] = useMutation(ACTUALIZAR_DATOS, {client:clientUsuarios});
    const {data:infoUsuario} = useQuery(OBTENER_INFO,{ client: clientUsuarios});

    useEffect(() => {
        clientUsuarios.resetStore();
    }, [infoUsuario])

    const handleGuardar = async () =>{
        console.log("El usuario presiono el boton de actualizar datos");
        try {
            const result = await actualizarDatos({
                variables:{
                    nombre:nombre,
                    contrasenna:contrasenna
                }
            });
            Alert.alert("Atencion",result.data.actualizarInformacion.message);
            navigation.replace("Home");
        } catch (error) {
            console.log(error.message);
        }
    }

    if (loading) return <Loading/>;
    const nombreUsuario = infoUsuario?.conseguirInformacionUsuario?.nombre || '[Usuario]';

    return(
        <View>
            <View style={stylesHome.contenedorSaludo}>
                <Text style={styles.subTitle}>Actualizar informacion</Text>
            </View>

            <View style = {stylesPerfil.container}>
                <Text style = {styles.textoRegister}>
                    Nombre 
                </Text>

                <TextInput 
                    style = {styles.textInput}
                    placeholder={nombreUsuario}
                    onChangeText={setNombre}
                    value={nombre}
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
                </View>

                <ButtonCambiarInfo onPress={handleGuardar}/>
        </View>
    )
}

export default Perfil;