/**
 * GET /api/games: returns the game catalogue as JSON.
 *
 * A Route Handler is Next.js's way of writing a small backend endpoint inside
 * the app. The frontend fetches this exactly like a real API, so we get real
 * loading and error states in the UI.
 */
import { games } from "@/data/games";

// The data never changes between requests, so generate the JSON once at
// build time and serve it as a static file (fast, and easy to cache offline).
export const dynamic = "force-static";

export async function GET() {
  // In development only, wait a moment so the loading skeletons are visible.
  // (In production this route is pre-rendered at build time, so it's instant.)
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  return Response.json({ games });
}
