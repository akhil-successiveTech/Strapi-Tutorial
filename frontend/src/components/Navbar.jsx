"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_NAVBAR_LINKS } from "@/queries/navbar";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const loadUserFromStorage = () => {
    const storedUser =
      localStorage.getItem("user") || localStorage.getItem("strapi_user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
  };

  useEffect(() => {
    loadUserFromStorage();
    const handleAuthChange = () => loadUserFromStorage();
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("strapi_jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("strapi_user");
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:1337/api/connect/google";
  };

  const { data, loading, error } = useQuery(GET_NAVBAR_LINKS);
  const navLinks = data?.homePage?.navbarLinks || [];

  return (
    <nav className="flex justify-between items-center bg-[#1a1a1a] text-white px-6 md:px-12 py-4 sticky top-0 z-50 shadow-md">
      <h1 className="text-2xl font-semibold">MyWebsite</h1>

      {/* Mobile menu toggle */}
      <button
        className="md:hidden focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Links */}
      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-[#1a1a1a] md:bg-transparent md:space-x-6 items-center p-4 md:p-0 transition-all duration-300`}
      >
        {navLinks.map((link, idx) => (
          <Link
            key={idx}
            href={link.url}
            className="my-2 md:my-0 text-white hover:text-orange-400 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        {!user ? (
          <>
            <Link
              href="/login"
              className="my-2 md:my-0 hover:text-orange-400 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="my-2 md:my-0 hover:text-orange-400 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Signup
            </Link>
            <button
              onClick={handleGoogleSignup}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-md my-2 md:my-0 md:ml-4 transition-all"
            >
              Signup with Google
            </button>
          </>
        ) : (
          <>
            <span className="my-2 md:my-0">Hello, {user.username || user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-md my-2 md:my-0 md:ml-4 transition-all"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {loading && <p className="text-sm ml-4">Loading...</p>}
      {error && <p className="text-sm text-red-400 ml-4">Error loading navbar</p>}
    </nav>
  );
}
