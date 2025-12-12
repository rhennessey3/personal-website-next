import React from 'react';

export function Footer() {
  return (
    // Removed px-8, kept py-6
    <footer className="fixed bottom-0 left-0 w-full bg-neutral-950 text-neutral-400 py-6 text-sm z-10"> {/* Removed red border */}
      {/* Footer content centered */}
      <div className="flex justify-center items-center px-8">
        {/* Signature SVG centered */}
        <div className="flex justify-center">
          <img src="/Signature.svg" alt="Signature" className="h-8" />
        </div>
      </div>
    </footer>
  );
}