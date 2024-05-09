import { gql } from "@apollo/client";

export const INICIO_SESION = gql`
    query InicioSesion{
        veriUser{
            email
            pass
        }
    }

`