import { gql } from "@apollo/client";

export const MARCAR_HORA = gql`
    mutation marcarHora($accion: String!){
    marcarHora(accion:$accion){
        message
    }
}
`

