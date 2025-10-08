"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Signup successful!");
      router.push("/"); // ✅ redirect to home page
    } catch (err) {
      console.error(err);
      alert("Signup failed: " + err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6 border border-gray-300 rounded-lg text-center shadow-sm">
          <h2 className="mb-5 text-2xl font-semibold">Signup</h2>

          <input
            className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSignup}
            className="w-full p-3 mt-3 rounded-md bg-orange-500 text-white font-medium cursor-pointer hover:bg-orange-600 transition"
          >
            Signup
          </button>
        </div>
      </main>
    </div>
  );
}
