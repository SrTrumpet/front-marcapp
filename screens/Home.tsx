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


const Home = ({navigation}) =>{


    const [marcarEntrada, {loading: loadingEntrada, error: errorEntrada,data: dataEntrada}] = useMutation(MARCAR_HORA, {client: clientMarcaje});


    const handleMarcarEntrada = async () =>{
        console.log("Boton entrada")
        try {
            const result = await marcarEntrada({
                variables:{
                    accion:"entrada"
                }
            });
            console.log(result.data)
            Alert.alert("Exito!", dataEntrada.data.message);
        } catch (errorEntrada) {
            Alert.alert("Error!",dataEntrada.message );
        }


    }

    const handleMarcarSalida = () =>{
        console.log("Boton Salida")
    }

    const handleCerrarSesion = async() =>{
        console.log("Cerrar Sesion")
        await SecureStore.deleteItemAsync('userToken');
        navigation.replace('Login');
    }

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