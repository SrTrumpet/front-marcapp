import React from 'react';
import {Text, TouchableOpacity}  from "react-native";
import {LinearGradient} from 'expo-linear-gradient'
import styles from '../style/styles';


export default function ButtonCerrarSesion ({ onPress }){
    return(
        <TouchableOpacity style = {styles.containerButtonSesion} onPress={onPress}>
            <LinearGradient
                colors={['#ff4e50', '#ff0000']}
                start={{x: 1, y:0}}
                end={{x:0 ,y:1}}
                style = {styles.buttonMarcarEntrada}>
                <Text style = {styles.text} >Cerrar Sesion</Text>
            </LinearGradient>
        
        </TouchableOpacity>
    );
}