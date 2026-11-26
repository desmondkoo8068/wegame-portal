/**
 * UniversitySection: "05 高校" – WeGame campus verification.
 *
 * Left: title, description and three feature badges.
 * Right: a phone mock-up with floating cards, the 蛋蛋君 mascot, and a column
 * of chat bubbles that scrolls upwards forever.
 * All motion is CSS (UniversitySection.module.css): a Server Component.
 */
import Image from "next/image";
import { universityFeatures, universityMessages } from "@/data/home";
import PageSection from "./PageSection";
import styles from "./UniversitySection.module.css";

export default function UniversitySection() {
  return (
    <PageSection id="university" label="05 高校：WEGAME 高校认证" className={styles.university}>
      <div className={styles.arrows} aria-hidden="true">
        <div className={styles.arrow} />
        <div className={styles.arrow} />
        <div className={styles.arrow} />
      </div>

      <div className={styles.main}>
        <div className={styles.texts}>
          <h2 className={styles.rise}>
            <Image src="/wegame/college-title-01.svg" alt="WEGAME 高校认证" width={1200} height={120} />
          </h2>
          <Image
            src="/wegame/college-desc-01.svg"
            alt="同校聚集，为荣誉也为共鸣"
            width={1200}
            height={120}
            className={styles.rise}
          />
        </div>

        <ul className={styles.features}>
          {universityFeatures.map((feature) => (
            <li key={feature.src} className={styles.rise}>
              <Image src={feature.src} alt={feature.alt} width={260} height={80} />
            </li>
          ))}
        </ul>

        <div className={styles.app}>
          <Image
            src="/wegame/college-app.jpg"
            alt="WeGame 高校认证 App 界面"
            width={720}
            height={1293}
            sizes="(min-width: 1024px) 25vw, 300px"
            className={styles.phone}
          />
          <Image src="/wegame/college-app-card-01.png" alt="" width={798} height={453} className={styles.cardOne} />
          <Image src="/wegame/college-app-card-02.png" alt="" width={811} height={347} className={styles.cardTwo} />
          <div className={styles.ddjWrap}>
            <Image src="/wegame/college-ddj.png" alt="蛋蛋君" width={450} height={450} className={styles.ddj} />
          </div>

          {/* Chat bubbles: the list is rendered twice so the upward loop is seamless. */}
          <div className={styles.messages} aria-hidden="true">
            <div className={styles.messageLoop}>
              {[...universityMessages, ...universityMessages].map((message, i) => (
                <div key={i} className={styles.message}>
                  <span>{message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
