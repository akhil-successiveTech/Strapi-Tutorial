// src/components/ApolloProviderWrapper.js
"use client";

import { ApolloProvider } from "@apollo/client/react"; 
import client from "../../lib/apollo.js";

export default function ApolloProviderWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
