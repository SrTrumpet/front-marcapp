import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateInput = ({ onDateChange }) => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        onDateChange(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    return (
        <View>
            <TouchableOpacity onPress={showDatepicker} style={styles.input}>
                <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={false}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        marginTop:20,
        height: 40,
        padding: 10,
        paddingStart: 30,
        width: 340,
        marginBottom: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center', // Centra el texto verticalmente
    },
    viewButton: {
        marginTop: 30
    }
});

export default DateInput;
