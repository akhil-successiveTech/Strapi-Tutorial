// src/lib/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:1337/graphql", // Strapi GraphQL endpoint
    // You can add headers if needed, e.g., Authorization
    // headers: { Authorization: `Bearer ${TOKEN}` }
  }),
  cache: new InMemoryCache(),
});

export default client;
