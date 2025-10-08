import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function createApolloClient() {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  return new ApolloClient({
    link: new HttpLink({
      uri: "/api/graphql",
      fetchOptions: { cache: "no-store" },
      headers: {
        Authorization: token ? token : "",
      },
    }),
    cache: new InMemoryCache(),
  });
}
