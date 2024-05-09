import { gql } from "@apollo/client"

export const LOGIN_MUTATION = gql`
mutation{
    login(email:"elias.manque.o@gmail.com", password:"bb783dec32101121"){
        tocken
    }
}
`;