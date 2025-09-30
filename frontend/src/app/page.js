"use client";
import { useQuery } from "@apollo/client/react";
import { createApolloClient } from "../../lib/apollo";
import { GET_HOME_PAGE } from "@/queries/homePage.js";
import Hero from "@/components/Hero";
import BodySection from "@/components/BodySection";

export default function HomePage() {
  const { data, loading, error } = useQuery(GET_HOME_PAGE, { createApolloClient });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  const home = data.homePage;

  // Safely extract heroTitle and heroSubtitle as strings
  let heroTitle = home.heroTitle;
  if (typeof heroTitle === 'object' && heroTitle !== null) {
    heroTitle = heroTitle.text || heroTitle.children?.[0]?.text || JSON.stringify(heroTitle);
  }
  let heroSubtitle = home.heroSubtitle;
  if (typeof heroSubtitle === 'object' && heroSubtitle !== null) {
    heroSubtitle = heroSubtitle.text || heroSubtitle.children?.[0]?.text || JSON.stringify(heroSubtitle);
  }
  // Safely extract heroImage URL
  let heroImageUrl = home.heroImage?.data?.attributes?.url || home.heroImage?.url || '';

  // Define Get Started and Logout buttons
  const heroButtons = [
    { label: "Get Started", url: "/get-started" },
    { label: "Logout", onClick: () => { localStorage.removeItem("user"); localStorage.removeItem("jwt"); window.location.reload(); } }
  ];

  return (
    <>
      <Hero/>
      <BodySection content={typeof home.bodyContent === 'object' ? JSON.stringify(home.bodyContent) : home.bodyContent} />
    </>
  );
}
