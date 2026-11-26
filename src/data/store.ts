/**
 * Content for the 商店 (store) page, captured from wegame.com.cn/store.
 *
 * The real store loads all of this from Tencent's APIs. Here it's served by
 * our own route handlers (src/app/api/store/...), so the page goes through
 * real network requests with loading and error states, like the home page's
 * game wall.
 *
 * Images were downloaded from the live site into /public/wegame/store.
 */

const img = (path: string) => `/wegame/store/${path}`;

// ------------------------------------------------------------------ Types ---

/**
 * What a game costs / how you get it. A discriminated union: the `kind`
 * field tells TypeScript (and the <Offer> component) which shape it is.
 */
export type Offer =
  | { kind: "free" } // 免费开玩
  | { kind: "price"; cny: number; originalCny?: number } // ¥48, or a discount
  | { kind: "text"; text: string }; // 时长付费, 敬请期待, an event line…

export interface Banner {
  id: string;
  name: string;
  /** Small label above the title, e.g. 新游上线 / 版本更新. */
  theme: string;
  title: string;
  subtitle: string;
  /** Highlight chips, e.g. "热度榜 TOP 10". The first one is styled orange. */
  tags: string[];
  /** Player rating out of 10, if the game has one. */
  score?: number;
  /** Text of the call-to-action button. */
  cta: string;
  image: string; // 1908x1016 key art
  logo: string; // transparent game logo
  icon: string; // square icon for the side menu
}

export interface Release {
  id: string;
  name: string;
  /** 预约活动 / 现已上线 / 重大测试 / 即将上线 */
  status: string;
  /** Second line under the name: an event, or how to play / buy. */
  detail: Offer;
  cover: string;
  /** Released games use a wide 540x302 cover, upcoming ones a 300x430 poster. */
  wide?: boolean;
}

export interface ReleaseDay {
  /** "MM-DD". The page marks the group matching today's date with 今天. */
  date: string;
  /** Short tagline shown next to today's date, as on the live site. */
  highlight?: string;
  releases: Release[];
}

export interface Reservation {
  id: string;
  name: string;
  image: string;
  isNew?: boolean;
  /** Small cyan chip next to the name, e.g. 测试中. */
  badge?: string;
  /** Orange launch line, e.g. "12-04 正式上线". */
  launch?: string;
  pitch: string;
  /** Players who reserved, in units of 万 (10,000). */
  reservedWan: number;
}

export interface RankEntry {
  id: string;
  name: string;
  image: string;
  detail: Offer;
}

export interface RankList {
  id: "hot" | "reserve" | "sales" | "top";
  title: string;
  subtitle: string;
  /** Lists whose #1 is shown as a big cover image (火爆新品, 最高热度). */
  featureFirst: boolean;
  entries: RankEntry[];
}

export interface Recommendation {
  id: string;
  name: string;
  image: string;
  tags: string[];
  offer: Offer;
}

/** Everything the store page needs in its first request. */
export interface Storefront {
  banners: Banner[];
  releaseDays: ReleaseDay[];
  reservations: Reservation[];
  rankings: RankList[];
}

// -------------------------------------------------------- Store sub-nav ---

export const storeNav = [
  { id: "featured", label: "精选", href: "/store" },
  // The live site shows this event as an image link.
  { id: "trial", label: "燃点试玩开启中", href: "#", image: img("nav-trial.png") },
  { id: "ai", label: "AI 游戏", href: "/store/ai", isNew: true },
  { id: "video", label: "直播与视频", href: "/store/video" },
] as const;

/** Promo image link at the end of the store nav (a game launch event). */
export const storePromo = {
  label: "蓝色星原：旅谣 现已公测",
  href: "https://www.wegame.com.cn/act/online/lsxyly20261126qlfh7t3yl0kj/",
  image: img("nav-lanse.png"),
};

/** The 分类导航 (browse by category) dropdown. */
export const categoryGroups = [
  {
    title: "热门类型",
    items: ["大型网游", "单机", "动作RPG", "冒险RPG", "MMORPG", "FPS", "二次元"],
  },
  { title: "游戏特性", items: ["端手互通", "云游戏", "测试专区", "千万不分成"] },
  {
    title: "排行榜",
    items: [
      "火爆新品",
      "预约之星",
      "最高热度",
      "本周热销",
      "口碑佳作",
      "折扣促销",
      "最新测试",
      "新游预告",
    ],
  },
];

// --------------------------------------------------------------- Banner ---

const banner = (id: string, data: Omit<Banner, "id" | "image" | "logo" | "icon">): Banner => ({
  id,
  ...data,
  image: img(`banner/${id}.jpg`),
  logo: img(`banner/${id}-logo.png`),
  icon: img(`banner/${id}-icon.png`),
});

const banners: Banner[] = [
  banner("lanse", {
    name: "蓝色星原：旅谣",
    theme: "新游上线",
    title: "《蓝色星原：旅谣》现已公测",
    subtitle: "登录送510+抽，上线送五星美少女",
    tags: ["火爆榜 TOP 1", "热度榜 TOP 10"],
    cta: "免费开玩",
  }),
  banner("ro", {
    name: "仙境传说起源：怀旧版",
    theme: "新游上线",
    title: "Ro怀旧版 不肝不氪 玩法还原",
    subtitle: "创角瓜分百万Q币 领限定时装",
    tags: [],
    score: 9.2,
    cta: "时长付费",
  }),
  banner("hpjy", {
    name: "和平精英模拟器",
    theme: "版本更新",
    title: "全新M1887霰弹枪震撼上线",
    subtitle: "弹丸分布固定 近战抢占先机",
    tags: ["热度榜 TOP 5"],
    score: 8.3,
    cta: "免费开玩",
  }),
  banner("wzry", {
    name: "王者荣耀世界",
    theme: "版本更新",
    title: "新英雄【李白】即将上线",
    subtitle: "预约S2新赛季领专属礼包",
    tags: [],
    score: 8.1,
    cta: "免费开玩",
  }),
  banner("dnf", {
    name: "地下城与勇士经典版",
    theme: "测试招募",
    title: "DNF经典版预约现已开启",
    subtitle: "重逢测试招募同步火热进行中",
    tags: ["预约榜 TOP 1", "66.0 万人已预约"],
    cta: "预约",
  }),
  banner("sszj", {
    name: "生死狙击2",
    theme: "版本更新",
    title: "全新战备系统【荣耀集市】来袭~",
    subtitle: "账号唯一隐藏臻品手环首发！",
    tags: ["4639 人好评"],
    cta: "免费开玩",
  }),
  banner("tjxb", {
    name: "铁甲雄兵",
    theme: "版本更新",
    title: "轮回破境 启梦新生",
    subtitle: "花木兰星曜觉醒 拿专属福利",
    tags: [],
    score: 7.3,
    cta: "免费开玩",
  }),
];

// ------------------------------------------------------------- 新游发布 ---

const free: Offer = { kind: "free" };
const text = (value: string): Offer => ({ kind: "text", text: value });
const cny = (amount: number, originalCny?: number): Offer => ({
  kind: "price",
  cny: amount,
  originalCny,
});
const comingSoon = text("敬请期待");

const releaseDays: ReleaseDay[] = [
  {
    date: "11-19",
    releases: [
      {
        id: "mhlr",
        name: "怪物猎人：旅人",
        status: "预约活动",
        detail: text("预约抽5070显卡"),
        cover: img("release/mhlr.jpg"),
      },
    ],
  },
  {
    date: "11-20",
    releases: [
      {
        id: "douluo",
        name: "斗罗大陆：诛邪传说",
        status: "现已上线",
        detail: free,
        cover: img("release/douluo.jpg"),
      },
    ],
  },
  {
    date: "11-21",
    releases: [
      {
        id: "fight",
        name: "代号Fight",
        status: "预约活动",
        detail: text("DNF原版格斗开测啦"),
        cover: img("release/fight.jpg"),
      },
      {
        id: "dnf",
        name: "地下城与勇士经典版",
        status: "预约活动",
        detail: text("重逢测试招募开启"),
        cover: img("release/dnf.jpg"),
      },
    ],
  },
  {
    date: "11-25",
    releases: [
      {
        id: "shou",
        name: "狩",
        status: "预约活动",
        detail: text("腾讯新作已开启预约"),
        cover: img("release/shou.jpg"),
      },
    ],
  },
  {
    date: "11-26",
    highlight: "星宠结伴 幻想大世界RPG",
    releases: [
      {
        id: "lanse",
        name: "蓝色星原：旅谣",
        status: "现已上线",
        detail: free,
        cover: img("release/lanse.jpg"),
        wide: true,
      },
    ],
  },
  {
    date: "12-01",
    releases: [
      {
        id: "hglr",
        name: "弧光猎人",
        status: "重大测试",
        detail: comingSoon,
        cover: img("release/hglr.jpg"),
      },
    ],
  },
  {
    date: "12-03",
    releases: [
      {
        id: "wuyong",
        name: "无用之人：登神长阶",
        status: "即将上线",
        detail: comingSoon,
        cover: img("release/wuyong.jpg"),
      },
    ],
  },
  {
    date: "12-04",
    releases: [
      {
        id: "shiqi",
        name: "石器时代",
        status: "即将上线",
        detail: comingSoon,
        cover: img("release/shiqi.png"),
      },
    ],
  },
  {
    date: "12-17",
    releases: [
      {
        id: "yiren",
        name: "异人之下",
        status: "即将上线",
        detail: comingSoon,
        cover: img("release/yiren.png"),
      },
      {
        id: "kaleiduo",
        name: "追逐卡蕾多",
        status: "重大测试",
        detail: comingSoon,
        cover: img("release/kaleiduo.jpg"),
      },
    ],
  },
];

// ----------------------------------------------------------- 预约进行中 ---

const reservations: Reservation[] = [
  {
    id: "shou",
    name: "狩",
    image: img("appt/shou.jpg"),
    isNew: true,
    pitch: "稀有测试资格火热报名中",
    reservedWan: 6.6,
  },
  {
    id: "shiqi",
    name: "石器时代",
    image: img("appt/shiqi.png"),
    isNew: true,
    launch: "12-04 正式上线",
    pitch: "预约抽华为手机",
    reservedWan: 8.7,
  },
  {
    id: "yiren",
    name: "异人之下",
    image: img("appt/yiren.jpg"),
    badge: "测试中",
    launch: "12-17 正式上线",
    pitch: "预约解锁多重好礼",
    reservedWan: 416.0,
  },
  {
    id: "cfqf",
    name: "穿越火线：潜伏",
    image: img("appt/cfqf.jpg"),
    pitch: "穿越火线潜伏预约已开启",
    reservedWan: 369.4,
  },
  {
    id: "huijing",
    name: "灰境行者",
    image: img("appt/huijing.png"),
    pitch: "PvEvP猎杀夺宝FPS",
    reservedWan: 162.8,
  },
  {
    id: "r6",
    name: "彩虹六号：攻势",
    image: img("appt/r6.jpg"),
    pitch: "预约领墨冰自选涂装",
    reservedWan: 124.5,
  },
  {
    id: "jcc",
    name: "金铲铲之战 PC版（BETA测试）",
    image: img("appt/jcc.png"),
    launch: "12-03 正式上线",
    pitch: "金铲铲之战 PC 版下赛季见",
    reservedWan: 86.5,
  },
  {
    id: "zhanshu",
    name: "战术小队：破晓攻势",
    image: img("appt/zhanshu.png"),
    pitch: "预约赢5070显卡",
    reservedWan: 84.5,
  },
];

// --------------------------------------------------------------- 排行榜 ---

const rank = (id: string, name: string, file: string, detail: Offer): RankEntry => ({
  id,
  name,
  image: img(`rank/${file}`),
  detail,
});
const weekly = (wan: number) => text(`周预约人数 ${wan} 万`);

const rankings: RankList[] = [
  {
    id: "hot",
    title: "火爆新品",
    subtitle: "新游戏和新版本综合热度排行",
    featureFirst: true,
    entries: [
      rank("lanse", "蓝色星原：旅谣", "lanse-big.jpg", free),
      rank("qqfc", "QQ飞车", "qqfc.jpg", text("全民车神大赛")),
      rank("wanxiangqi", "王者万象棋", "wanxiangqi.jpg", free),
      rank("lanqiu", "篮球少女：飞跃巅峰", "lanqiu.jpg", free),
      rank("mu", "奇迹MU", "mu.jpg", text("新版本、新职业上线！")),
      rank("xuanyuan", "轩辕传奇怀旧服", "xuanyuan.jpg", free),
      rank("yimo", "伊莫", "yimo.jpg", free),
      rank("tiantang2", "天堂2：盟约", "tiantang2.jpg", free),
    ],
  },
  {
    id: "reserve",
    title: "预约之星",
    subtitle: "本周新增预约量排行",
    featureFirst: false,
    entries: [
      rank("dnf", "地下城与勇士经典版", "dnf.jpg", weekly(65.9)),
      rank("jcc", "金铲铲之战 PC版（BETA测试）", "jcc.png", weekly(20.1)),
      rank("hglr", "弧光猎人", "hglr.jpg", weekly(12.3)),
      rank("yiren", "异人之下", "yiren.jpg", weekly(10.3)),
      rank("fight", "代号Fight", "fight.jpg", weekly(8.5)),
      rank("shou", "狩", "shou.jpg", weekly(6.6)),
    ],
  },
  {
    id: "sales",
    title: "本周热销",
    subtitle: "本周销量排行",
    featureFirst: false,
    entries: [
      rank("poe2", "流放之路：降临 - 基础版", "poe2.jpg", cny(48)),
      rank("dst", "饥荒：联机版", "dst.jpg", cny(24)),
      rank("yzrl", "影之刃零", "yzrl.jpg", cny(268)),
      rank("yzrl-dlx", "影之刃零 数字豪华版", "yzrl-dlx.jpg", cny(328)),
      rank("stardew", "星露谷物语", "stardew.jpg", cny(48)),
      rank("wukong", "黑神话：悟空", "wukong.jpg", cny(268)),
    ],
  },
  {
    id: "top",
    title: "最高热度",
    subtitle: "本周下载量排行",
    featureFirst: true,
    entries: [
      rank("lol", "英雄联盟", "lol-big.jpg", free),
      rank("df", "三角洲行动", "df.jpg", free),
      rank("val", "无畏契约", "val.jpg", free),
      rank("cf", "穿越火线", "cf.jpg", free),
      rank("hpjy", "和平精英模拟器", "hpjy.jpg", free),
      rank("lanse", "蓝色星原：旅谣", "lanse.jpg", free),
      rank("lol-pbe", "英雄联盟体验服", "lol-pbe.jpg", free),
      rank("hglr", "弧光猎人", "hglr.jpg", comingSoon),
    ],
  },
];

export const storefront: Storefront = { banners, releaseDays, reservations, rankings };

// -------------------------------------------------------------- 游戏推荐 ---

const rec = (n: number, name: string, ext: string, tags: string[], offer: Offer) => ({
  id: `rec-${n}`,
  name,
  image: img(`rec/${String(n).padStart(2, "0")}.${ext}`),
  tags,
  offer,
});
const paidByTime = text("时长付费");

export const recommendations: Recommendation[] = [
  rec(1, "迅游加速器", "jpg", ["网络游戏"], paidByTime),
  rec(2, "穿越火线", "jpg", ["FPS", "战术射击", "爽快手感", "海外引进"], free),
  rec(3, "堡垒", "jpg", ["手绘画风", "动作RPG", "单机游戏", "RPG"], cny(48)),
  rec(4, "星际战甲", "png", ["FPS", "开放世界", "搜打撤", "动作RPG"], free),
  rec(5, "蜀山：初章 - 仙门集结", "png", ["沙盒建造", "MMORPG", "开放世界", "高画质"], paidByTime),
  rec(6, "奇迹MU", "jpg", ["MMORPG", "西方魔幻", "高自由度", "网络游戏"], free),
  rec(7, "迷失岛4小屋实验", "png", ["休闲", "解谜", "高画质", "音乐动听"], cny(18)),
  rec(8, "热血传奇怀旧版", "jpg", ["冒险RPG", "MMORPG", "动作RPG", "仙侠"], paidByTime),
  rec(9, "问道", "jpg", ["神话", "仙侠", "MMORPG", "国风"], free),
  rec(10, "QQ飞车", "jpg", ["赛车竞速", "休闲", "社交", "网络游戏"], free),
  rec(11, "仙境传说：爱如初见模拟器版", "jpg", ["MMORPG", "二次元", "冒险RPG", "西方魔幻"], free),
  rec(12, "轩辕传奇：轮回之沙", "jpg", ["神话", "国风", "仙侠", "大逃杀"], free),
  rec(13, "山门与幻境", "png", ["SLG", "模拟经营", "仙侠", "独立游戏"], cny(78)),
  rec(14, "水银疗养院", "jpg", ["独立游戏", "冒险RPG", "解谜", "二次元"], cny(68)),
  rec(15, "QQ幻想世界", "jpg", ["MMORPG", "魔幻", "免费", "网络游戏"], free),
  rec(16, "巨人Online", "jpg", ["科幻", "MMORPG", "军事", "机甲"], free),
  rec(17, "缺氧", "jpg", ["模拟经营", "独立游戏", "单机游戏"], cny(58)),
  rec(18, "迷你世界", "jpg", ["Q版画风", "沙盒建造", "网络游戏"], free),
  rec(19, "完蛋！我被美女包围了！", "jpg", ["恋爱", "剧情丰富", "模拟经营", "高画质"], cny(42)),
  rec(20, "大荒先民", "png", ["模拟经营", "单机游戏"], cny(76)),
  rec(21, "乂闻录：轮回", "png", ["武侠", "动作RPG", "冒险RPG", "国风"], cny(78)),
  rec(22, "地下城与勇士：创新世纪", "jpg", ["MMORPG", "动作冒险", "横版过关", "街机"], free),
  rec(23, "孤行异星", "png", ["俯视角", "爽快手感", "本地合作", "休闲"], cny(52)),
  rec(24, "二重螺旋", "jpg", ["二次元", "动作RPG", "TPS", "西方魔幻"], free),
  rec(25, "新天龙八部经典服", "jpg", ["MMORPG", "国风", "音乐动听", "唯美浪漫"], free),
  rec(26, "重返帝国（云游戏）", "jpg", ["即时战略", "SLG", "高画质", "网络游戏"], free),
  rec(27, "小飞船大冒险", "jpg", ["独立游戏", "弹幕射击", "俯视角", "爽快手感"], cny(58)),
  rec(28, "少年的人间奇遇", "jpg", ["二次元", "冒险RPG", "独立游戏", "手绘画风"], cny(32)),
  rec(29, "幻想三国志5", "jpg", ["神话", "三国", "Q版画风", "剧情丰富"], cny(65)),
  rec(30, "劲舞团", "jpg", ["音乐游戏", "休闲", "社交", "音乐动听"], free),
  rec(31, "爪爪特攻", "jpg", ["独立游戏", "Rogue-like", "Q版画风", "爽快手感"], cny(24)),
  rec(32, "天命奇御", "jpg", ["武侠", "剧情丰富", "动作RPG", "RPG"], cny(29, 58)),
  rec(33, "迷失之径", "png", ["独立游戏", "Rogue-like", "卡牌", "像素风格"], cny(38)),
  rec(34, "最终幻想14", "png", ["西方魔幻", "剧情丰富", "音乐动听", "MMORPG"], free),
  rec(35, "灵山奇缘", "jpg", ["MMORPG", "回合制", "玄幻", "免费"], free),
  rec(36, "英勇之地", "jpg", ["Rogue-like", "沙盒建造", "社交", "开放世界"], free),
];

/** How many recommendations one "page" of the API returns. */
export const RECOMMENDATIONS_PAGE_SIZE = 12;
