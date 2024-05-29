import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const Loading = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.text}>Cargando...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff'
    },
    text: {
        marginTop: 20,
        fontSize: 18
    }
});

export default Loading;
