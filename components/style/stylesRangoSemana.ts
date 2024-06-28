import { StyleSheet } from "react-native";

const stylesRangoSemanas = StyleSheet.create ({
    container: {
        flex: 1,
        marginTop: 5,
    },
    headerRow: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#ddd'
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold' 
    },
    cell: {
        flex: 1,
    }
})

export default stylesRangoSemanas;