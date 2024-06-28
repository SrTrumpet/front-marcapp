// Graficos.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
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

const GraficoAnual = ({ navigation }) => {
    const [userId1, setUserId1] = useState("");
    const [userId2, setUserId2] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [fetchData1, { loading: loading1, data: graphData1 }] = useLazyQuery(CONSEGUIR_RANGO_SEMANA_USUARIO_ID, { client: clientMarcaje });
    const [fetchData2, { loading: loading2, data: graphData2 }] = useLazyQuery(CONSEGUIR_RANGO_SEMANA_USUARIO_ID, { client: clientMarcaje });

    useEffect(() => {
        if (graphData1 && graphData1.conseguirRangoSemanaUsuarioID) {
            const monthsMap = initializeMonths();
            graphData1.conseguirRangoSemanaUsuarioID.forEach((item) => {
                const month = getMonth(item.timestamp.split(' ')[0]);
                if (monthsMap[month] !== undefined) {
                    monthsMap[month].totalHoras += item.horas_trabajadas;
                    monthsMap[month].diasTrabajados++;
                }
            });
            setData1(Object.keys(monthsMap).map(key => monthsMap[key].totalHoras / (monthsMap[key].diasTrabajados || 1)));
        }
    }, [graphData1]);

    useEffect(() => {
        if (graphData2 && graphData2.conseguirRangoSemanaUsuarioID) {
            const monthsMap = initializeMonths();
            graphData2.conseguirRangoSemanaUsuarioID.forEach((item) => {
                const month = getMonth(item.timestamp.split(' ')[0]);
                if (monthsMap[month] !== undefined) {
                    monthsMap[month].totalHoras += item.horas_trabajadas;
                    monthsMap[month].diasTrabajados++;
                }
            });
            setData2(Object.keys(monthsMap).map(key => monthsMap[key].totalHoras / (monthsMap[key].diasTrabajados || 1)));
        }
    }, [graphData2]);

    const initializeMonths = () => {
        return {
            Enero: { totalHoras: 0, diasTrabajados: 0 },
            Febrero: { totalHoras: 0, diasTrabajados: 0 },
            Marzo: { totalHoras: 0, diasTrabajados: 0 },
            Abril: { totalHoras: 0, diasTrabajados: 0 },
            Mayo: { totalHoras: 0, diasTrabajados: 0 },
            Junio: { totalHoras: 0, diasTrabajados: 0 },
            Julio: { totalHoras: 0, diasTrabajados: 0 },
            Agosto: { totalHoras: 0, diasTrabajados: 0 },
            Septiembre: { totalHoras: 0, diasTrabajados: 0 },
            Octubre: { totalHoras: 0, diasTrabajados: 0 },
            Noviembre: { totalHoras: 0, diasTrabajados: 0 },
            Diciembre: { totalHoras: 0, diasTrabajados: 0 },
        };
    };

    const getMonth = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        const date = new Date(year, month - 1, day);
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return months[date.getMonth()];
    };

    const handleDateRangeChange = (inicio, final) => {
        setFechaInicio(moment(inicio).tz('America/Santiago').format('DD-MM-YYYY'));
        setFechaFinal(moment(final).tz('America/Santiago').format('DD-MM-YYYY'));
    };

    const handleGenerateGraph = () => {
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
                            labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                            datasets: [
                                {
                                    data: data1.length ? data1 : Array(12).fill(0),
                                    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Color para usuario 1
                                    strokeWidth: 2, 
                                },
                                {
                                    data: data2.length ? data2 : Array(12).fill(0),
                                    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Color para usuario 2
                                    strokeWidth: 2, 
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

export default GraficoAnual;
