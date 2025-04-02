import React from 'react';

// Layout specifically for the /case-studies routes
// This layout does NOT add the default padding found in the root layout's <main> inner div,
// allowing case study pages to use the full width within the main content area.
export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // Directly render children without extra padding wrappers
}