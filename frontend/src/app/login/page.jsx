"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Login failed");
      }

      // ✅ Save JWT + User in localStorage
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");

      // ✅ Full reload so Navbar sees updated login state
      window.location.href = "/articles";
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6 border border-gray-300 rounded-lg text-center shadow-sm">
          <h1 className="mb-5 text-2xl font-semibold">Login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-3 rounded-md bg-blue-600 text-white text-base font-semibold cursor-pointer hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>
      </main>

    </div>
  );
}
