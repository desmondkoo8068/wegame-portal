/**
 * Game catalogue for the "01 大作" (blockbusters) poster wall.
 *
 * Served by our own API route (src/app/api/games/route.ts) so the frontend
 * goes through a real network request, with real loading and error states.
 *
 * Posters are copies of the live site's assets, saved in /public/wegame.
 * Prices are in CNY (the real site's currency) for the geolocation +
 * local currency bonus (step 6). 0 means free-to-play.
 */

export interface Game {
  id: string;
  /** Chinese title, used as the poster's alt text. */
  title: string;
  /** Path under /public. Posters are 760x1000. */
  poster: string;
  priceCny: number;
}

const poster = (file: string) => `/wegame/posters/${file}.png`;

export const games: Game[] = [
  { id: "lol", title: "英雄联盟", poster: poster("lol"), priceCny: 0 },
  { id: "val", title: "无畏契约", poster: poster("val"), priceCny: 0 },
  { id: "df", title: "三角洲行动", poster: poster("df"), priceCny: 0 },
  { id: "cf", title: "穿越火线", poster: poster("cf"), priceCny: 0 },
  { id: "dnf", title: "地下城与勇士", poster: poster("dnf"), priceCny: 0 },
  { id: "heishenhua", title: "黑神话：悟空", poster: poster("heishenhua"), priceCny: 268 },
  { id: "ca", title: "暗区突围：无限", poster: poster("ca"), priceCny: 0 },
  { id: "mingchao", title: "鸣潮", poster: poster("mingchao"), priceCny: 0 },
  { id: "nba", title: "NBA2K Online 2", poster: poster("nba"), priceCny: 0 },
  { id: "poe", title: "流放之路", poster: poster("poe"), priceCny: 0 },
  { id: "rainbow", title: "彩虹六号：围攻", poster: poster("rainbow"), priceCny: 88 },
  { id: "cala", title: "卡拉彼丘", poster: poster("cala"), priceCny: 0 },
  { id: "heping", title: "和平精英", poster: poster("heping"), priceCny: 0 },
  { id: "bt", title: "生死狙击2", poster: poster("bt"), priceCny: 0 },
  { id: "sanguosha", title: "三国杀", poster: poster("sanguosha"), priceCny: 0 },
];
