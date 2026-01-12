"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Base64 encoded rocket cursor (32x32 PNG)
// Created from 🚀 emoji - tilted for natural pointer feel
const ROCKET_CURSOR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <style>
    .rocket { font-size: 24px; }
  </style>
  <text x="2" y="24" class="rocket">🚀</text>
</svg>
`;

export function RocketCursor() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Remove existing style if present
    const existing = document.getElementById("rocket-cursor-style");
    if (existing) existing.remove();

    // Only apply rocket cursor in dark mode
    if (resolvedTheme !== "dark") {
      return;
    }

    // Convert SVG to data URI
    const encodedSvg = encodeURIComponent(ROCKET_CURSOR_SVG.trim());
    const dataUri = `data:image/svg+xml,${encodedSvg}`;
    
    // Apply cursor to document
    const style = document.createElement("style");
    style.id = "rocket-cursor-style";
    style.textContent = `
      *, *::before, *::after {
        cursor: url("${dataUri}") 4 4, auto !important;
      }
      a, button, [role="button"], input[type="submit"], input[type="button"],
      .cursor-pointer, [onclick] {
        cursor: url("${dataUri}") 4 4, pointer !important;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      style.remove();
    };
  }, [mounted, resolvedTheme]);

  return null;
}
