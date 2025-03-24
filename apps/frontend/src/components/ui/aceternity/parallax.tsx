"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  baseVelocity?: number;
  direction?: "horizontal" | "vertical";
}

export function Parallax({
  children,
  className = "",
  baseVelocity = 5,
  direction = "vertical",
}: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [containerHeight, setContainerHeight] = useState(0);
  
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
  }, []);
  
  const y = useTransform(
    scrollY,
    [0, containerHeight],
    [0, containerHeight * baseVelocity * 0.1]
  );
  
  const x = useTransform(
    scrollY,
    [0, containerHeight],
    [0, containerHeight * baseVelocity * 0.1]
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        style={direction === "vertical" ? { y } : { x }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
}