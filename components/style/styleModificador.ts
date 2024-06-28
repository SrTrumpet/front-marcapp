import { StyleSheet } from 'react-native';

const stylesModificador = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        color: 'grey',
        marginBottom: 10,
        textAlign: 'center',
    },
    notaContainer: {
        marginBottom: 20,
        width: '80%',
    },
    textNota: {
        padding: 10,
        paddingStart: 30,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'gray',
    },
    buttonContainerHora: {
        marginTop: 20,
        width: '80%',
        borderRadius: 30,
        overflow: 'hidden',
    },
    buttonContainer: {
        marginTop: 20,
        width: '80%',
        borderRadius: 30,
        overflow: 'hidden',
    },
});

export default stylesModificador;
