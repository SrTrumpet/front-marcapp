import { View, Text,Alert} from "react-native";

//GPS
import * as Location from 'expo-location';

//Botones de la pagina
import ButtonMarcarEntrada from "../components/button/ButtonMarcarEntrada";
import ButtonMarcarSalida from "../components/button/ButtonMarcarSalida";
import ButtonCerrarSesion from "../components/button/ButtonCerrarSesion";
import ButtonCambiarInfo from "../components/button/ButtonCambiarInfo";

//Estilos
import * as SecureStore from 'expo-secure-store';
import stylesHome from "../components/style/stylesHome";
import styles from "../components/style/styles";

//GraphQL
import { MARCAR_HORA } from "../graphql/mutations/horario";
import { clientMarcaje, clientUsuarios } from '../graphql/ApolloClienteContext';
import { useMutation, useQuery} from '@apollo/client';

import Loading from "./Loading";
import { useEffect } from "react";
import { OBTENER_INFO } from "../graphql/query/auth";
import { getDistanceFromLatLonInM } from "../utils/geolocalizacion/locationUtils";

const RADIO_PERMITIDO = 100;

const Home = ({navigation}) =>{

    const [marcar, {loading}] = useMutation(MARCAR_HORA, {client: clientMarcaje});
    const{data:infoUsuario} = useQuery(OBTENER_INFO,{ client: clientUsuarios});

    useEffect(() => {
        clientUsuarios.resetStore();
    }, [infoUsuario])

    const handleMarcarEntrada = async () =>{
        console.log("Usuario presionó Boton entrada")
        marcarHora("entrada");
    }

    const handleMarcarSalida = async () =>{
        console.log("Usuario presionó Boton Salida")
        marcarHora("salida");
    }

    const handleCerrarSesion = async() =>{
        console.log("Usuario presionó Cerrar Sesion")
        await SecureStore.deleteItemAsync('userToken');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    const handleCambiarInfo = async() =>{
        console.log("Usuario cambio a la pagina Perfil");
        navigation.navigate('Perfil');
    }

    async function marcarHora(accion){
        try {
            // Solicitar permisos de ubicación
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos permisos de ubicación para continuar');
                return;
            }
    
            // Obtener la ubicación actual
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            const { latitude, longitude } = location.coords;

            console.log("Coordenadas",latitude,longitude);

            const distancia = getDistanceFromLatLonInM(-29.982261, -71.348828, latitude, longitude);

            if (distancia > RADIO_PERMITIDO) {
                Alert.alert("Error", "Debe estar dentro de 100 metros del centro para marcar la hora.");
                return;
            }
    
            // Usar la latitud y longitud en la mutación
            const result = await marcar({
                variables: {
                    accion: accion,
                }
            });
    
            if (result.data.marcarHora.tipo == 1) {
                Alert.alert("Exito!", result.data.marcarHora.message);
            } else {
                Alert.alert("Error!", result.data.marcarHora.message);
            }
        } catch (errorEntrada) {
            Alert.alert("Error!", "Tu tiempo de sesion a expirado, vuelve a iniciar sesion para marcar tu hora" );
            await SecureStore.deleteItemAsync('userToken');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    }

    if (loading) return <Loading/>;

    const nombreUsuario = infoUsuario?.conseguirInformacionUsuario?.nombre || '[Usuario]';

    return(
        <View>
            
            <View>
                <View style={stylesHome.contenedorSaludo}>
                    <Text style = {stylesHome.saludo}>Hola, {nombreUsuario}</Text>
                </View>

                <View>
                    <ButtonCambiarInfo onPress={handleCambiarInfo}/>
                </View>
            </View>

            <View style={styles.contenedorBotonesMarcaje}>
                <ButtonMarcarEntrada onPress={handleMarcarEntrada}/>
                <ButtonMarcarSalida onPress={handleMarcarSalida}/>
                <ButtonCerrarSesion onPress={handleCerrarSesion}/>
            </View>

        </View>
    )
}

export default Home;