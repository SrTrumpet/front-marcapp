import React from 'react';
import {Text, TouchableOpacity}  from "react-native";
import {LinearGradient} from 'expo-linear-gradient'
import styles from '../style/styles';

export default function ButtonRangoFechas ({ onPress }){
    return(
        <TouchableOpacity style = {styles.containerButtonMarcaje} onPress={onPress}>
            <LinearGradient
                colors={['#4c669f','#192f6a']}
                start={{x: 1, y:0}}
                end={{x:0 ,y:1}}
                style = {styles.buttonMarcarEntrada}>
                <Text style = {styles.text} >Ver Semana</Text>
            </LinearGradient>
        
        </TouchableOpacity>
    );
}