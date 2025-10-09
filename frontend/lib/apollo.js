import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function createApolloClient() {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  return new ApolloClient({
    link: new HttpLink({
      uri: "http://localhost:1337/graphql",
      fetchOptions: { cache: "no-store" },
      headers: {
        Authorization: token ? token : "",
      },
    }),
    cache: new InMemoryCache(),
  });
}
