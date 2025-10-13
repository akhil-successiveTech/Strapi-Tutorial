"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsClient(true); // ✅ ensures this runs only on client
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ✅ Prevent mismatch: render nothing until client-side mount
  if (!isClient) return null;

  // Default hero content
  const title = "Welcome to MyWebsite";
  const subtitle =
    "Discover amazing articles, tutorials, and resources to boost your knowledge and skills.";
  const imageUrl =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80";

  return (
    <section className="relative flex items-center justify-center text-center min-h-[calc(100vh-120px)] px-5 text-white overflow-hidden">
      <Image
        src={imageUrl}
        alt="Hero background"
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/50 z-10" />

      <div className="relative z-20 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold mb-5 leading-tight">
          {title}
        </h1>
        <p className="text-lg sm:text-2xl mb-10 leading-relaxed text-gray-200">
          {subtitle}
        </p>

        {user && (
          <Link href="/articles/new">
            <button className="px-6 py-3 text-lg rounded-md bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-colors">
              Get Started
            </button>
          </Link>
        )}
      </div>
    </section>
  );
}
