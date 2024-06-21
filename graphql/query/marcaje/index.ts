import { gql } from "@apollo/client";


export const CONSEGUIR_SEMANA = gql`
    query{
        verSemana{
            id
            timestamp
            tipo_marca
            horas_trabajadas
        }
    }
`

export const CONSEGUIR_RANGO_SEMANA = gql`
    query($rangoFechaInicio: String!, $rangoFechaFinal: String!){
        verRangoSemana(rangoFechaInicio: $rangoFechaInicio, rangoFechaFinal: $rangoFechaFinal){
            timestamp
            tipo_marca
            horas_trabajadas
        }
    }
`

export const CONSEGUIR_SEMANA_USUARIO_ID = gql`
    query($idUser: Float!){
        conseguirSemanaUsuarioID(idUser: $idUser){
            timestamp
            tipo_marca
            horas_trabajadas
        }
    }
`

export const CONSEGUIR_RANGO_SEMANA_USUARIO_ID = gql`
    query($idUser: Float!,$rangoFechaInicio: String!, $rangoFechaFinal: String!){
        conseguirRangoSemanaUsuarioID(idUser:$idUser, rangoFechaInicio:$rangoFechaInicio, rangoFechaFinal:$rangoFechaFinal){
            timestamp
            tipo_marca
            horas_trabajadas
        }
    }
`