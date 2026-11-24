/**
 * Web app manifest: tells the browser how to install and display the site.
 * Next.js serves this at /manifest.webmanifest and adds the <link> tag.
 *
 * Installability needs: name, start_url, display "standalone", and 192px +
 * 512px icons. We also ship a "maskable" icon: Android crops icons into
 * circles/squircles, and a maskable icon keeps its artwork inside the safe
 * zone so nothing gets cut off.
 */
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WeGame - 一起更好玩",
    short_name: "WeGame",
    description: "WeGame 官网首页的响应式重制：大作云集、客户端焕新、游戏助手、开黑与高校认证。",
    lang: "zh-CN",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // Shown on the splash screen while the app starts; matches --color-page.
    background_color: "#070809",
    // Colours the browser/OS title bar; matches the icon background.
    theme_color: "#070809",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
