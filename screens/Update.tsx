import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useQuery, useLazyQuery } from "@apollo/client";
import Loading from "./Loading";
import { CONSEGUIR_SEMANA_USUARIO_ID, CONSEGUIR_RANGO_SEMANA_USUARIO_ID } from "../graphql/query/marcaje";
import { clientMarcaje } from '../graphql/ApolloClienteContext';
import moment from "moment-timezone";
import DateRangeInput from "../components/button/DateRangeInput";
import ButtonRangoFechas from "../components/button/ButtonRangoFechas";
import { useToast } from "react-native-toast-notifications";
import stylesUpdate from "../components/style/stylesUpdate";

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
    const toast = useToast();

    const initializeWeekDays = () => {
        const week = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
        const daysMap = {};
        week.forEach(day => {
            daysMap[day] = { entrada: '', salida: '', horasTrabajadas: 0, entradaId: -1, salidaId: -1 };
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
                        daysMap[day].entradaId = item.id;
                    } else if (item.tipo_marca === 'salida') {
                        daysMap[day].salida = item.timestamp.split(' ')[1];
                        daysMap[day].horasTrabajadas = item.horas_trabajadas;
                        daysMap[day].salidaId = item.id;
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
                        daysMap[day].entradaId = item.id;
                    } else if (item.tipo_marca === 'salida') {
                        daysMap[day].salida = item.timestamp.split(' ')[1];
                        daysMap[day].horasTrabajadas = item.horas_trabajadas;
                        daysMap[day].salidaId = item.id;
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
            conseguirRangoFechas({ variables: { idUser: userId, rangoFechaInicio: fechaInicio, rangoFechaFinal: fechaFinal } });
        }
    };

    const navigateToModificadorAdmin = (day, time, tipoMarca, id) => {
        const dayOfWeekMap = {
            "Lunes": 1,
            "Martes": 2,
            "Miércoles": 3,
            "Jueves": 4,
            "Viernes": 5
        };
        const dayOfWeek = dayOfWeekMap[day];
        const fecha = moment(fechaInicio, 'DD-MM-YYYY').day(dayOfWeek).format('DD-MM-YYYY');
        const timestamp = `${fecha} ${time || '00:00:00'}`;
        const marcajeId = id || -1;
        navigation.navigate('Modificador Admin', {
            idUser: userId,
            timestamp,
            tipoMarca,
            id: marcajeId
        });
    };

    if (loading || rangoFechasLoading) return <Loading />;
    if (error || rangoFechasError) return <Text>Error: {error?.message || rangoFechasError?.message}</Text>;

    return (
        <View style={stylesUpdate.container}>
            <DateRangeInput onDateRangeChange={handleDateRangeChange} />
            
            <View style={stylesUpdate.headerRow}>
                <Text style={stylesUpdate.headerCell}>Día</Text>
                <Text style={stylesUpdate.headerCell}>Entrada</Text>
                <Text style={stylesUpdate.headerCell}>Salida</Text>
                <Text style={stylesUpdate.headerCell}>Horas de Trabajo</Text>
            </View>
            {marcajes.map((marcaje, index) => (
                <View key={index} style={stylesUpdate.row}>
                    <Text style={stylesUpdate.cell}>{marcaje.day}</Text>
                    <TouchableOpacity
                        style={stylesUpdate.cell}
                        onPress={() => navigateToModificadorAdmin(marcaje.day, marcaje.entrada, 'entrada', marcaje.entradaId)}
                    >
                        <Text>{marcaje.entrada || '---'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={stylesUpdate.cell}
                        onPress={() => navigateToModificadorAdmin(marcaje.day, marcaje.salida, 'salida', marcaje.salidaId)}
                    >
                        <Text>{marcaje.salida || '---'}</Text>
                    </TouchableOpacity>
                    <Text style={stylesUpdate.cell}>{marcaje.horasTrabajadas.toFixed(2)}</Text>
                </View>
            ))}
            <ButtonRangoFechas onPress={handleRangoFechas} />
        </View>
    );
};

export default Update;
