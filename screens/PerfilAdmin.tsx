import React, {useEffect,useState, useRef} from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

//STYLES
import styles from "../components/style/styles";
import ButtonCerrarSesion from "../components/button/ButtonCerrarSesion";
import stylesHome from "../components/style/stylesHome";

//GRAPHQL
import { useQuery, useLazyQuery } from "@apollo/client";
import { OBTENER_INFO } from "../graphql/query/auth";
import { BUSCAR_USUARIOS } from "../graphql/query/users";
import { clientUsuarios } from '../graphql/ApolloClienteContext';

//TOKEN
import * as SecureStore from 'expo-secure-store';
import stylesPerfil from "../components/style/strylePerfil";
import Loading from "./Loading";


const PerfilAdmin = ({navigation}) =>{

    const{data:infoUsuario} = useQuery(OBTENER_INFO,{ client: clientUsuarios});
    const [search, setSearch] = useState("");
    const [getUsers, { data: usersData, loading:userLoading }] = useLazyQuery(BUSCAR_USUARIOS, {variables: { name: search }, client: clientUsuarios})

    useEffect(() => {
        clientUsuarios.resetStore();
    }, [infoUsuario])



    const handleCerrarSesion = async() =>{
        console.log("Cerrar Sesion")
        await SecureStore.deleteItemAsync('userToken');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    const handleUserPress = (userId) => {
        console.log("Usuario seleccionado:", userId);
        // Falta la logica
    };

    const onSubmit = () => {
        getUsers();
        setSearch(''); // Limpiar el campo de búsqueda después de enviar
    };

    const nombreUsuario = infoUsuario?.conseguirInformacionUsuario?.nombre || '[Admin]';

    if(userLoading) return <Loading/>

    return(
        <View>
            <View style={stylesHome.contenedorSaludo}>
                <Text style={styles.subTitle}>Bienvenido, {nombreUsuario}</Text>
            </View>

            <TextInput
                style={stylesPerfil.input}
                placeholder="Buscar usuario por nombre"
                onChangeText={setSearch}
                onSubmitEditing={() => getUsers()}
                 // Ejecuta la búsqueda cuando el usuario envía el texto
            />

            <ScrollView style={{ marginTop: 20 }}>
                {usersData?.findUsersByName.map(user => (
                    <TouchableOpacity key={user.id} style={stylesPerfil.userItem} onPress={() => handleUserPress(user.id)}>
                        <Text>{user.id} - {user.name} - {user.email}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View>
                <ButtonCerrarSesion onPress={handleCerrarSesion}/>
            </View>
        </View>
    )
}

export default PerfilAdmin;