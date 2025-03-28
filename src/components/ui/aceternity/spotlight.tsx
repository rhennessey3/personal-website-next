"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
}

export function Spotlight({
  children,
  className = "",
  size = 300,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-10 opacity-0"
        style={{
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.15), transparent 80%)`,
          opacity,
        }}
        animate={{ opacity }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </div>
  );
}