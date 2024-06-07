import { gql } from "@apollo/client";


export const CONSULTAR_DATOS = gql`
    mutation InicioSesion($token: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`;