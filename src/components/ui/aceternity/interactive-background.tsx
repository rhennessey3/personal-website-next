"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface InteractiveBackgroundProps {
  children: React.ReactNode;
  className?: string;
  dotSize?: number;
  dotColor?: string;
  dotSpacing?: number;
  dotOpacity?: number;
  interactive?: boolean;
}

export function InteractiveBackground({
  children,
  className = "",
  dotSize = 1,
  dotColor = "currentColor",
  dotSpacing = 20,
  dotOpacity = 0.2,
  interactive = true,
}: InteractiveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Calculate dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);
  
  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  // Calculate dots
  const dots = [];
  const cols = Math.floor(dimensions.width / dotSpacing);
  const rows = Math.floor(dimensions.height / dotSpacing);
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * dotSpacing;
      const y = j * dotSpacing;
      
      // Calculate distance from mouse
      const distanceToMouse = interactive
        ? Math.sqrt(
            Math.pow(x - mousePosition.x, 2) + Math.pow(y - mousePosition.y, 2)
          )
        : 0;
      
      // Scale dot size based on mouse proximity
      const scaleFactor = interactive
        ? Math.max(0.5, 1 - distanceToMouse / 200)
        : 1;
      
      dots.push(
        <motion.div
          key={`${i}-${j}`}
          className="absolute rounded-full"
          style={{
            left: x,
            top: y,
            width: dotSize * scaleFactor,
            height: dotSize * scaleFactor,
            backgroundColor: dotColor,
            opacity: dotOpacity * scaleFactor,
          }}
          initial={{ scale: 1 }}
          animate={{ scale: scaleFactor }}
          transition={{ duration: 0.2 }}
        />
      );
    }
  }
  
  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dots}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}