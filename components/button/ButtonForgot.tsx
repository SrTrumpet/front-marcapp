import React from 'react';
import {Text, TouchableOpacity}  from "react-native";
import {LinearGradient} from 'expo-linear-gradient'
import styles from '../style/styles';


export default function ButtonGradient ({ onPress }){
    return(
        <TouchableOpacity style = {styles.containerButton} onPress={onPress}>
            <LinearGradient
                colors={['#4c669f','#192f6a']}
                start={{x: 1, y:0}}
                end={{x:0 ,y:1}}
                style = {styles.buttonSession}>
                <Text style = {styles.text}>Enviar Correo</Text>
            </LinearGradient>
        
        </TouchableOpacity>
    );
}