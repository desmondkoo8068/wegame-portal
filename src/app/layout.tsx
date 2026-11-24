import type { Metadata, Viewport } from "next";
import StoreProvider from "@/store/StoreProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceWorkerRegister from "@/components/layout/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeGame - 一起更好玩",
  description:
    "WeGame 官网首页的响应式重制：大作云集、客户端焕新、游戏助手、开黑与高校认证。前端工程挑战作品。",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  // iOS: lets "Add to Home Screen" open the site full-screen, without Safari's bars.
  appleWebApp: { capable: true, title: "WeGame", statusBarStyle: "black-translucent" },
};

// themeColor lives in `viewport` (not `metadata`) in the Next.js App Router.
export const viewport: Viewport = {
  themeColor: "#070809",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // zh-CN: Simplified Chinese. Lets browsers pick the right fonts and
    // screen readers use the right pronunciation.
    <html lang="zh-CN" className="antialiased">
      <body>
        {/* Every page below can read/write the Redux store. */}
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
          <ServiceWorkerRegister />
        </StoreProvider>
      </body>
    </html>
  );
}
