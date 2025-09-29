"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const formWrapper = { maxWidth: "400px", margin: "100px auto", padding: "30px", border: "1px solid #ccc", borderRadius: "10px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" };
  const inputStyle = { width: "100%", padding: "10px", margin: "10px 0", borderRadius: "5px", border: "1px solid #ccc" };
  const btnStyle = { width: "100%", padding: "12px", marginTop: "15px", borderRadius: "5px", border: "none", background: "#ff6600", color: "#fff", cursor: "pointer", fontWeight: 500 };

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
    <div style={formWrapper}>
      <h2>Signup</h2>
      <input style={inputStyle} placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input style={inputStyle} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input style={inputStyle} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button style={btnStyle} onClick={handleSignup}>Signup</button>
    </div>
  );
}
