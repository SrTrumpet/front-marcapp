import { View, Text, Button} from "react-native";

//Botones de la pagina
import ButtonGradient from "../ButtonGradient";
import ButtonMarcarEntrada from "../components/button/ButtonMarcarEntrada";
import ButtonMarcarSalida from "../components/button/ButtonMarcarSalida";
import ButtonCerrarSesion from "../components/button/ButtonCerrarSesion";

//Estilos
import * as SecureStore from 'expo-secure-store';
import styles from "../components/style/styles";

const Home = ({navigation}) =>{

    const handleMarcarEntrada = () =>{
        console.log("Boton entrada")
    }

    const handleMarcarSalida = () =>{
        console.log("Boton Salida")
    }

    const handleCerrarSesion = async() =>{
        console.log("Cerrar Sesion")
        await SecureStore.deleteItemAsync('userToken');
        navigation.navigate("Login");
    }

    return(
        <View>
            
            <View>
                <View>
                    <Text>Wenas Socio</Text>
                </View>

                <View>
                    <Text>Hola</Text>
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