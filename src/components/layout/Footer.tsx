import React from 'react';
// Removed siteConfig import as it's no longer needed for the name

export function Footer() {
  // Removed currentYear calculation as it's no longer needed

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-neutral-950 text-neutral-400 py-6 px-8 text-sm z-10">
      {/* Changed justify-between to justify-center */}
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center gap-4">
        {/* Replaced copyright text with centered signature SVG */}
        <img src="/Signature.svg" alt="Signature" className="h-8" /> {/* Added height class, adjust as needed */}
      </div>
    </footer>
  );
}