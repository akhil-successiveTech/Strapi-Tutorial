"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import client from "../../lib/apollo";
import { GET_NAVBAR_LINKS } from "@/queries/navbar";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const btnStyle = {
    background: "#ff6600",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 500,
  };

  // Fetch navbar links from Strapi
  const { data, loading, error } = useQuery(GET_NAVBAR_LINKS, { client });

  if (loading) return <nav style={navStyle}><p>Loading...</p></nav>;
  if (error) return <nav style={navStyle}><p>Error loading navbar</p></nav>;

  // ✅ Correct path: homePage.navbarLinks
  const navLinks = data?.homePage?.navbarLinks || [];

  return (
    <nav style={navStyle}>
      <h1 style={{ fontSize: "1.8rem" }}>MyWebsite</h1>
      <div>
        {navLinks.map((link, idx) => (
          <Link key={idx} href={link.url} style={{ margin: "0 10px" }}>
            {link.label}
          </Link>
        ))}

        {!user ? (
          <>
            <Link href="/login" style={{ margin: "0 10px" }}>Login</Link>
            <Link href="/signup" style={{ margin: "0 10px" }}>Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={btnStyle}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 50px",
  background: "#1a1a1a",
  color: "#fff",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};
