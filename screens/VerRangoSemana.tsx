import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useQuery, useLazyQuery } from "@apollo/client";
import { clientMarcaje } from '../graphql/ApolloClienteContext';
import Loading from "./Loading";
import DateRangeInput from "../components/button/DateRangeInput";
import moment from "moment-timezone";
import ButtonRangoFechas from "../components/button/ButtonRangoFechas";
import { CONSEGUIR_RANGO_SEMANA, CONSEGUIR_SEMANA } from "../graphql/query/marcaje";
import stylesRangoSemanas from "../components/style/stylesRangoSemana";
import { useToast } from "react-native-toast-notifications";

const VerRangoSemana = ({ navigation }) => {
    const { loading, data, error } = useQuery(CONSEGUIR_SEMANA, { client: clientMarcaje });
    const [conseguirRangoFechas,{ loading:rangoFechasLoading, data:rangoFechasData, error: rangoFechasError}] = useLazyQuery(CONSEGUIR_RANGO_SEMANA, { client: clientMarcaje });
    const [marcajes, setMarcajes] = useState([]);
    const [fechaInicio, setStartDate] = useState('');
    const [fechaFinal, setEndDate] = useState('');
    const toast = useToast();

    const inicializarDiasSemana = () => {
        const semana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
        const diasMap = {};
        semana.forEach(day => {
            diasMap[day] = { entrada: '', salida: '', horasTrabajadas: 0, modificado: '', nota: '' };
        });
        return diasMap;
    };

    function conseguirDiasSemana(dateStr) {
        const [dia, mes, anno] = dateStr.split("-");
        const fecha = new Date(anno, mes - 1, dia); 
        const diasSemanas = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        return diasSemanas[fecha.getDay()];
    }
    
    useEffect(() => {
        const daysMap = inicializarDiasSemana(); 
    
        if (data && data.verSemana) {
            data.verSemana.forEach((item) => {
                const day = conseguirDiasSemana(item.timestamp.split(' ')[0]); 
                if (daysMap[day] !== undefined) {
                    if (item.tipo_marca === 'entrada') {
                        daysMap[day].entrada = item.timestamp.split(' ')[1];
                        daysMap[day].entradaModificado = item.modificado;
                        daysMap[day].entradaNota = item.nota;
                    } else if (item.tipo_marca === 'salida') {
                        daysMap[day].salida = item.timestamp.split(' ')[1];
                        daysMap[day].salidaModificado = item.modificado;
                        daysMap[day].salidaNota = item.nota;
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
            const daysMap = inicializarDiasSemana(); 

            rangoFechasData.verRangoSemana.forEach((item) => {
                const day = conseguirDiasSemana(item.timestamp.split(' ')[0]); 
                if (daysMap[day] !== undefined) {
                    if (item.tipo_marca === 'entrada') {
                        daysMap[day].entrada = item.timestamp.split(' ')[1];
                        daysMap[day].entradaModificado = item.modificado;
                        daysMap[day].entradaNota = item.nota;
                    } else if (item.tipo_marca === 'salida') {
                        daysMap[day].salida = item.timestamp.split(' ')[1];
                        daysMap[day].salidaModificado = item.modificado;
                        daysMap[day].salidaNota = item.nota;
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
        const startDate = moment(fechaInicio, 'DD-MM-YYYY');
        const endDate = moment(fechaFinal, 'DD-MM-YYYY');
        const differencia = endDate.diff(startDate, 'days');

        if (differencia > 7) {
            toast.show("El rango de fechas no puede ser mayor a una semana", { type: "danger" });
        } else {
            conseguirRangoFechas({ variables: { rangoFechaInicio: fechaInicio, rangoFechaFinal: fechaFinal } });
        }
    };

    const mostrarNota = (nota) => {
        Alert.alert("Nota del administrador", nota);
    };

    if (loading || rangoFechasLoading) return <Loading />;

    return (
        <View style={stylesRangoSemanas.container}>
            <DateRangeInput onDateRangeChange={handleDateRangeChange} />
            <View style={stylesRangoSemanas.headerRow}>
                <Text style={stylesRangoSemanas.headerCell}>Día</Text>
                <Text style={stylesRangoSemanas.headerCell}>Entrada</Text>
                <Text style={stylesRangoSemanas.headerCell}>Salida</Text>
                <Text style={stylesRangoSemanas.headerCell}>Horas de Trabajo</Text>
            </View>
            {marcajes.map((marcaje, index) => (
                <View key={index} style={stylesRangoSemanas.row}>
                    <Text style={stylesRangoSemanas.cell}>{marcaje.day}</Text>
                    <TouchableOpacity
                        style={[stylesRangoSemanas.cell, marcaje.entradaModificado === 'admin' && { backgroundColor: '#FFC1C1' }]}
                        onPress={() => mostrarNota(marcaje.entradaNota || 'Sin nota')}
                    >
                        <Text>{marcaje.entrada || '---'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[stylesRangoSemanas.cell, marcaje.salidaModificado === 'admin' && { backgroundColor: '#FFC1C1' }]}
                        onPress={() => mostrarNota(marcaje.salidaNota || 'Sin nota')}
                    >
                        <Text>{marcaje.salida || '---'}</Text>
                    </TouchableOpacity>
                    <Text style={stylesRangoSemanas.cell}>{marcaje.horasTrabajadas.toFixed(2)}</Text>
                </View>
            ))}
            <ButtonRangoFechas onPress={handleRangoFechas}/>
        </View>
    );
};

export default VerRangoSemana;
