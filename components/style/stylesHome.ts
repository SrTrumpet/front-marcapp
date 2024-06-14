import { StyleSheet } from "react-native";

const stylesHome = StyleSheet.create({

    contenedorSaludo: {
        // Asegura que el contenedor use todo el espacio disponible
        alignItems: 'center', // Centra horizontalmente
        justifyContent: 'center', // Centra verticalmente
        marginTop: 10, // Ajusta este valor según necesites para el espacio superior
    },
    
    saludo: {
        fontSize: 25,
        color: 'lightgrey',
    },

    containerButtonActualizar:{
        marginTop: 10
    },


});

export default stylesHome;