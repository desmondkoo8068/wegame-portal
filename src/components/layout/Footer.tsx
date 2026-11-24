/**
 * Footer: site-wide footer, laid out like wegame.com.cn.
 *
 * Top row: 下载客户端 · 官方渠道 · 友情链接 · WeGame logo.
 * Bottom: legal links, ICP / public-security filings and copyright.
 *
 * Server Component (no JavaScript). The WeChat QR codes appear in a popover
 * on hover *or* keyboard focus, using CSS group-hover/group-focus-within.
 */
import Image from "next/image";
import type { ReactNode } from "react";
import {
  footerDownloads,
  friendLinks,
  legalLinks,
  qrCodes,
  registration,
  socialLinks,
  type NavLink,
} from "@/data/navigation";

const externalProps = (link: NavLink) =>
  link.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-page text-sm lg:snap-end">
      <div className="container-page grid grid-cols-2 gap-8 py-10 sm:grid-cols-[repeat(3,auto)_1fr] sm:gap-12 lg:max-w-none lg:px-[calc(86*var(--dp))]">
        <FooterColumn title="下载客户端">
          {footerDownloads.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="footer-link">
                {link.label}
              </a>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="官方渠道">
          <li className="group relative">
            <button type="button" className="footer-link" aria-describedby="wechat-qr">
              微信
            </button>
            <div
              id="wechat-qr"
              role="tooltip"
              className="invisible absolute bottom-full right-0 z-10 sm:left-0 sm:right-auto mb-2 flex gap-3 rounded-lg bg-white p-3 opacity-0 shadow-xl transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
            >
              {qrCodes.map((qr) => (
                <figure key={qr.src} className="flex w-24 flex-col items-center gap-1">
                  <Image
                    src={qr.src}
                    alt={`微信二维码：${qr.caption}`}
                    width={304}
                    height={304}
                    className="size-24"
                  />
                  <figcaption className="text-center text-[11px] leading-tight text-black/70">
                    扫描二维码
                    <br />
                    {qr.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </li>
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} {...externalProps(link)} className="footer-link">
                {link.label}
              </a>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn
          title="友情链接"
          className="col-span-2 sm:col-span-1"
          listClassName="grid grid-cols-2 gap-x-6 gap-y-2"
        >
          {friendLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} {...externalProps(link)} className="footer-link">
                {link.label}
              </a>
            </li>
          ))}
        </FooterColumn>

        <div className="col-span-2 flex items-start sm:col-span-1 sm:justify-end">
          <Image
            src="/wegame/icon-logo.svg"
            alt="WeGame"
            width={194}
            height={49}
            className="h-10 w-auto"
          />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/40 lg:max-w-none lg:px-[calc(86*var(--dp))]">
          <nav aria-label="法律信息">
            <ul className="flex flex-wrap gap-y-1">
              {legalLinks.map((link) => (
                <li
                  key={link.label}
                  className="after:mx-2 after:text-white/20 after:content-['|'] last:after:content-none"
                >
                  <a href={link.href} {...externalProps(link)} className="hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a
              href={registration.icp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              {registration.icp.label}
            </a>
            <a
              href={registration.police.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white"
            >
              <Image src="/wegame/record.png" alt="" width={20} height={20} className="size-4" />
              {registration.police.label}
            </a>
          </p>
          <p>COPYRIGHT © 2017 – {year} TENCENT. ALL RIGHTS RESERVED. 腾讯公司 版权所有</p>
          <p className="text-white/30">非官方页面：本页为前端工程挑战的练习作品，与腾讯无关。</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  className = "",
  listClassName = "flex flex-col gap-2",
  children,
}: {
  title: string;
  className?: string;
  listClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <h2 className="mb-3 font-bold text-white">{title}</h2>
      <ul className={listClassName}>{children}</ul>
    </div>
  );
}
