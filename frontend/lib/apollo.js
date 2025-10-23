// src/lib/apollo.js
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

export function createApolloClient() {
  // Defined the link of graphQL
  const httpLink = new HttpLink({ uri: "http://localhost:1337/graphql" });

  // Extracting token from localstorage and adding the header
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
    // First goes to the authLink and then to httpLink
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
