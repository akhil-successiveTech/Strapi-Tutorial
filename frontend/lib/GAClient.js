// src/components/GAClient.js
"use client";
import { useEffect } from "react";

export default function GAClient() {
  useEffect(() => {
    if (!window) return;

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-17MBXCBQC9', { // replace with your GA4 ID
      page_path: window.location.pathname,
    });
  }, []);

  return null;
}
