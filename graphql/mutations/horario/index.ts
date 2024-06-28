import { gql } from "@apollo/client";

export const MARCAR_HORA = gql`
    mutation marcarHora($accion: String!, $ubicacion:String!){
    marcarHora(accion:$accion, ubicacion:$ubicacion){
        message
        tipo
    }
}
`

export const MODIFICAR_HORA = gql`
    mutation modificarHora($id:Float!, $nuevaHora: String!, $nota:String!, $idUser: Float!, $tipoMarca:String!){
        modificarHora(id:$id, nuevaHora:$nuevaHora, nota:$nota, idUser:$idUser, tipoMarca:$tipoMarca){
            tipo
            message
        }
    }
`

