import { StyleSheet } from "react-native";


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
});

export default styles;