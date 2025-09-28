"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero({ title, subtitle, imageUrl, buttons }) {
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

  return (
    <section
      style={{
        textAlign: "center",
        padding: "120px 20px",
        backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
      }}
    >
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}

      <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
        {/* CTA Buttons */}
        {buttons?.map((btn, idx) => (
          <Link key={idx} href={btn.url}>
            <button style={{ padding: "10px 20px" }}>{btn.label}</button>
          </Link>
        ))}

        {/* Always visible Get Started for posting article */}
        {user && (
          <Link href="/articles/new">
            <button style={{ padding: "10px 20px", background: "#ff6600", color: "#fff" }}>
              Get Started
            </button>
          </Link>
        )}

        {/* Extra options for Superuser */}
        {user?.role?.name === "Super Admin" && (
          <>
            <Link href="/articles/moderate">
              <button style={{ padding: "10px 20px", background: "green", color: "#fff" }}>
                Moderate Articles
              </button>
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={handleLogout}
            style={{ margin: "0 10px", padding: "10px 20px" }}
          >
            Logout
          </button>
        )}
      </div>
    </section>
  );
}
