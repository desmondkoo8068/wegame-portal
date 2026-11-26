/**
 * AI 游戏 (/store/ai): a recreation of wegame.com.cn/store/ai.html.
 *
 * Static content rendered on the server (see /store/video for why). The
 * carousel and the screenshot-swapping cards are small Client Components.
 */
import type { Metadata } from "next";
import { aiGames, featuredAiIds } from "@/data/storeAi";
import StorePageHeader from "@/components/store/StorePageHeader";
import AiShowcase from "@/components/store/ai/AiShowcase";
import AiGameCard from "@/components/store/ai/AiGameCard";

export const metadata: Metadata = {
  title: "AI 游戏 - WeGame游戏商店",
  description: "AI 游戏：打破预设，言出法随。把人工智能装进核心玩法的新游戏。",
};

export default function AiGamesPage() {
  const featured = featuredAiIds.map((id) => aiGames.find((game) => game.id === id)!);

  return (
    <main>
      <StorePageHeader
        title="AI 游戏"
        titleImage="/wegame/store/ai/title.png"
        backdrop="/wegame/store/ai/page-bg.avif"
        action={
          <a href="#" className="btn-glass shrink-0 border border-white/30 bg-white/5 px-8">
            游戏入驻
          </a>
        }
      />

      <AiShowcase games={featured} />

      <section aria-labelledby="ai-intro" className="container-page mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="ai-intro"
            className="mx-auto inline-flex items-center gap-4 rounded-full border border-brand/40 bg-linear-to-r from-brand/30 via-white/5 to-white/5 px-8 py-3 text-xl font-black text-white sm:px-16 sm:text-3xl"
          >
            <span className="text-brand">AI 游戏</span>
            打破预设，言出法随
          </h2>
          <p className="mt-6 text-[15px] leading-loose text-muted sm:text-lg">
            AI
            游戏就是把人工智能装进游戏的核心玩法和循环里。它不再按照固定剧本演绎，而是听懂你的奇思妙想，实时接招，让每一次操作都衍生出不重样的新奇体验。
          </p>
        </div>

        <ul className="mt-14 space-y-14">
          {aiGames.map((game) => (
            <li key={game.id}>
              <AiGameCard game={game} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
