import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateRangeInput = ({ onDateRangeChange }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);

    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStart(Platform.OS === 'ios');
        setStartDate(currentDate);
        onDateRangeChange(currentDate, endDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEnd(Platform.OS === 'ios');
        setEndDate(currentDate);
        onDateRangeChange(startDate, currentDate);
    };

    const showStartDatepicker = () => {
        setShowStart(true);
    };

    const showEndDatepicker = () => {
        setShowEnd(true);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={showStartDatepicker} style={styles.input}>
                <Text>{`Dia Inicio: ${startDate.toLocaleDateString()}`}</Text>
            </TouchableOpacity>
            {showStart && (
                <DateTimePicker
                    testID="dateTimePickerStart"
                    value={startDate}
                    mode="date"
                    is24Hour={false}
                    display="default"
                    onChange={onChangeStart}
                />
            )}
            <TouchableOpacity onPress={showEndDatepicker} style={styles.input}>
                <Text>{`Dia Final: ${endDate.toLocaleDateString()}`}</Text>
            </TouchableOpacity>
            {showEnd && (
                <DateTimePicker
                    testID="dateTimePickerEnd"
                    value={endDate}
                    mode="date"
                    is24Hour={false}
                    display="default"
                    onChange={onChangeEnd}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15
    },
    input: {
        marginTop: 20,
        height: 40,
        padding: 10,
        paddingStart: 30,
        width: 340,
        marginBottom: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    viewButton: {
        marginTop: 30,
    }
});

export default DateRangeInput;
