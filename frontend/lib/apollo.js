// src/lib/apollo.js
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

export function createApolloClient() {
  const httpLink = new HttpLink({ uri: "http://localhost:1337/graphql" });

  const authLink = new ApolloLink((operation, forward) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    operation.setContext({
      headers: {
        Authorization: token ? token : "",
      },
    });
    return forward(operation);
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
