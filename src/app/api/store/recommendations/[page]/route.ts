/**
 * GET /api/store/recommendations/1, /2, /3: one page of 游戏推荐.
 *
 * Response: { items: Recommendation[], page: number, hasMore: boolean }
 *
 * The page number is a path segment (not ?page=1) so that every page can be
 * pre-rendered at build time with generateStaticParams. Pages outside the
 * list return 404 (dynamicParams = false).
 */
import { RECOMMENDATIONS_PAGE_SIZE, recommendations } from "@/data/store";

export const dynamic = "force-static";
export const dynamicParams = false;

const pageCount = Math.ceil(recommendations.length / RECOMMENDATIONS_PAGE_SIZE);

/** Tells Next.js which pages to build: [{ page: "1" }, { page: "2" }, ...]. */
export function generateStaticParams() {
  return Array.from({ length: pageCount }, (_, i) => ({ page: String(i + 1) }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);

  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  const start = (page - 1) * RECOMMENDATIONS_PAGE_SIZE;
  return Response.json({
    items: recommendations.slice(start, start + RECOMMENDATIONS_PAGE_SIZE),
    page,
    hasMore: page < pageCount,
  });
}
