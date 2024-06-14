import { gql } from "@apollo/client";

export const ACTUALIZAR_DATOS = gql`
    mutation actualizarInfo($nombre:String!,$contrasenna:String!){
        actualizarInformacion(nombre:$nombre,contrasenna:$contrasenna){
            message
        }
    }
`