/**
 * Content for AI 游戏 (/store/ai), captured from wegame.com.cn/store/ai.html.
 * Images are in /public/wegame/store/ai.
 */

const a = (file: string) => `/wegame/store/ai/${file}`;

export interface AiGame {
  id: string;
  name: string;
  brief: string;
  /** "AI 原生": AI is the core of the game, not an add-on. Shown as a badge. */
  native: boolean;
  /** 评分 (players' score) for released games, 期待值 (anticipation) for upcoming ones. */
  rating?: { label: string; value: number };
  tags: string[];
  /** "AI 机制": how the game uses AI. */
  mechanics: string[];
  cover: string;
  screenshots: string[];
}

/** Ids of the games in the top carousel, in order. */
export const featuredAiIds = ["ai-4", "ai-5", "ai-2", "ai-3", "ai-6", "ai-7", "ai-8", "ai-1"];

export const aiGames: AiGame[] = [
  {
    id: "ai-1",
    name: "汪里个狼 Wolf in Woof",
    brief: "一个人也能玩的高能狼人杀",
    native: true,
    tags: [
      "休闲",
      "即时战略",
      "解谜",
      "社交",
      "高自由度",
      "手绘画风",
      "回合制",
      "独立游戏",
      "单机游戏",
    ],
    mechanics: ["游戏通过AI驱动狗狗角色进行狼人杀推理、发言与投票，打造动态变化的社交推理体验。"],
    cover: a("cover-08.jpg"),
    screenshots: [a("shot-29.jpg"), a("shot-30.jpg"), a("shot-31.jpg"), a("shot-32.jpg")],
  },
  {
    id: "ai-2",
    name: "星夜颂歌",
    brief: "世界首个次世代美少女全天候AI生活入口",
    native: true,
    rating: { label: "期待值", value: 8.1 },
    tags: ["二次元", "恋爱", "音乐动听", "单机游戏"],
    mechanics: ["世界首个次世代美少女全天候AI生活入口"],
    cover: a("cover-13.jpg"),
    screenshots: [a("shot-49.jpg"), a("shot-50.jpg"), a("shot-51.jpg"), a("shot-52.jpg")],
  },
  {
    id: "ai-3",
    name: "遥远行星：建造师",
    brief: "首款动态世界AI RPG游戏",
    native: true,
    rating: { label: "评分", value: 8.9 },
    tags: ["冒险RPG", "模拟经营", "太空", "Q版画风", "独立游戏", "RPG", "单机游戏"],
    mechanics: [
      "600+AI居民自主行动，个个都有自己的算盘",
      "和AI居民自由交谈，把口才变成生意本钱",
      "AI驱动星际物价，跑商起家，做荧河大亨",
    ],
    cover: a("cover-10.jpg"),
    screenshots: [a("shot-37.jpg"), a("shot-38.jpg"), a("shot-39.jpg"), a("shot-40.jpg")],
  },
  {
    id: "ai-4",
    name: "鹅次元",
    brief: "能够实时陪伴你游戏的AI伙伴！",
    native: false,
    rating: { label: "期待值", value: 7.8 },
    tags: ["AI 增强", "社交", "辅助工具", "工具类应用"],
    mechanics: [
      "能陪你游戏陪你聊天24小时为你在线的陪伴型AI数字人",
      "支持陪玩《英雄联盟》《无畏契约》《cs2》《影之刃零》",
      "打完游戏还能加她QQ好友，手机QQ上聊天",
      "AI角色形象、声音、性格各异，可以互动，有长记忆，还能一键换桌宠、换壁纸",
    ],
    cover: a("cover-11.jpg"),
    screenshots: [a("shot-41.jpg"), a("shot-42.jpg"), a("shot-43.jpg"), a("shot-44.jpg")],
  },
  {
    id: "ai-5",
    name: "喵呜岛",
    brief: "一座海岛，一群AI猫咪，把小岛经营成家。",
    native: true,
    rating: { label: "期待值", value: 8.4 },
    tags: ["休闲", "模拟经营", "独立游戏", "网络游戏"],
    mechanics: [
      "AI 驱动猫咪：岛上每只猫都有独立的性格、记忆和猫生目标",
      "词汇注入与延迟回响：你教给猫的话会在全岛传播，几天后从另一只猫嘴里冒出来",
      "AI 小剧场：猫与猫之间会自己演戏，台词里藏着你教过的词",
      "猫格培养：猫的性格在和你的相处中慢慢长出来，同一只猫在每座岛上都不一样",
      "AI 建造：用一句话描述想要的建筑，AI 生成后放上岛，还会成为小剧场的舞台",
    ],
    cover: a("cover-14.jpg"),
    screenshots: [a("shot-53.jpg"), a("shot-54.jpg"), a("shot-55.jpg"), a("shot-56.jpg")],
  },
  {
    id: "ai-6",
    name: "AI小镇：星原",
    brief: "首个AI自主生活模拟游戏",
    native: true,
    tags: ["模拟经营", "社交", "休闲", "Q版画风", "高画质", "网络游戏"],
    mechanics: [
      "可容纳百万AI共居交互，无穷故事在此涌现",
      "AI居民由玩家亲手定义，你遇见的每个都是 “世另他”",
      "专属AI导演，调动一草一木为你即兴生长故事",
      "离线后AI自主生活，小镇仍在演进，从未停歇",
      "AI自主社交，并把彼此的关系带给你",
    ],
    cover: a("cover-09.jpg"),
    screenshots: [a("shot-33.jpg"), a("shot-34.jpg"), a("shot-35.jpg"), a("shot-36.jpg")],
  },
  {
    id: "ai-7",
    name: "芽灵小屋",
    brief: "首款由记忆塑造角色的 AI 小人养成游戏",
    native: true,
    tags: ["模拟经营", "休闲", "社交", "像素风格", "俯视角", "独立游戏", "网络游戏"],
    mechanics: [
      "AI陪伴：遇见有自己想法的芽灵",
      "AI记忆：把你们的故事种进心灵花园",
      "AI生活：看看芽灵今天又想做什么",
      "AI工作：职场难题，也能脑洞大开",
    ],
    cover: a("cover-07.jpg"),
    screenshots: [a("shot-25.jpg"), a("shot-26.jpg"), a("shot-27.jpg"), a("shot-28.jpg")],
  },
  {
    id: "ai-8",
    name: "不问凡尘",
    brief: "超写实AI修仙，开放式角色扮演",
    native: true,
    tags: [
      "仙俠",
      "冒险RPG",
      "高自由度",
      "高画质",
      "AI 增强",
      "剧情丰富",
      "恋爱",
      "开放世界",
      "国风",
      "回合制",
      "互动影视",
      "RPG",
    ],
    mechanics: [
      "首款100% AI浓度修仙互动作品，已获特别好评",
      "300+名AI NPC，各有人设、深入互动",
      "AI创作互动内容，多重体验随心定义",
    ],
    cover: a("cover-04.jpg"),
    screenshots: [a("shot-13.jpg"), a("shot-14.jpg"), a("shot-15.jpg"), a("shot-16.jpg")],
  },
  {
    id: "ai-9",
    name: "千夜之书1001",
    brief: "在1001夜里，给AI国王讲故事",
    native: true,
    tags: ["文字冒险", "冒险RPG", "RPG", "单机游戏"],
    mechanics: [
      "游戏基于玩家的自由输入进行，通过大型语言模型驱动（如：国王续写故事），无法以任何方式预先准备内容。",
    ],
    cover: a("cover-12.jpg"),
    screenshots: [a("shot-45.jpg"), a("shot-46.jpg"), a("shot-47.jpg"), a("shot-48.jpg")],
  },
  {
    id: "ai-10",
    name: "觉醒AI",
    brief: "发明卡牌与机制的无限构筑",
    native: true,
    tags: ["Rogue-like", "卡牌", "独立游戏", "单机游戏"],
    mechanics: ["自由制作新构筑", "无限进化的对手", "设计自己的卡牌和搭档"],
    cover: a("cover-03.jpg"),
    screenshots: [a("shot-09.jpg"), a("shot-10.jpg"), a("shot-11.jpg"), a("shot-12.jpg")],
  },
  {
    id: "ai-11",
    name: "诡秘推理",
    brief: "揭开隐秘组织AIB背后的惊天阴谋",
    native: false,
    tags: ["解谜", "文字冒险", "剧情丰富", "高自由度", "独立游戏", "AI 增强", "单机游戏"],
    mechanics: ["使用AI让NPC可以和玩家交流，发现案件隐藏的线索。"],
    cover: a("cover-06.jpg"),
    screenshots: [a("shot-21.jpg"), a("shot-22.jpg"), a("shot-23.jpg"), a("shot-24.jpg")],
  },
  {
    id: "ai-12",
    name: "一语道破",
    brief: '你输入的话会被"编译"成真实的游戏机制',
    native: true,
    tags: ["解谜", "像素风格", "单机游戏"],
    mechanics: ["使用大语言模型编译玩家输入的游戏规则，然后让游戏规则在游戏中成为游戏机制的一部分"],
    cover: a("cover-01.jpg"),
    screenshots: [a("shot-01.jpg"), a("shot-02.jpg"), a("shot-03.jpg"), a("shot-04.jpg")],
  },
  {
    id: "ai-13",
    name: "失真唱片店：Lofi专注时光",
    brief: "捏出专属角色，陪你专注、聊天、听音乐",
    native: false,
    tags: [
      "休闲",
      "高画质",
      "高自由度",
      "音乐动听",
      "独立游戏",
      "辅助工具",
      "像素风格",
      "AI 增强",
      "单机游戏",
    ],
    mechanics: ["AI驱动角色对话"],
    cover: a("cover-02.jpg"),
    screenshots: [a("shot-05.jpg"), a("shot-06.jpg"), a("shot-07.jpg"), a("shot-08.jpg")],
  },
  {
    id: "ai-14",
    name: "爱哩爱哩",
    brief: "AI Agent 时代的多模态角色养成内容平台",
    native: true,
    tags: ["休闲", "放置类", "模拟经营", "独立游戏", "唯美浪漫", "网络游戏"],
    mechanics: ["日记配乐曲库中的曲目与唱片封面使用 AI 工具制作", "居民的生活由 AI 实时生成"],
    cover: a("cover-05.jpg"),
    screenshots: [a("shot-17.jpg"), a("shot-18.jpg"), a("shot-19.jpg"), a("shot-20.jpg")],
  },
];
