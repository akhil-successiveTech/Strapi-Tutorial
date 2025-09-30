// src/components/ApolloProviderWrapper.js
"use client";

import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "../../lib/apollo";

export default function ApolloProviderWrapper({ children }) {
  const client = createApolloClient(); // ⚡ call the function to get the instance
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
