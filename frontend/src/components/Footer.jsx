"use client";

import { useQuery } from "@apollo/client/react";
import { createApolloClient } from "../../lib/apollo";
import { GET_FOOTER } from "@/queries/footer";

export default function Footer() {
  const { data, loading, error } = useQuery(GET_FOOTER, { createApolloClient });

  if (loading)
    return (
      <footer className="w-full bg-black text-white py-6 text-center">
        <p className="text-sm sm:text-base">Loading footer...</p>
      </footer>
    );

  if (error)
    return (
      <footer className="w-full bg-black text-white py-6 text-center">
        <p className="text-sm sm:text-base">Error loading footer</p>
      </footer>
    );

  const footerText = data?.homePage?.footer || "";

  return (
    <footer className="w-full bg-black text-white py-6 text-center">
      <p className="text-sm sm:text-base">{footerText}</p>
    </footer>
  );
}
