"use client";

import { useQuery } from "@apollo/client/react";
import { createApolloClient } from "../../lib/apollo";
import { GET_FOOTER } from "@/queries/footer";

export default function Footer() {
  const { data, loading, error } = useQuery(GET_FOOTER, { createApolloClient });

  if (loading) return <footer style={footerStyle}><p>Loading footer...</p></footer>;
  if (error) return <footer style={footerStyle}><p>Error loading footer</p></footer>;

  // ✅ Correct path: homePage.footer.text
  const footerText = data?.homePage?.footer || "";

  return (
    <footer style={footerStyle}>
      <p>{footerText}</p>
    </footer>
  );
}

const footerStyle = {
  padding: "20px",
  textAlign: "center",
  background: "#222",
  color: "#fff",
};
