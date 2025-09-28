"use client";

import { useQuery } from "@apollo/client/react";
import client from "../../../lib/apollo";
import { GET_CONTACT_PAGE } from "@/queries/contactPage";
import Navbar from "@/components/Navbar";
import BodySection from "@/components/BodySection";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const { data, loading, error } = useQuery(GET_CONTACT_PAGE, { client });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  const contact = data.contactPage;

  return (
    <>
      <Navbar links={contact.navbarLinks} />
      <h1 style={{ textAlign: "center", margin: "50px 0" }}>{contact.title}</h1>
      <BodySection content={typeof contact.bodyContent === "string" ? contact.bodyContent : JSON.stringify(contact.bodyContent)} />
      <Footer text={contact.footer || ""} />
    </>
  );
}
