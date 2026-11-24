import type { Metadata } from "next";
import StoreProvider from "@/store/StoreProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeGame - 一起更好玩",
  description:
    "WeGame 官网首页的响应式重制：大作云集、客户端焕新、游戏助手、开黑与高校认证。前端工程挑战作品。",
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
        </StoreProvider>
      </body>
    </html>
  );
}
