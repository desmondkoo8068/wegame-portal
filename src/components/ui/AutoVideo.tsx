"use client";
/**
 * AutoVideo: a muted, looping background video with proper loading and
 * error handling.
 *
 * States (local, since only this component cares):
 *   loading -> the poster image shows; the video is transparent
 *   ready   -> the video fades in over the poster
 *   error   -> the poster simply stays (no broken video box)
 *
 * It also only plays while its page is on screen (Redux ui.activePage), so
 * off-screen videos don't waste battery, and never autoplays when the user
 * prefers reduced motion.
 */
import { useEffect, useRef, useState } from "react";
import type { PageId } from "@/data/home";
import { useAppSelector } from "@/store/hooks";

interface AutoVideoProps {
  src: string;
  poster: string;
  /** The page this video lives on; it plays only while that page is active. */
  pageId: PageId;
  className?: string;
}

type VideoState = "loading" | "ready" | "error";

export default function AutoVideo({ src, poster, pageId, className = "" }: AutoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoState>("loading");
  const isActive = useAppSelector((s) => s.ui.activePage === pageId);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || state === "error") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isActive && !reduceMotion) {
      // play() returns a promise that rejects if the browser blocks autoplay;
      // the poster is still showing, so we can safely ignore that.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, state]);

  return (
    <div
      className={`absolute inset-0 bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${poster})` }}
    >
      {state !== "error" && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onCanPlay={() => setState("ready")}
          onError={() => setState("error")}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            state === "ready" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
