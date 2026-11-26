/**
 * KvSection: the full-screen hero ("key visual") at the top of the page.
 *
 * Layers, back to front:
 *   1. background video (AutoVideo handles loading/error/pausing)
 *   2. the "lightbox": dark tint + orange light + digital code texture
 *   3. the slogan, which switches from "一起更好玩" to "轻装上阵 3.0"
 *   4. download button and (desktop) the flowing "scroll down" chevrons
 *
 * All motion is CSS (KvSection.module.css), so this is a Server Component.
 */
import Image from "next/image";
import AutoVideo from "@/components/ui/AutoVideo";
import DownloadButton from "@/components/ui/DownloadButton";
import PageSection from "./PageSection";
import styles from "./KvSection.module.css";

export default function KvSection() {
  return (
    <PageSection id="kv" label="WeGame 3.0 轻装上阵" className={styles.kv}>
      <AutoVideo src="/wegame/video/kv.mp4" poster="/wegame/video/kv-poster.jpg" pageId="kv" />

      <div className={styles.lightbox} aria-hidden="true">
        <div className={styles.light} />
        <div className={styles.code} />
      </div>

      <div className={styles.main}>
        <div className={styles.slogans}>
          <Image
            src="/wegame/slogan-2.0.svg"
            alt=""
            width={1024}
            height={160}
            className={`${styles.slogan} ${styles.sloganOld}`}
          />
          <Image
            src="/wegame/slogan-3.0.svg"
            alt="轻装上阵 WeGame 3.0"
            width={1024}
            height={160}
            priority
            className={`${styles.slogan} ${styles.sloganNew}`}
          />
        </div>

        <DownloadButton className={styles.download} />
      </div>

      <div className={styles.hint} aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className={styles.chevron} />
        ))}
      </div>
    </PageSection>
  );
}
