"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface BackgroundVideoProps {
  /** Path to video file in /public/backgrounds/ */
  src?: string;
  /** Opacity of the video (0-1), default 0.3 for subtle effect */
  opacity?: number;
}

export function BackgroundVideo({
  src = "/backgrounds/bg.mp4",
  opacity = 0.6,
}: BackgroundVideoProps) {
  const [videoExists, setVideoExists] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // Check if video file exists
    fetch(src, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) setVideoExists(false);
      })
      .catch(() => setVideoExists(false));
  }, [src]);

  // Don't render on light mode or if not mounted
  if (!mounted || resolvedTheme === "light" || !videoExists) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Video element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute min-h-full min-w-full object-cover"
        style={{ opacity }}
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace(".mp4", ".webm")} type="video/webm" />
      </video>
    </div>
  );
}
