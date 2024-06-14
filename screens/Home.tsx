import { View, Text,Alert} from "react-native";

//Botones de la pagina
import ButtonMarcarEntrada from "../components/button/ButtonMarcarEntrada";
import ButtonMarcarSalida from "../components/button/ButtonMarcarSalida";
import ButtonCerrarSesion from "../components/button/ButtonCerrarSesion";

//Estilos
import * as SecureStore from 'expo-secure-store';
import styles from "../components/style/styles";

//GraphQL
import { MARCAR_HORA } from "../graphql/mutations/horario";
import { clientMarcaje } from '../graphql/ApolloClienteContext';
import { useMutation} from '@apollo/client';

import Loading from "./Loading";

const Home = ({navigation}) =>{

    const [marcar, {loading}] = useMutation(MARCAR_HORA, {client: clientMarcaje});

    const handleMarcarEntrada = async () =>{
        console.log("Boton entrada")
        marcarHora("entrada");
    }

    const handleMarcarSalida = async () =>{
        console.log("Boton Salida")
        marcarHora("salida");
    }

    const handleCerrarSesion = async() =>{
        console.log("Cerrar Sesion")
        await SecureStore.deleteItemAsync('userToken');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    

    async function marcarHora(accion){
        try {
            const result = await marcar({
                variables:{
                    accion: accion
                }
            });
            if (result.data.marcarHora.tipo == 1) {
                Alert.alert("Exito!", result.data.marcarHora.message);
            } else {
                Alert.alert("Error!", result.data.marcarHora.message );
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

    return(
        <View>
            
            <View>
                <View>
                    <Text>Info Usuario  =</Text>
                </View>

                <View>
                    <Text>Cambiar Contraseña</Text>
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