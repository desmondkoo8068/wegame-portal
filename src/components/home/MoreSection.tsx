/**
 * MoreSection: the closing "WEGAME MORE" banner above the footer.
 *
 * A collage of game art (one wide image) scrolls upwards endlessly behind a
 * huge logo. Two copies of the image are stacked so the loop is seamless:
 * the animation moves the pair up by exactly one copy (-50%), then repeats.
 */
import Image from "next/image";
import PageSection from "./PageSection";

export default function MoreSection() {
  return (
    <PageSection
      id="more"
      label="WEGAME MORE"
      // Shorter than a full screen: this banner + the footer form the last page.
      className="h-[280px] sm:h-[380px] lg:h-[calc(562*var(--dp))] lg:min-h-0"
    >
      <div className="absolute inset-0 animate-roll" aria-hidden="true">
        {[0, 1].map((copy) => (
          <Image
            key={copy}
            src="/wegame/games.avif"
            alt=""
            width={1920}
            height={1100}
            sizes="100vw"
            className="h-auto w-full opacity-50"
          />
        ))}
      </div>

      {/* Orange glow from the top + fade to black at the bottom. */}
      <div className="absolute inset-0 bg-[radial-gradient(390%_107%_at_50%_-72%,rgb(255_132_51/0.4),rgb(204_65_0/0.15)_50%,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-page/40 to-page" />

      <Image
        src="/wegame/logo.svg"
        alt="WEGAME MORE"
        width={1680}
        height={162}
        className="absolute bottom-[6%] left-1/2 h-auto w-[90%] -translate-x-1/2 lg:w-[calc(1267*var(--dp))]"
      />
    </PageSection>
  );
}
