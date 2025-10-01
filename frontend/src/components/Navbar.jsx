"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_NAVBAR_LINKS } from "@/queries/navbar";
import { useRouter } from "next/navigation";


export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    // Handle token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("jwt", token);

      fetch("http://localhost:1337/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(userData => {
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
          window.history.replaceState({}, "", window.location.pathname);
        });
    } else {
      loadUserFromStorage();
    }

    // Listen for storage changes in other tabs
    const handleStorage = (event) => {
      if (event.key === "user" || event.key === "jwt") loadUserFromStorage();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    
    setUser(null);
    router.push("/"); 
  };

  const handleGoogleSignup = () => {
  const callbackUrl = encodeURIComponent("http://localhost:3000");
  window.location.href = `http://localhost:1337/api/connect/google?callbackUrl=${callbackUrl}`;
};

  const btnStyle = {
    background: "#ff6600",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 500,
    marginLeft: "10px",
  };

  const { data, loading, error } = useQuery(GET_NAVBAR_LINKS);
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
            <button onClick={handleGoogleSignup} style={btnStyle}>
              Signup with Google
            </button>
          </>
        ) : (
          <>
            <span style={{ margin: "0 10px" }}>
              Hello, {user.username || user.email}
            </span>
            <button onClick={handleLogout} style={btnStyle}>
              Logout
            </button>
          </>
        )}

      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error loading navbar</p>}
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