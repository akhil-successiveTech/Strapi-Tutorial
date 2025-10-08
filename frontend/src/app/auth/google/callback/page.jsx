"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {
      // 1️⃣ Read Google token from query params
      const queryParams = new URLSearchParams(window.location.search);
      const googleAccessToken =
        queryParams.get("access_token") || queryParams.get("raw[access_token]");

      if (!googleAccessToken) {
        alert("Google login failed. No token received.");
        router.replace("/login");
        return;
      }

      try {
        // 2️⃣ Send Google token to Strapi to get Strapi JWT
        const res = await fetch(
          `http://localhost:1337/api/auth/google/callback?access_token=${googleAccessToken}`
        );

        if (!res.ok) throw new Error(`Strapi auth failed: ${res.status}`);

        const data = await res.json();

        if (data.jwt) {
          // 3️⃣ Save Strapi JWT and user info in localStorage
          localStorage.setItem("token2", data.jwt);
          localStorage.setItem("user", JSON.stringify(data.user));

          // 4️⃣ Dispatch event for Navbar or other components
          window.dispatchEvent(new Event("authChange"));

          // 5️⃣ Clean URL so token is not exposed
          window.history.replaceState({}, "", window.location.pathname);

          alert("Login successful!");
          router.replace("/");
        } else {
          alert("Login failed: " + (data.error?.message || "Unknown error"));
          router.replace("/login");
        }
      } catch (err) {
        console.error("Error during Google login:", err);
        alert("Something went wrong while logging in.");
        router.replace("/login");
      }
    };

    handleLogin();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-700">Logging in with Google...</p>
    </div>
  );
}
