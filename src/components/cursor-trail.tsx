"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export function CursorTrail() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const addSparkle = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random();
    const size = Math.random() * 8 + 4; // 4-12px
    
    setSparkles(prev => [...prev.slice(-15), { id, x, y, size, opacity: 1 }]);
    
    // Remove sparkle after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id));
    }, 600);
  }, []);

  useEffect(() => {
    if (!mounted || resolvedTheme !== "dark") return;

    let lastX = 0;
    let lastY = 0;
    let throttle = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (throttle) return;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
      );
      
      // Only create sparkle if mouse moved enough distance
      if (distance > 30) {
        addSparkle(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
        
        throttle = true;
        setTimeout(() => { throttle = false; }, 50);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted, resolvedTheme, addSparkle]);

  // Don't render in light mode or before mount
  if (!mounted || resolvedTheme !== "dark") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle-fade"
          style={{
            left: sparkle.x - sparkle.size / 2,
            top: sparkle.y - sparkle.size / 2,
            width: sparkle.size,
            height: sparkle.size,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
          >
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              fill="rgba(255, 255, 255, 0.9)"
            />
          </svg>
        </div>
      ))}
      <style jsx global>{`
        @keyframes sparkle-fade {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1) rotate(90deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.5) rotate(180deg);
            opacity: 0;
          }
        }
        .animate-sparkle-fade {
          animation: sparkle-fade 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
