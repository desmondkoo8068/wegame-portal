import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Never let the browser/CDN cache the service worker file itself,
        // otherwise a new deploy could take a day to reach users.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          // Lets the worker control the whole site, not just /sw.js's folder.
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      // Tailwind only processes the global stylesheet. A catch-all "*.css"
      // rule would also catch *.module.css files and turn them into plain
      // global CSS (no scoped class names), so it's limited to globals.css.
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
