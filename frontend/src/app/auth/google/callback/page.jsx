"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/"); // redirect to home page
  }, [router]);

  return <p>Redirecting...</p>;
}
