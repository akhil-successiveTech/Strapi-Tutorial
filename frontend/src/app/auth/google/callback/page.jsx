"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access_token = params.get("access_token"); // Google token sent by Google

    if (!access_token) {
      alert("Google login failed. No token received.");
      router.replace("/login");
      return;
    }

    // Send Google token to Strapi to get Strapi JWT
    fetch(
      `http://localhost:1337/api/auth/google/callback?access_token=${access_token}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("authChange"));

          alert("Login successful!");
          router.replace("/");
        } else {
          alert("Login failed: " + (data.error?.message || "Unknown error"));
          router.replace("/login");
        }
      })
      .catch(() => {
        alert("Something went wrong while logging in.");
        router.replace("/login");
      });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-700">Logging in with Google...</p>
    </div>
  );
}