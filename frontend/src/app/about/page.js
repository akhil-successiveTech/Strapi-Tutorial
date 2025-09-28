"use client";

import { useQuery } from "@apollo/client/react";
import client from "../../../lib/apollo";
import { GET_ABOUT_PAGE } from "@/queries/aboutPage";
import Navbar from "@/components/Navbar";
import BodySection from "@/components/BodySection";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const { data, loading, error } = useQuery(GET_ABOUT_PAGE, { client });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  const about = data.aboutPage;

  return (
    <>
      <Navbar links={about.navbarLinks} />
      <h1 style={{ textAlign: "center", margin: "50px 0" }}>{about.title}</h1>
      <BodySection content={typeof about.bodyContent === "string" ? about.bodyContent : JSON.stringify(about.bodyContent)} />
      <Footer text={about.footer || ""} />
    </>
  );
}
