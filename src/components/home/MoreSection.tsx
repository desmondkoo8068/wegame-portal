/**
 * MoreSection: the closing "WEGAME MORE" banner, the last page of the flow.
 * In full-page mode the site footer is pinned right below it.
 * Motion is CSS (MoreSection.module.css), so this is a Server Component.
 */
import Image from "next/image";
import PageSection from "./PageSection";
import styles from "./MoreSection.module.css";

export default function MoreSection() {
  return (
    <PageSection id="more" label="WEGAME MORE" className={styles.more}>
      <div className={styles.roll} aria-hidden="true">
        <div className={styles.rollCopy} />
        <div className={styles.rollCopy} />
      </div>
      <div className={styles.fade} aria-hidden="true" />
      <Image src="/wegame/logo.svg" alt="WEGAME MORE" width={1678} height={161} className={styles.logo} />
      <div className={styles.glow} aria-hidden="true" />
    </PageSection>
  );
}
