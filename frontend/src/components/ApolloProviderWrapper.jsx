// src/components/ApolloProviderWrapper.js
"use client";
import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "../../lib/apollo";
import { useMemo } from "react";

export default function ApolloProviderWrapper({ children }) {
  const client = useMemo(() => createApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
