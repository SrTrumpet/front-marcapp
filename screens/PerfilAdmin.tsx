import React, {useState,useEffect} from "react";
import { View, Text } from "react-native";
import styles from "../components/style/styles";
import ButtonCerrarSesion from "../components/button/ButtonCerrarSesion";
import * as SecureStore from 'expo-secure-store';

const PerfilAdmin = ({navigation}) =>{


    const handleCerrarSesion = async() =>{
        console.log("Cerrar Sesion")
        await SecureStore.deleteItemAsync('userToken');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    return(
        <View>
            <View>
                <Text style={styles.titulo}>Wena Wena</Text>
            </View>

            <View>
                <ButtonCerrarSesion onPress={handleCerrarSesion}/>
            </View>
        </View>
    )
}

export default PerfilAdmin;