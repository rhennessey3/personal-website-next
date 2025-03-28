"use client";

import { useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  frequency?: number;
  offset?: number;
}

export function FloatingElement({
  children,
  className = "",
  amplitude = 10,
  frequency = 0.5,
  offset = 0,
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timeRef = useRef(offset * Math.PI * 2);
  
  useAnimationFrame(() => {
    if (!ref.current) return;
    
    timeRef.current += 0.01 * frequency;
    
    // Calculate vertical position using sine wave
    const y = Math.sin(timeRef.current) * amplitude;
    
    // Apply the transform
    ref.current.style.transform = `translateY(${y}px)`;
  });
  
  return (
    <motion.div
      ref={ref}
      className={`will-change-transform ${className}`}
      initial={{ y: 0 }}
    >
      {children}
    </motion.div>
  );
}