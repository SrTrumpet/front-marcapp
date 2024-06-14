import { gql } from "@apollo/client";

export const VERIFICAR_TOKEN = gql`
    query{
        verificarInicioSesionVesionDos
    }
`

export const OBTENER_INFO = gql`
    query{
        conseguirInformacionUsuario{
            nombre
            correo
        }
    }
`

export const CONSEGUIR_ROL = gql`
    query{
        conseguirRol
    }
`