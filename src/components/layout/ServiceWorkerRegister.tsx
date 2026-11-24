"use client";
/**
 * ServiceWorkerRegister: registers /sw.js once the page has loaded.
 * Renders nothing.
 *
 * - Production only: a service worker in `next dev` would serve stale files
 *   and make hot reloading confusing.
 * - Registers after the `load` event so it never competes with the page's
 *   own resources for bandwidth.
 * - Then tells the worker which files the page loaded (see sw.js).
 */
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        // updateViaCache "none": always check the network for a new sw.js,
        // so a deploy reaches users promptly.
        await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
        const registration = await navigator.serviceWorker.ready;

        // On a first visit the worker wasn't in control while the page loaded,
        // so it never saw those requests. Hand it the list so the page's JS,
        // CSS and images are cached too, and the page works offline next time.
        const urls = performance.getEntriesByType("resource").map((entry) => entry.name);
        registration.active?.postMessage({ type: "CACHE_URLS", urls });
      } catch (error) {
        console.error("Service worker registration failed:", error);
      }
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
