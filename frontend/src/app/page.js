"use client";

import { useQuery } from "@apollo/client/react";
import client from "../../lib/apollo";
import { GET_HOME_PAGE } from "@/queries/homePage";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BodySection from "@/components/BodySection";
import Footer from "@/components/Footer";

export default function HomePage() {
  const { data, loading, error } = useQuery(GET_HOME_PAGE, { client });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  const home = data.homePage;

  return (
    <>
      <Navbar links={home.navbarLinks} />
      {/* <Hero
        title={home.heroTitle}
        subtitle={home.heroSubtitle}
        imageUrl={home.heroImage?.url || ""}
        buttons={home.ctaButtons || []}
      /> */}
      <BodySection content={typeof home.bodyContent === "string" ? home.bodyContent : JSON.stringify(home.bodyContent)} />
      <Footer text={home.footer || ""} />
    </>
  );
}
