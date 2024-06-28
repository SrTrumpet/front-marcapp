// Graficos.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useLazyQuery } from "@apollo/client";
import moment from "moment-timezone";

// GRAPHQL
import { CONSEGUIR_RANGO_SEMANA_USUARIO_ID } from "../graphql/query/marcaje";
import { clientMarcaje } from "../graphql/ApolloClienteContext";

// STYLES
import Loading from "./Loading";
import ButtonGenerarGrafico from "../components/button/ButtonGenerarGrafico";
import DateRangeInput from "../components/button/DateRangeInput";

import { useToast } from "react-native-toast-notifications";

const Graficos = ({ navigation }) => {
    const [userId1, setUserId1] = useState("");
    const [userId2, setUserId2] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [fetchData1, { loading: loading1, data: graphData1 }] = useLazyQuery(CONSEGUIR_RANGO_SEMANA_USUARIO_ID, { client: clientMarcaje });
    const [fetchData2, { loading: loading2, data: graphData2 }] = useLazyQuery(CONSEGUIR_RANGO_SEMANA_USUARIO_ID, { client: clientMarcaje });
    const toast = useToast();

    useEffect(() => {
        if (graphData1 && graphData1.conseguirRangoSemanaUsuarioID) {
            const daysMap = initializeWeekDays();
            graphData1.conseguirRangoSemanaUsuarioID.forEach((item) => {
                const day = getWeekday(item.timestamp.split(' ')[0]);
                if (daysMap[day] !== undefined) {
                    daysMap[day].horasTrabajadas += item.horas_trabajadas;
                }
            });
            setData1(Object.keys(daysMap).map(key => daysMap[key].horasTrabajadas));
        }
    }, [graphData1]);

    useEffect(() => {
        if (graphData2 && graphData2.conseguirRangoSemanaUsuarioID) {
            const daysMap = initializeWeekDays();
            graphData2.conseguirRangoSemanaUsuarioID.forEach((item) => {
                const day = getWeekday(item.timestamp.split(' ')[0]);
                if (daysMap[day] !== undefined) {
                    daysMap[day].horasTrabajadas += item.horas_trabajadas;
                }
            });
            setData2(Object.keys(daysMap).map(key => daysMap[key].horasTrabajadas));
        }
    }, [graphData2]);

    const initializeWeekDays = () => {
        return {
            lunes: { horasTrabajadas: 0 },
            martes: { horasTrabajadas: 0 },
            miércoles: { horasTrabajadas: 0 },
            jueves: { horasTrabajadas: 0 },
            viernes: { horasTrabajadas: 0 },
        };
    };

    const getWeekday = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        const date = new Date(year, month - 1, day);
        const weekdays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        return weekdays[date.getDay()];
    };

    const handleDateRangeChange = (inicio, final) => {
        setFechaInicio(moment(inicio).tz('America/Santiago').format('DD-MM-YYYY'));
        setFechaFinal(moment(final).tz('America/Santiago').format('DD-MM-YYYY'));
    };

    const handleGenerateGraph = () => {
        const startDate = moment(fechaInicio, 'DD-MM-YYYY');
        const endDate = moment(fechaFinal, 'DD-MM-YYYY');
        const differencia = endDate.diff(startDate, 'days');

        if (differencia > 7) {
            toast.show("El rango de fechas no puede ser mayor a una semana", { type: "danger" });
            return;
        } 

        const parsedUserId1 = parseFloat(userId1);
        const parsedUserId2 = parseFloat(userId2);

        if (!isNaN(parsedUserId1) && !isNaN(parsedUserId2)) {
            fetchData1({
                variables: {
                    idUser: parsedUserId1,
                    rangoFechaInicio: fechaInicio,
                    rangoFechaFinal: fechaFinal,
                },
            });
            fetchData2({
                variables: {
                    idUser: parsedUserId2,
                    rangoFechaInicio: fechaInicio,
                    rangoFechaFinal: fechaFinal,
                },
            });
        } else {
            alert("Por favor, ingrese IDs de usuario válidos.");
        }
    };

    if (loading1 || loading2) return <Loading />;

    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Ingrese ID de usuario 1"
                    value={userId1}
                    onChangeText={setUserId1}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ingrese ID de usuario 2"
                    value={userId2}
                    onChangeText={setUserId2}
                    keyboardType="numeric"
                />
            </View>
            <DateRangeInput onDateRangeChange={handleDateRangeChange} />
            {loading1 || loading2 ? <Text>Cargando...</Text> : (
                <>
                    <LineChart
                        data={{
                            labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
                            datasets: [
                                {
                                    data: data1.length ? data1 : [0, 0, 0, 0, 0],
                                    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Color para usuario 1
                                    strokeWidth: 2, // optional
                                },
                                {
                                    data: data2.length ? data2 : [0, 0, 0, 0, 0],
                                    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Color para usuario 2
                                    strokeWidth: 2, // optional
                                },
                            ],
                        }}
                        width={Dimensions.get("window").width - 30}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix="h"
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726",
                            },
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                    <View style={styles.legend}>
                        <Text style={{ color: 'red' }}>ID {userId1} (Rojo)</Text>
                        <Text style={{ color: 'blue' }}>ID {userId2} (Azul)</Text>
                    </View>
                </>
            )}
            <ButtonGenerarGrafico onPress={handleGenerateGraph} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginHorizontal: 5,
        paddingHorizontal: 10,
    },
    legend: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
});

export default Graficos;
