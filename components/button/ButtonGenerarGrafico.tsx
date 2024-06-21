import React from 'react';
import {Text, TouchableOpacity}  from "react-native";
import {LinearGradient} from 'expo-linear-gradient'
import styles from '../style/styles';


export default function ButtonGenerarGrafico ({ onPress }){
    return(
        <TouchableOpacity style = {styles.containerGrafico} onPress={onPress}>
            <LinearGradient
                colors={['#4c669f','#192f6a']}
                start={{x: 1, y:0}}
                end={{x:0 ,y:1}}
                style = {styles.buttonMarcarEntrada}>
                <Text style = {styles.text} >Generar grafico</Text>
            </LinearGradient>
        
        </TouchableOpacity>
    );
}