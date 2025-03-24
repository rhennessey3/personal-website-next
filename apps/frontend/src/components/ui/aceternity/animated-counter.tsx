"use client";

import { useRef, useState, useEffect } from "react";
import { useInView, motion, useSpring } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  formatValue = (val) => Math.round(val).toString(),
  className = "",
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Use spring animation for smooth counting
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });
  
  useEffect(() => {
    if (inView && !hasAnimated) {
      springValue.set(value);
      setHasAnimated(true);
    }
  }, [inView, value, springValue, hasAnimated]);
  
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(formatValue(latest));
    });
    
    return () => {
      unsubscribe();
    };
  }, [springValue, formatValue]);
  
  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}