import { createContext } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from '../utils/tokenStorage';

const httpLinkUsuarios = new HttpLink({ uri: 'http://192.168.201.234:3000/graphql' });
const httpLinkMarcaje = new HttpLink({ uri: 'http://192.168.201.234:3001/graphql' });

const authLink = setContext(async (_, { headers }) => {
    const token = await getToken();
    return {
    headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
    }
};
});

export const clientUsuarios = new ApolloClient({
    link: ApolloLink.from([authLink, httpLinkUsuarios]),
    cache: new InMemoryCache(),
});
export const clientMarcaje = new ApolloClient({
    link: ApolloLink.from([authLink, httpLinkMarcaje]),
    cache: new InMemoryCache(),
});
  
export const ApolloClientsContext = createContext({ clientUsuarios, clientMarcaje });

