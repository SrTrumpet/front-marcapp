import { gql } from "@apollo/client";

export const MARCAR_HORA = gql`
    mutation marcarHora($accion: String!, $ubicacion:String!){
    marcarHora(accion:$accion, ubicacion:$ubicacion){
        message
        tipo
    }
}
`

