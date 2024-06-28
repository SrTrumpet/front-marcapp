import { View, Text,Alert} from "react-native";
import { useEffect } from "react";
//GPS
import * as Location from 'expo-location';
//Botones de la pagina
import ButtonMarcarEntrada from "../components/button/ButtonMarcarEntrada";
import ButtonMarcarSalida from "../components/button/ButtonMarcarSalida";
import ButtonCerrarSesion from "../components/button/ButtonCerrarSesion";
import ButtonCambiarInfo from "../components/button/ButtonCambiarInfo";
import ButtonVerSemana from "../components/button/ButtonVerSemana";
//Estilos
import * as SecureStore from 'expo-secure-store';
import stylesHome from "../components/style/stylesHome";
import styles from "../components/style/styles";
import Loading from "./Loading";
//GraphQL
import { MARCAR_HORA } from "../graphql/mutations/horario";
import { OBTENER_INFO } from "../graphql/query/auth";
import { clientMarcaje, clientUsuarios } from '../graphql/ApolloClienteContext';
import { useMutation, useQuery} from '@apollo/client';
//LOGICA
import { getDistanceFromLatLonInM } from "../utils/geolocalizacion/locationUtils";
const RADIO_PERMITIDO = 200;
//NOTIFICACIONES
import { useToast } from "react-native-toast-notifications";

const Home = ({navigation}) =>{
    const [marcar, {loading}] = useMutation(MARCAR_HORA, {client: clientMarcaje});
    const{data:infoUsuario, error: errorUsuario, refetch: refetchUsuario} = useQuery(OBTENER_INFO,{ client: clientUsuarios});

    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await clientUsuarios.resetStore();
                await refetchUsuario();
            } catch (error) {
                console.error("Error al reiniciar el store o refetch:", error);
                toast.show("Hubo un problema al obtener la información del usuario.", {type: "danger"});
            }
        };
        fetchData();
    }, [infoUsuario]);

    const handleVerSemana = async () =>{
        console.log("Usuario presiono el boton de ver la semana");
        await clientMarcaje.resetStore();
        navigation.navigate("Rango Semana");
    }

    const handleMarcarEntrada = async () =>{
        console.log("Usuario presionó Boton entrada");
        marcarHora("entrada");
    }

    const handleMarcarSalida = async () =>{
        console.log("Usuario presionó Boton Salida");
        marcarHora("salida");
    }

    const handleCerrarSesion = async() =>{
        await SecureStore.deleteItemAsync('userToken');
        //toast.show("Se cerró la sesion",{type:"success"});
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
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                toast.show("Necesitamos permisos de ubicación para continuar",{type:"danger"});
                return;
            }

            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            const { latitude, longitude } = location.coords;
            const distancia = getDistanceFromLatLonInM(-29.964867, -71.349269, latitude, longitude);

            if (distancia > RADIO_PERMITIDO) {
                toast.show("Debe estar dentro de 500 metros de la empresa para marcar la hora.",{type:"danger"});
                return;
            }

            var ubicacion = latitude+","+longitude;

            const result = await marcar({
                variables: {
                    accion: accion,
                    ubicacion: ubicacion
                }
            });

            if (result.data.marcarHora.tipo == 1) {
                toast.show(result.data.marcarHora.message,{type:"success"});
            } else {
                toast.show(result.data.marcarHora.message,{type:"warning"});
            }
        } catch (errorEntrada) {
            toast.show("Tu tiempo de sesion a expirado, vuelve a iniciar sesion para marcar tu hora",{type:"warning"});
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
                <ButtonVerSemana onPress={handleVerSemana}/>
                <ButtonMarcarEntrada onPress={handleMarcarEntrada}/>
                <ButtonMarcarSalida onPress={handleMarcarSalida}/>
                <ButtonCerrarSesion onPress={handleCerrarSesion}/>
            </View>
        </View>
    )
}

export default Home;