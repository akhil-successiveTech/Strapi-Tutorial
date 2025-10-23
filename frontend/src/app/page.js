"use client";
import { useQuery } from "@apollo/client/react";
// Add token to requests
import { createApolloClient } from "../../lib/apollo";
// GraphQL query
import { GET_HOME_PAGE } from "@/queries/homePage.js";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Head from "next/head"; // Preloads for better performance
// Loads body section client side
const BodySection = dynamic(() => import("@/components/BodySection"), { ssr: false });

// Create Apollo client only once
const client = createApolloClient();

export default function HomePage() {
  // Uses cached data to check and then fetch
  const { data, loading, error } = useQuery(GET_HOME_PAGE, { client, fetchPolicy: "cache-first" });

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  const home = data.homePage;

  const heroTitle =
    typeof home.heroTitle === "object"
      ? home.heroTitle.text || home.heroTitle.children?.[0]?.text || "Welcome"
      : home.heroTitle || "Welcome";

  const heroSubtitle =
    typeof home.heroSubtitle === "object"
      ? home.heroSubtitle.text || home.heroSubtitle.children?.[0]?.text || ""
      : home.heroSubtitle || "";

  const heroImageUrl =
    home.heroImage?.data?.attributes?.url || home.heroImage?.url || "/default-hero.jpg";

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={heroImageUrl} />
      </Head>
      <Hero title={heroTitle} subtitle={heroSubtitle} imageUrl={heroImageUrl} />
      <BodySection
        content={
          typeof home.bodyContent === "object"
            ? JSON.stringify(home.bodyContent)
            : home.bodyContent
        }
      />
    </>
  );
}
