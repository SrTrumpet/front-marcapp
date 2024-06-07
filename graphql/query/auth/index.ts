import { gql } from "@apollo/client";

export const VERIFICAR_TOKEN = gql`
    query{
        verificarInicioSesion
    }
`