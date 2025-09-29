"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Default values for the hero section
  const title = "Welcome to MyWebsite";
  const subtitle =
    "Discover amazing articles, tutorials, and resources to boost your knowledge and skills.";
  const imageUrl =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"; // sample background image

  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "calc(100vh - 120px)",
        padding: "0 20px",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
      }}
    >
      {/* Dark overlay for text readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "20px", lineHeight: 1.2 }}>
          {title}
        </h1>
        <p style={{ fontSize: "1.5rem", marginBottom: "40px", lineHeight: 1.5 }}>
          {subtitle}
        </p>

        {/* Only Get Started button */}
        {user && (
          <Link href="/articles/new">
            <button
              style={{
                padding: "15px 30px",
                fontSize: "1.2rem",
                borderRadius: "5px",
                border: "none",
                background: "#ff6600",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Get Started
            </button>
          </Link>
        )}
      </div>
    </section>
  );
}
