"use client";
/**
 * FrameSection: "02 焕新" – one page with two steps (see FrameSection.module.css):
 *   0 "update": WEGAME 3.0 轻装上阵, the client window rebuilding itself
 *   1 "fast":   性能升级 轻快畅玩, the window tilting into a 3D floor
 *
 * The step comes from Redux (ui.pageStep), which the wheel/keys advance
 * before moving on to the next page. In scroll mode both steps are shown
 * one under the other (data-step="all").
 */
import AutoVideo from "@/components/ui/AutoVideo";
import { useAppSelector } from "@/store/hooks";
import PageSection from "./PageSection";
import styles from "./FrameSection.module.css";

export default function FrameSection() {
  const step = useAppSelector((state) => (state.ui.activePage === "frame" ? state.ui.pageStep : 0));
  const isFullPage = useAppSelector((state) => state.ui.isFullPage);

  return (
    <PageSection
      id="frame"
      label="02 焕新"
      data-step={isFullPage ? step : "all"}
      className={styles.frame}
    >
      {/* ---------- Step 0: update ---------- */}
      <div className={`${styles.panel} ${styles.update}`}>
        <Backdrop />
        <h2 className={styles.heading}>
          <span className="sr-only">WEGAME 3.0 轻装上阵</span>
          <span className={styles.title} aria-hidden="true" />
          <span className={styles.titleMask} aria-hidden="true">
            <span className={styles.titleUpdate} />
          </span>
          <span className={styles.titleNew} aria-hidden="true" />
        </h2>

        <div className={styles.block}>
          <div className={styles.refreshLight} aria-hidden="true" />
          <Lightbox />
          {/* The client window. Its ::before/::after are the old and new
              store screenshots; the parts below animate between them. */}
          <div className={styles.window} role="img" aria-label="WeGame 3.0 客户端商店首页">
            <div className={styles.sidebarKey} />
            <div className={styles.sidebarGame} />
            <div className={styles.search} />
            <div className={styles.store} />
          </div>
        </div>
      </div>

      {/* ---------- Step 1: fast ---------- */}
      <div className={`${styles.panel} ${styles.fast}`}>
        <Backdrop withLines />
        <h2 className={styles.heading}>
          <span className="sr-only">性能升级 轻快畅玩</span>
          <span className={styles.titleFast} aria-hidden="true" />
        </h2>

        <div className={styles.block}>
          <p className={styles.subtitle} role="img" aria-label="界面表现更丝滑，游戏体验零影响，助手稳定不掉帧" />
          <Lightbox />
          <div className={styles.window}>
            <div className={styles.video}>
              <AutoVideo
                src="/wegame/video/frame-mingchao.mp4"
                poster="/wegame/video/frame-mingchao-poster.jpg"
                pageId="frame"
              />
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

/** Orange chevrons + the perspective floor (lit with code in the fast step). */
function Backdrop({ withLines = false }: { withLines?: boolean }) {
  return (
    <div aria-hidden="true">
      <div className={styles.bg} />
      <div className={styles.floorWrap}>
        <div className={styles.floor}>{withLines && <div className={styles.lines} />}</div>
      </div>
    </div>
  );
}

/** Orange horizon light and code rain above the window. */
function Lightbox() {
  return (
    <div className={styles.lightbox} aria-hidden="true">
      <div className={styles.light} />
      <div className={styles.code} />
    </div>
  );
}
