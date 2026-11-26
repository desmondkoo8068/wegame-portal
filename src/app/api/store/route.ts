/**
 * GET /api/store: everything the store page shows above 游戏推荐
 * (banner, release timeline, reservations, rankings) in one response.
 *
 * One request instead of four keeps the page simple: a single loading state
 * and a single retry. Recommendations are paginated, so they have their own
 * endpoint (./recommendations/[page]).
 */
import { storefront } from "@/data/store";

// Pre-rendered at build time and served as a static file (see /api/games).
export const dynamic = "force-static";

export async function GET() {
  // In development only, add a delay so the loading skeletons are visible.
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  return Response.json(storefront);
}
