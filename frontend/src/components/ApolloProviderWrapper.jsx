// src/components/ApolloProviderWrapper.js
"use client";
// Make it available to the children components
import { ApolloProvider } from "@apollo/client/react";
// My custom function
import { createApolloClient } from "../../lib/apollo";
import { useMemo } from "react";

export default function ApolloProviderWrapper({ children }) {
  // Only runs on first render and memoizes the results
  const client = useMemo(() => createApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}