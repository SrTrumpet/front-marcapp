import { StyleSheet } from "react-native";

const stylesPerfil = StyleSheet.create({
    container: {
        marginTop: 20,
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 30,
        borderColor: '#ccc',
        backgroundColor: '#fff'
    },
    userItem: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})

export default stylesPerfil;