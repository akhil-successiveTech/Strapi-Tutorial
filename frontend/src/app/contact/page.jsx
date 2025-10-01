"use client";

import { useQuery } from "@apollo/client/react";
import { createApolloClient } from "../../../lib/apollo";
import { GET_CONTACT_PAGE } from "@/queries/contactPage";
import BodySection from "@/components/BodySection";

export default function ContactPage() {
  const { data, loading, error } = useQuery(GET_CONTACT_PAGE, { createApolloClient });

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">Error loading data: {error.message}</p>;

  const contact = data.contactPage;

  return (
    <div className="flex flex-col min-h-screen">

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl sm:text-5xl text-center mb-10 text-gray-800">
          {contact.title}
        </h1>
        <div className="max-w-4xl mx-auto">
          <BodySection 
            content={typeof contact.bodyContent === "string" ? contact.bodyContent : JSON.stringify(contact.bodyContent)} 
          />
        </div>
      </main>
    </div>
  );
}
