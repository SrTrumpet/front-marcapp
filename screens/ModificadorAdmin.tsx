import React, { useState } from 'react';
import { View, Text, TextInput, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-timezone';
import stylesModificador from '../components/style/styleModificador';
import ButtonModificadorAdmin from '../components/button/ButtonModificadorAdmin';
import { MODIFICAR_HORA } from '../graphql/mutations/horario';
import { useMutation } from '@apollo/client';
import { clientMarcaje } from '../graphql/ApolloClienteContext';
import Loading from './Loading';
import { useToast } from 'react-native-toast-notifications';

const ModificadorAdmin = ({ route }) => {
    const { idUser, timestamp, tipoMarca, id } = route.params;
    const [nota, setNota] = useState('');
    const [selectedTime, setSelectedTime] = useState(moment(timestamp, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'));
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [modificarHora, { loading }] = useMutation(MODIFICAR_HORA, { client: clientMarcaje });
    const toast = useToast();

    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        const formattedTime = moment(currentDate).format('HH:mm:ss');
        setShowTimePicker(Platform.OS === 'ios');
        setSelectedTime(formattedTime);
    };

    const showTimePickerModal = () => {
        setShowTimePicker(true);
    };

    const handleOnPressActualizar = async() => {
        const actualizarHora = moment(timestamp, 'DD-MM-YYYY').format('DD-MM-YYYY')+ " "+selectedTime;

        console.log("Hora formateada = ",actualizarHora);
        try {
            const resultado = await modificarHora({
                variables:{
                    id:parseFloat(id),
                    nuevaHora:actualizarHora,
                    nota: nota,
                    idUser: idUser,
                    tipoMarca: tipoMarca
                }
            })

            if (resultado.data.modificarHora.tipo === 1) {
                toast.show("Hora modificada exitosamente", { type: "success" });
            } else {
                toast.show("Error al modificar la hora: " + resultado.data.modificarHora.message, { type: "danger" });
            }
        } catch (error) {
            toast.show("Error al modificar la hora: " + error.message, { type: "danger" });
        }
    };

    if (loading) return <Loading />;

    return (
        <View style={stylesModificador.container}>
            <View style={stylesModificador.infoContainer}>
                <Text style={stylesModificador.label}>ID Usuario: {idUser}</Text>
                <Text style={stylesModificador.label}>ID Marcaje: {id}</Text>
                <Text style={stylesModificador.label}>Fecha: {moment(timestamp, 'DD-MM-YYYY').format('DD-MM-YYYY')}</Text>
                <Text style={stylesModificador.label}>Hora: {selectedTime}</Text>
                <Text style={stylesModificador.label}>Tipo de Marca: {tipoMarca}</Text>
            </View>

            <View style={stylesModificador.notaContainer}>
                <Text style={stylesModificador.label}>Agregar comentario al cambio de hora:</Text>
                <TextInput
                    style={stylesModificador.textNota}
                    placeholder="Agregar nota"
                    value={nota}
                    onChangeText={setNota}
                />
            </View>

            <View style={stylesModificador.buttonContainerHora}>
                <Button title="Seleccionar Hora" onPress={showTimePickerModal} color="#344340" />
            </View>

            <View style={stylesModificador.buttonContainer}>
                <ButtonModificadorAdmin onPress={handleOnPressActualizar} />
            </View>

            {showTimePicker && (
                <DateTimePicker
                testID="dateTimePicker"
                value={new Date(moment().format('YYYY-MM-DD') + 'T' + selectedTime)}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onTimeChange}
            />
            )}
        </View>
    );
};

export default ModificadorAdmin;
