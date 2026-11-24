/**
 * Footer: site-wide footer.
 *
 * This is a Server Component (no "use client"): it has no interactivity, so
 * it renders to plain HTML on the server and sends zero JavaScript.
 *
 * Layout: brand + download on the left, official channels (QR codes and
 * social links) on the right; legal links and registration info below.
 * On mobile everything stacks into one column.
 */
import Logo from "@/components/ui/Logo";
import { DownloadIcon } from "@/components/ui/Icons";
import { legalLinks, qrCodes, registrationInfo, socialLinks } from "@/data/navigation";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2">
        {/* Brand + download */}
        <div className="flex flex-col items-start gap-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Play better together. Discover, download and play your favourite games in one place.
          </p>
          <a href="#" className="btn-primary">
            <DownloadIcon width={16} height={16} />
            Download Client
          </a>
        </div>

        {/* Official channels */}
        <div className="md:justify-self-end">
          <h2 className="mb-4 text-sm font-semibold text-white">Official Channels</h2>
          <div className="flex flex-wrap gap-6">
            {qrCodes.map((qr) => (
              <figure key={qr.id} className="flex flex-col items-center gap-2">
                {/* Placeholder: a real build would use the actual QR images. */}
                <div className="qr-placeholder" role="img" aria-label={`QR code: ${qr.caption}`} />
                <figcaption className="text-xs text-muted">{qr.caption}</figcaption>
              </figure>
            ))}
          </div>
          <ul className="mt-4 flex gap-4 text-sm">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-brand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-muted">
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-4">
            {registrationInfo.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <span>COPYRIGHT &copy; 2017 &ndash; {year} TENCENT. ALL RIGHTS RESERVED.</span>
          </div>
          <p className="text-[11px] opacity-70">
            Unofficial mockup built for a frontend engineering challenge. Not affiliated with
            Tencent.
          </p>
        </div>
      </div>
    </footer>
  );
}
