import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useQuery, useLazyQuery } from "@apollo/client";
import Loading from "./Loading";
import { CONSEGUIR_SEMANA_USUARIO_ID, CONSEGUIR_RANGO_SEMANA_USUARIO_ID } from "../graphql/query/marcaje";
import { clientMarcaje } from '../graphql/ApolloClienteContext';
import moment from "moment-timezone";
import DateRangeInput from "../components/button/DateRangeInput";
import ButtonRangoFechas from "../components/button/ButtonRangoFechas";

const Update = ({ route, navigation }) => {
    const { userId } = route.params;
    const { loading, data, error } = useQuery(CONSEGUIR_SEMANA_USUARIO_ID, {
        variables: { idUser: userId },
        client: clientMarcaje
    });
    const [conseguirRangoFechas, { loading: rangoFechasLoading, data: rangoFechasData, error: rangoFechasError }] = useLazyQuery(CONSEGUIR_RANGO_SEMANA_USUARIO_ID, { client: clientMarcaje });
    const [marcajes, setMarcajes] = useState([]);
    const [fechaInicio, setStartDate] = useState('');
    const [fechaFinal, setEndDate] = useState('');

    const initializeWeekDays = () => {
        const week = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
        const daysMap = {};
        week.forEach(day => {
            daysMap[day] = { entrada: '', salida: '', horasTrabajadas: 0 };
        });
        return daysMap;
    };

    const getWeekday = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        const date = new Date(year, month - 1, day); 
        const weekdays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        return weekdays[date.getDay()];
    };

    useEffect(() => {
        const daysMap = initializeWeekDays(); 
    
        if (data && data.conseguirSemanaUsuarioID) {
            data.conseguirSemanaUsuarioID.forEach((item) => {
                const day = getWeekday(item.timestamp.split(' ')[0]); 
                if (daysMap[day] !== undefined) {
                    if (item.tipo_marca === 'entrada') {
                        daysMap[day].entrada = item.timestamp.split(' ')[1];
                    } else if (item.tipo_marca === 'salida') {
                        daysMap[day].salida = item.timestamp.split(' ')[1]; 
                        daysMap[day].horasTrabajadas = item.horas_trabajadas;
                    }
                }
            });
            setMarcajes(Object.keys(daysMap).map(key => ({
                day: key.charAt(0).toUpperCase() + key.slice(1),
                ...daysMap[key]
            })));
        }
    }, [data]);

    useEffect(() => {
        if (rangoFechasData && rangoFechasData.conseguirRangoSemanaUsuarioID) {
            const daysMap = initializeWeekDays();

            rangoFechasData.conseguirRangoSemanaUsuarioID.forEach((item) => {
                const day = getWeekday(item.timestamp.split(' ')[0]);
                if (daysMap[day] !== undefined) {
                    if (item.tipo_marca === 'entrada') {
                        daysMap[day].entrada = item.timestamp.split(' ')[1];
                    } else if (item.tipo_marca === 'salida') {
                        daysMap[day].salida = item.timestamp.split(' ')[1];
                        daysMap[day].horasTrabajadas = item.horas_trabajadas;
                    }
                }
            });
            setMarcajes(Object.keys(daysMap).map(key => ({
                day: key.charAt(0).toUpperCase() + key.slice(1),
                ...daysMap[key]
            })));
        }
    }, [rangoFechasData]);

    const handleDateRangeChange = (inicio, final) => {
        setStartDate(moment(inicio).tz('America/Santiago').format('DD-MM-YYYY'));
        setEndDate(moment(final).tz('America/Santiago').format('DD-MM-YYYY'));
    };

    const handleRangoFechas = () => {
        conseguirRangoFechas({ variables: { idUser: userId, rangoFechaInicio: fechaInicio, rangoFechaFinal: fechaFinal } });
    };

    if (loading || rangoFechasLoading) return <Loading />;
    if (error || rangoFechasError) return <Text>Error: {error?.message || rangoFechasError?.message}</Text>;

    return (
        <View style={styles.container}>
            <DateRangeInput onDateRangeChange={handleDateRangeChange} />
            
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Día</Text>
                <Text style={styles.headerCell}>Entrada</Text>
                <Text style={styles.headerCell}>Salida</Text>
                <Text style={styles.headerCell}>Horas de Trabajo</Text>
            </View>
            {marcajes.map((marcaje, index) => (
                <View key={index} style={styles.row}>
                    <Text style={styles.cell}>{marcaje.day}</Text>
                    <Text style={styles.cell}>{marcaje.entrada}</Text>
                    <Text style={styles.cell}>{marcaje.salida}</Text>
                    <Text style={styles.cell}>{marcaje.horasTrabajadas.toFixed(2)}</Text>
                </View>
            ))}
            <ButtonRangoFechas onPress={handleRangoFechas} />
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default Update;
