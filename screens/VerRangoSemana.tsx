//REACT
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

//GRAPHQL
import { useQuery, useLazyQuery } from "@apollo/client";
import { clientMarcaje } from '../graphql/ApolloClienteContext';

//LOGICA Y PAGINAS
import Loading from "./Loading";
import DateRangeInput from "../components/button/DateRangeInput";
import moment from "moment-timezone";
import ButtonRangoFechas from "../components/button/ButtonRangoFechas";

//QUERYS
import { CONSEGUIR_RANGO_SEMANA } from "../graphql/query/marcaje";
import { CONSEGUIR_SEMANA } from "../graphql/query/marcaje";


const VerRangoSemana = ({ navigation }) => {
    const { loading, data, error } = useQuery(CONSEGUIR_SEMANA, { client: clientMarcaje });
    const [conseguirRangoFechas,{ loading:rangoFechasLoading, data:rangoFechasData, error: rangoFechasError}] = useLazyQuery(CONSEGUIR_RANGO_SEMANA, { client: clientMarcaje });
    const [marcajes, setMarcajes] = useState<{ day: string, entrada: string, salida: string, horasTrabajadas: number }[]>([]);
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

    function getWeekday(dateStr) {
        const [day, month, year] = dateStr.split("-");
        const date = new Date(year, month - 1, day); 
        const weekdays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        return weekdays[date.getDay()];
    }
    
    useEffect(() => {
        const daysMap = initializeWeekDays(); 
    
        if (data && data.verSemana) {
            data.verSemana.forEach((item) => {
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
        if (rangoFechasData && rangoFechasData.verRangoSemana) {
            const daysMap = initializeWeekDays(); 

            rangoFechasData.verRangoSemana.forEach((item) => {
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

    const handleRangoFechas = () =>{
        conseguirRangoFechas({ variables: { rangoFechaInicio: fechaInicio, rangoFechaFinal: fechaFinal } });
    }

    if (loading || rangoFechasLoading) return <Loading />;

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
            <ButtonRangoFechas onPress={handleRangoFechas}/>
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

export default VerRangoSemana;
