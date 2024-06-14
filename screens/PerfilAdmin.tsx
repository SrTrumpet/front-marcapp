import React, {useEffect} from "react";
import { View, Text } from "react-native";
import styles from "../components/style/styles";
import ButtonCerrarSesion from "../components/button/ButtonCerrarSesion";
import * as SecureStore from 'expo-secure-store';
import stylesHome from "../components/style/stylesHome";
import { useQuery } from "@apollo/client";
import { OBTENER_INFO } from "../graphql/query/auth";
import { clientUsuarios } from '../graphql/ApolloClienteContext';

const PerfilAdmin = ({navigation}) =>{

    const{data:infoUsuario} = useQuery(OBTENER_INFO,{ client: clientUsuarios});

    useEffect(() => {
        clientUsuarios.resetStore();
    }, [infoUsuario])



    const handleCerrarSesion = async() =>{
        console.log("Cerrar Sesion")
        await SecureStore.deleteItemAsync('userToken');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }


    const nombreUsuario = infoUsuario?.conseguirInformacionUsuario?.nombre || '[Admin]';

    return(
        <View>
            <View style={stylesHome.contenedorSaludo}>
                <Text style={styles.subTitle}>Bienvenido, {nombreUsuario}</Text>
            </View>

            <View>
                <ButtonCerrarSesion onPress={handleCerrarSesion}/>
            </View>
        </View>
    )
}

export default PerfilAdmin;