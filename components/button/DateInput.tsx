import React, { useState } from 'react';
import { View, Button, Platform, TextInput, StyleSheet } from 'react-native';
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
        <View style = {styles.viewButton}>
        <Button onPress={showDatepicker} title="Fecha de Nacimiento" />
        </View>
        <TextInput
        style={styles.input}
        value={date.toLocaleDateString()}
        editable={false}
        onTouchStart={showDatepicker} 
    />
    {show && (
        <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
        />
        )}
    </View>
);
};

const styles = StyleSheet.create({
    input: {
    height: 40,
    padding: 10,
    paddingStart: 30,
    width: 340,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#fff'
    },

    viewButton: {
        marginTop: 30
    }
});

export default DateInput;