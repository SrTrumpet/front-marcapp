import { StyleSheet } from "react-native";
import { idText } from "typescript";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
        justifyContent: 'center',
    },

    titulo:{
        fontSize: 80,
        color: '#344340',
        fontWeight: 'bold'
    },

    subTitle: {
        fontSize: 20,
        color: 'grey'
    },

    textInput: {
        padding : 10,
        paddingStart: 30,
        width: '80%',
        height: 50,
        marginTop: 20,
        borderRadius: 30,
        backgroundColor: '#fff'
    },

    text: {
        color : "#fff",
    },

    containerButton: {
        marginTop: 80
    },

    containerButtonMarcaje:{
        marginTop: 20
    },

    contenedorBotonesMarcaje: {
        top:220,
        padding: 20, // Agrega un poco de espacio alrededor
    },

    containerButtonSesion:{
        marginTop: 80
    },

    buttonSession: {
        width: '90%',
        height: 50,
        borderRadius: 30,
        padding:13
    },

    textNavegaation:{
        top:20,
        color : 'black'
    },

    linkText:{
        padding: 10,
        color: 'blue',
        marginTop: 40
    },

    textForgotPass:{
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },

    containerOlvido: {
        marginTop: 20
    },

    textoRegister:{
        marginTop: 10
    },

    containerButtonRegister: {
        marginTop: 20
    },

    buttonMarcarEntrada:{
        height: 50,
        borderRadius: 30,
        width:'80%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    }
});

export default styles;