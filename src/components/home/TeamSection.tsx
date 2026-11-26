/**
 * TeamSection: "04 开黑" – one page that plays two scenes in sequence:
 *   1. 开黑功能 实力回归: the party gathers, 蛋蛋君 fills the empty seat
 *   2. 游戏内外互通 快速集结: the game room opens and the heroes step in
 *
 * The whole sequence is CSS (TeamSection.module.css), started by the
 * page's data-active attribute, so this stays a Server Component.
 */
import Image from "next/image";
import { teamMembers } from "@/data/home";
import PageSection from "./PageSection";
import styles from "./TeamSection.module.css";

export default function TeamSection() {
  return (
    <PageSection id="team" label="04 开黑" className={styles.team}>
      {/* Rising orange chevrons (desktop). */}
      <div className={styles.arrows} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      {/* ---------- Scene 1: the party ---------- */}
      <div className={styles.sceneOne}>
        <div className={styles.texts}>
          <h2>
            <Image src="/wegame/teamup-title-01.svg" alt="开黑功能 实力回归" width={1200} height={120} />
          </h2>
          <Image src="/wegame/teamup-subtitle-01.svg" alt="开黑寻友 一起好玩" width={1200} height={120} />
        </div>

        <ul className={styles.members} aria-label="开黑队伍">
          {teamMembers.map((member, i) => {
            const isMascotSeat = i === 2;
            return (
              <li key={member.avatar} className={styles.member}>
                <div className={styles.avatar}>
                  {isMascotSeat ? (
                    <>
                      {/* Empty "+" seat, then 蛋蛋君 pops into it. */}
                      <Image src="/wegame/teamup-avatar-add.png" alt="" width={315} height={315} />
                      <Image
                        src={`/wegame/teamup-avatar-${member.avatar}.png`}
                        alt="WeGame 蛋蛋君"
                        width={315}
                        height={315}
                        className={styles.mascot}
                      />
                    </>
                  ) : (
                    <Image
                      src={`/wegame/teamup-avatar-${member.avatar}.png`}
                      alt={`队友 ${i < 2 ? i + 1 : i}`}
                      width={315}
                      height={315}
                    />
                  )}
                </div>
                <Image
                  src={`/wegame/Component-${member.icon}.png`}
                  alt=""
                  width={60}
                  height={60}
                  className={styles.icon}
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---------- Scene 2: the game room ---------- */}
      <div className={styles.sceneTwo}>
        <div className={styles.room} aria-hidden="true">
          <Image src="/wegame/teamup-bg.jpg" alt="" fill sizes="100vw" />
        </div>
        <div className={styles.texts}>
          <h2>
            <Image src="/wegame/teamup-title-02.svg" alt="游戏内外互通" width={1200} height={120} />
          </h2>
          <Image src="/wegame/teamup-subtitle-02.svg" alt="快速集结" width={1200} height={120} />
        </div>
        {/* Five heroes; each image is pre-positioned on a shared canvas. */}
        <div className={styles.roles} aria-hidden="true">
          {["01", "02", "03", "04", "05"].map((n) => (
            <div key={n} className={styles.role}>
              <Image src={`/wegame/teamup-hero-${n}.png`} alt="" width={900} height={900} sizes="40vw" />
            </div>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
